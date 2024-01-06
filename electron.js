const { app, BrowserWindow, ipcMain, Notification, dialog} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { buildTree } = require('./src/utility/buildFileTree');
const { openFile, saveFile } = require('./src/utility/fileFunctions');
const os = require("os")
const pty = require("node-pty")

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    alwaysOnTop: true
  });

  ipcMain.on('notify', (_, message)=>{
    new Notification({title: 'Notification', body: message}).show()
  })

  ipcMain.handle('open file dialog', async ()=>{
    try{
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      console.log(result, 'the result')
      if (!result.canceled){
        var ptyprocess = pty.spawn(shell, [], {
          name: "xterm-color",
          cols: 80,
          rows: 24,
          cwd: result.filePaths[0],
          env: process.env
        })
      
        ptyprocess.on("data", function(data){
          mainWindow.webContents.send("terminal.incdata", data) // respond to incoming data from the local machine
        })
      
        ipcMain.on("terminal.toTerm", function(event, data){
          ptyprocess.write(data) //respond to data from xterm in the renderer process
        })
      }
      return result
    }catch(e){
      throw new Error(e)
    }
  })

  ipcMain.handle('build file tree', (_, folderPath)=>(buildTree(folderPath)))

  ipcMain.handle('open file', (_, item)=>(openFile(item)))

  ipcMain.handle('open save file dialog', (_, folderPath)=>{
    try{
      const result = dialog.showSaveDialog(mainWindow, {
        defaultPath: folderPath
      })
      return result
    }catch(e){
      throw new Error(e)
    }
  })

  ipcMain.handle('save file', (_, {filePath, newValue})=>{
    console.log(newValue, 'the new value')
    try{
      saveFile(filePath, newValue)
    }catch(e){
      throw new Error(e)
    }
  })

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

