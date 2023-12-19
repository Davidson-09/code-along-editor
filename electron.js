const { app, BrowserWindow, ipcMain, Notification, dialog} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { buildTree } = require('./src/utility/buildFileTree');

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

  ipcMain.handle('open file dialog', ()=>{
    try{
      const result = dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      console.log(result)
      return result
    }catch(e){
      throw new Error(e)
    }
  })

  ipcMain.handle('build file tree', (_, folderPath)=>(buildTree(folderPath)))

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

