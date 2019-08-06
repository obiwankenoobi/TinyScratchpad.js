import { Terminal, ITheme } from "xterm";
import * as os from "os";
import * as pty from "node-pty";
import * as fs from "fs";
import { ptyInstance } from "./PtyHelper";
let ptyProcess;


// import React, { Component } from 'react';
const xterm = new Terminal({  
    theme: {
        background: '#30312A',
        
    }
});


import React, { Component } from 'react';

class TerminalClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer:0
        }
        
    }

    componentDidMount() {
        this.initTerminal();
    }


    runScript() {
        const self = this;
        console.log("self", self)
        // this.setState({
        //     run:"node __script__.js"
        // })
        // ptyProcess.write("node __script__.js\r");
    }

    initTerminal() {
        const self = this;
        // Initialize node-pty with an appropriate shell
        const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
        ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.cwd(),
            env: process.env
        });
     
        // Initialize xterm.js and attach it to the DOM
        xterm.open(self.term);
        //ptyProcess.write("node\r");
        //xterm.clear();
        // Setup communication between xterm.js and node-pty
        xterm.on('data', (data) => {
            ptyProcess.write(data);
        });
        ptyProcess.on('data', function (data) {
            xterm.write(data);
        });

        ptyInstance.init(ptyProcess);
     }

     render() {
         return(
             <div>
                <div style={{
                    justifyContent:"center",
                    alignContent:"center",
                    alignItems:"center",
                    justifyItems:"center",
                    display:"flex",
                    //padding:"10px",
                    width:"100%",
                    backgroundColor:"#30312A"
                }}>
                    <div 
                        style={{width:"98%"}} 
                        id="terminal" 
                        ref={ref => this.term = ref}
                    />
                    
                </div>
                <button onClick={this.runScript}>run</button>
            </div>
        )
     }

}

export default TerminalClass;