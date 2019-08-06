// import * as path from 'path';
// import amdLoader from 'monaco-editor/min/vs/loader.js';
// const amdRequire   = amdLoader.require;
// const amdDefine    = amdLoader.require.define;
import React, {Component} from "react"
import AceEditor from 'react-ace';
import * as fs from "fs";
import tmp from 'tmp';
import { ptyInstance } from "./PtyHelper";
import 'brace/mode/javascript';
import 'brace/theme/monokai';


const tmpobj = tmp.dirSync();


function createExecutable(data) {
    fs.writeFile(`${tmpobj.name}/__script__.js`, data, e => {
        if (e) {
            throw new Error("couldnt create exacutable file. ERROR: ", e);
        }
    })
}


let timer = null;

function setTimer(cb) {
    clearTimeout(timer);
    timer = setTimeout(cb, 1000)
}


class Editor extends Component {

    onChange(newValue) {
        //this.setState({timer: new Date().getTime()});
        createExecutable(newValue)
        setTimer(() => {
            ptyInstance.instance.write(`node ${tmpobj.name}/__script__.js\r`);  
        })
        
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