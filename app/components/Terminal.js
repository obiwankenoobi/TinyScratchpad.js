import React, { Component } from 'react';
import { Terminal } from "xterm";
import * as fit from 'xterm/lib/addons/fit/fit';
import * as os from "os";
import * as pty from "node-pty";
import { ptyInstance } from "./PtyHelper";

Terminal.applyAddon(fit); 


class TerminalClass extends Component {
    constructor(props) {
        super(props);       
        this.ptyProcess;
        this.xterm = new Terminal({  
            theme: { background: '#30312A', height:"100px" }
        });
    }

    componentDidMount() {
        this.initTerminal();
    }

    initTerminal = () => {
        // Initialize node-pty with an appropriate shell
        const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.cwd(),
            env: process.env
        });
     
        // Initialize xterm.js and attach it to the DOM
        this.xterm.open(this.term);
        this.xterm.fit();
        // Setup communication between xterm.js and node-pty
        this.xterm.on('data', (data) => {
            this.ptyProcess.write(data);
        });

        
        this.ptyProcess.on('data', (data) => {
            this.xterm.write(data);  
        });

        ptyInstance.init(this.ptyProcess);
     }

     render() {
         
         return(
            <div style={{
                justifyContent:"center",
                alignContent:"center",
                alignItems:"center",
                justifyItems:"center",
                display:"flex",
                width:window.innerWidth,
                backgroundColor:"#30312A",
            }}>
            <div 
                style={{width:"98%", height:"300px"}} 
                id="terminal" 
                ref={ref => this.term = ref}
            />  
            </div>

        )
     }

}

export default TerminalClass;