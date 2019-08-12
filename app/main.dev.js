/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, globalShortcut, dialog, ipcMain, Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { menubar } from 'menubar';
import MenuBuilder from './menu';
import { savingHelper }  from "./Helpers/SavingHelper";
import * as fs            from "fs";
import { exec } from "child_process";

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on("quit", () => {
  exec("rm /var/tmp/srtch-*")
})

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  // notification setup 
  // if (Notification.isSupported()) {
  //   const notification = new Notification({
  //     actions: {
  //       type:"button",
  //       text:"update"
  //     },
  //     title: "TinyScratchpad.js",
  //     body: "Update available! Download the latest version to enjoy all our new features!"
  //   });
  //   notification.on("show", () => console.log("notification called"))
  //   notification.show();
  // }



  mainWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 820,
    webPreferences: {
      devTools: process.env.NODE_ENV === 'development' ? true : false
    }
  });

  const mb = menubar({
    show: false,
    browserWindow: {
      width: 600,
      height: 820,
    },
    index:`file://${__dirname}/app.html`,
    resizable: false
  });

  mb.on('ready', () => {
    console.log('Menubar app is ready.');
  });




  //mainWindow.loadURL(`file://${__dirname}/app.html`);
  

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
