// import * as path from 'path';
// import amdLoader from 'monaco-editor/min/vs/loader.js';
// const amdRequire   = amdLoader.require;
// const amdDefine    = amdLoader.require.define;
import React, {Component} from "react"
import brace from 'brace';
import AceEditor from 'react-ace';
import * as fs from "fs";
import { ptyInstance } from "./PtyHelper";
import 'brace/mode/javascript';
import 'brace/theme/monokai';



function createExecutable(data) {
    fs.writeFile("./__script__.js", data, e => {
        if (e) {
            throw new Error("couldnt create exacutable file. ERROR: ", e);
        }
    })
}

let buffer = "";
let timer = null;

function setTimer(cb) {
    clearTimeout(timer);
    timer = setTimeout(cb, 1000)
}


class Editor extends Component {

    constructor(props) {
        super(props) 
        this.state = {
            timer:0
        }

        
        
    };
    


    onChange(newValue) {
        //this.setState({timer: new Date().getTime()});
        createExecutable(newValue)
        setTimer(() => {
            ptyInstance.instance.write("node __script__.js\r");
        })
        
    }

    render() {
        return (
            <AceEditor
                style={{width:"100%"}}
                placeholder="Placeholder Text"
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