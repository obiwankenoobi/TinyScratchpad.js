import React, { Component } from 'react';
import * as fit             from 'xterm/lib/addons/fit/fit';
import * as os              from "os";
import * as pty             from "node-pty";
import { Terminal }         from "xterm";
import { ptyInstance   }    from "./PtyHelper";
import { xtermInstance }    from "./XtermHelper";
import colors               from "../constants/colors"
import ansiEscapes          from "ansi-escapes";

Terminal.applyAddon(fit); 

class TerminalClass extends Component {
    constructor(props) {
        super(props);       
        this.ptyProcess;
        this.xterm = new Terminal({  
            theme: { background: colors.terminal.dracula, height:"100px" }
        });
    }

    componentDidMount() {
        this.initTerminal();
        this.xterm.onResize(() => {
        this.xterm.fit();
        })

        
    }

    initTerminal = () => {
        process.env.PROMPT_EOL_MARK = "";

        // Initialize node-pty with an appropriate shell
        const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.cwd(),
            env: process.env,
            handleFlowControl: true
        });
         console.log("process.env", process.env)

        
        // Initialize xterm.js and attach it to the DOM
        this.xterm.open(this.term);
        this.xterm.fit();

        // Setup communication between xterm.js and node-pty
        this.xterm.on('data', (data) => {
            this.ptyProcess.write(data);
        });
        
        this.ptyProcess.on('data', (data) => {
            console.log("data outside", data)
            if (!data.includes("node /var/tmp/tmp-")) {
                console.log("data inside", data)
                this.xterm.write(data); 
            }
 
        });

        this.ptyProcess.write("export PS1='☺️ '\n"); 
        this.ptyProcess.write("clear\n"); 

        xtermInstance.init(this.xterm);
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
                backgroundColor:colors.terminal.dracula,
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