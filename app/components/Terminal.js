import React, { Component } from 'react';
import { Terminal } from "xterm";
import * as fit from 'xterm/lib/addons/fit/fit';
import * as os from "os";
import * as pty from "node-pty";
import { ptyInstance } from "./PtyHelper";
import { xtermInstance } from "./XtermHelper";

Terminal.applyAddon(fit); 
let ptyProcess;


// import React, { Component } from 'react';
const xterm = new Terminal({  
    theme: { background: '#30312A' }
});

//xtermInstance.init(xterm);

class TerminalClass extends Component {
    constructor(props) {
        super(props);        
    }

    componentDidMount() {
        this.initTerminal();
        // window.addEventListener("resize", () => {
        //     console.log("resize", window.innerWidth);
        //     xterm.fit();
        //     console.log(xtermInstance.instane)
        //   })
    }

    

    initTerminal() {
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
        xterm.open(this.term);
        xterm.fit();
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

            <div style={{
                justifyContent:"center",
                alignContent:"center",
                alignItems:"center",
                justifyItems:"center",
                display:"flex",
                //padding:"10px",
                width:window.innerWidth,
                backgroundColor:"#30312A"
            }}>
            <div 
                style={{width:"98%"}} 
                id="terminal" 
                ref={ref => this.term = ref}
            />  
            </div>

        )
     }

}

export default TerminalClass;