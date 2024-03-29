import React, {Component} from "react"
import * as fs            from "fs";
import * as babel         from "@babel/standalone";
import AceEditor          from "react-ace";
import ansiEscapes        from "ansi-escapes";
import tmp                from 'tmp';
import electron           from "electron";
import fixPath            from "fix-path";
import { exec }           from "child_process";
import { ptyInstance   }  from "../Helpers/PtyHelper";
import { xtermInstance }    from "../Helpers/XtermHelper";
import { Keyboard   }     from "../Helpers/Keyboard";
import colors             from "../constants/colors"



import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/theme/solarized_dark";
import "brace/theme/textmate";
import "brace/theme/dracula";
import "brace/mode/html";
import "brace/theme/xcode";
import "brace/snippets/html";
import "brace/ext/language_tools";

const { remote: { dialog }, ipcRenderer } = electron;
const keyboard = new Keyboard();
tmp.setGracefulCleanup();
fixPath();


let pathRegEX;
let firstLine;
let splitted;
let env;

class Editor extends Component {
    constructor(props) {
        super(props);
        this.timer  = null;
        this.tmpobj = tmp.fileSync({prefix:"srtch-", postfix:".js", dir:"/var/tmp" });

    }

    componentDidMount() {
        keyboard.addSaveListener(this.save);        
    }

    componentWillUnmount() {
        keyboard.removeSaveListener();
    }


    save = () => {
        dialog.showSaveDialog(null, {
          defaultPath:this.tmpobj.name
        }, path => {
          exec(`cp ${this.tmpobj.name} ${path}`);
        })
    }

    onChange = newValue => {

        // check if user need custom path for their node binary
        if (this.editor.editor.getCursorPosition().row === 0) {
            pathRegEX = RegExp(/\/\*.*\*\//g);
            firstLine = this.editor.editor.session.getLine(0);
            splitted = firstLine.slice(2, -2).trim().split("/")
            env = splitted[splitted.length - 1]
        }

        this.createExecutable(newValue);
        this.setTimer(async () => {
            xtermInstance.instance.write(ansiEscapes.clearTerminal);

            if (pathRegEX.test(firstLine)) {
               
                const trimmedLine = firstLine.slice(2, -2).trim();
                const prefix = trimmedLine[0] === "/" ? "" : "";
                ptyInstance.instance.write(`${prefix} ${trimmedLine} ${this.tmpobj.name}\n`);
            } else {
                exec('which node', (error, stdout, stderr) => {
                    if (error) alert(`exec error: ${error}`); 
                    else ptyInstance.instance.write(`${stdout.slice(0, stdout.length - 1)} ${this.tmpobj.name}\n`);
                });
            }
        })
        
    }

    asyncSetState = newState =>  
        new Promise((resolve) => {
            this.setState(newState, resolve);
        });
    

    createExecutable = data => {
        try {
            const result = babel.transform(data, { presets: ['es2015', 'react'] }).code;
            fs.writeFile(`${this.tmpobj.name}`, result, e => {
                if (e) throw new Error("couldnt create exacutable file. ERROR: ", e);
            })
        } catch (e) {
            console.log(e)
        }
    }

    setTimer = cb => {
        clearTimeout(this.timer);
        this.timer = setTimeout(cb, 1500)
    }

    render() {

        return (
            <div style={{backgroundColor:colors.dracula.main, padding:10}}>
                <AceEditor
                    ref={ref => this.editor = ref}
                    width="100%"
                    //style={{marginTop:10}}
                    placeholder={`  Start typing (:`}
                    mode="javascript"
                    theme="dracula"
                    name="blah2"
                    onChange={this.onChange}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    value={``}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                        highlightSelectedWord:true,
                        highlightActiveLine:false,
                        showGutter:false,
                        cursorStyle:"ace"
                    }}
                />
            </div>
        )
    }
      
}

export default Editor;