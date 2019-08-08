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
        this.state = {
            loading: true
        }
        this.ptyProcess;
        this.xterm = new Terminal({  
            theme: { background: colors.dracula.sub, height:"100px" }
        });
    }

    componentDidMount() {
        this.initTerminal();
        setTimeout(() => this.setState({ loading:false }), 1500)
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
            this.xterm.write(data); 
        });

        this.ptyProcess.write("export PS1='☺️ '\n"); 
        this.ptyProcess.write("clear\n"); 

        xtermInstance.init(this.xterm);
        ptyInstance.init(this.ptyProcess);
     }

     render() {
         const { loading } = this.state;
         return (
            <div style={{
                justifyContent:"center",
                alignContent:"center",
                alignItems:"center",
                justifyItems:"center",
                display:"flex",
                width:window.innerWidth,
                backgroundColor:colors.dracula.sub,
            }}>
                <div 
                    style={{width:"98%", height:"300px", visibility: loading ? "hidden" : "visible"}} 
                    id="terminal" 
                    ref={ref => this.term = ref}
                />             
            </div>
        )
     }

}

export default TerminalClass;