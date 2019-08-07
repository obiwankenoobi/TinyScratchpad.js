import React, {Component} from "react"
import AceEditor from 'react-ace';
import * as fs from "fs";
import tmp from 'tmp';
import { ptyInstance } from "./PtyHelper";
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import * as babel from "@babel/standalone";
import * as path from "path";

console.log("babel", babel)


class Editor extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.tmpobj = tmp.fileSync({postfix: '_script_.js' });
    }

    onChange = newValue => {
        this.createExecutable(newValue)
        this.setTimer(() => {
            ptyInstance.instance.write(`node ${this.tmpobj.name}\r`);
        })
        
    }

    createExecutable = data => {
        try {
            const result = babel.transform(data, { presets: ['es2015', 'react'] }).code;
            fs.writeFile(`${this.tmpobj.name}`, result, e => {
                if (e) {
                    throw new Error("couldnt create exacutable file. ERROR: ", e);
                }
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
            <AceEditor
                style={{width:"100%"}}
                placeholder="Start typing (:"
                mode="javascript"
                theme="monokai"
                name="blah2"
                onLoad={this.onLoad}
                onChange={this.onChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={``}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
        )
    }
      
}

export default Editor;