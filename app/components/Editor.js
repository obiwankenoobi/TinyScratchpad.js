import React, {Component} from "react"
import * as fs            from "fs";
import * as babel         from "@babel/standalone";
import * as path          from "path";
import AceEditor          from "react-ace";
import tmp                from 'tmp';
import { ptyInstance   }  from "../Helpers/PtyHelper";
import { Keyboard   }     from "../Helpers/Keyboard";
import { xtermInstance }  from "../Helpers/XtermHelper";
import { savingHelper }   from "../Helpers/SavingHelper";
import ansiEscapes        from "ansi-escapes";
import colors             from "../constants/colors"
import electron           from "electron";
import mousetrap          from "mousetrap";
import { exec }           from "child_process";


const { remote: { dialog }, ipcRenderer } = electron;
const keyboard = new Keyboard()


import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/theme/solarized_dark";
import "brace/theme/textmate";
import "brace/theme/dracula";
import "brace/mode/html";
import "brace/theme/xcode";
import "brace/snippets/html";
import "brace/ext/language_tools";

tmp.setGracefulCleanup();

console.log("mousetrap", mousetrap)


class Editor extends Component {
    constructor(props) {
        super(props);
        this.timer  = null;
        this.tmpobj = tmp.fileSync({postfix: '.js', dir:"/var/tmp" });
    }

    componentWillUnmount() {
        keyboard.removeSaveListener();
    }

    componentDidMount() {
        keyboard.addSaveListener(this.save)
    }

    save = () => {
        console.log("binding shortcut")
        dialog.showSaveDialog(null, {
          defaultPath:this.tmpobj.name
        }, path => {
          exec(`cp ${this.tmpobj.name} ${path}`)
          console.log("file " + this.tmpobj.name + " was saveed to " + path)
        })
    }

    onChange = newValue => {
        this.createExecutable(newValue)
        this.setTimer(() => {
            ptyInstance.instance.write(`node ${this.tmpobj.name}\n`);
        })
        
    }

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