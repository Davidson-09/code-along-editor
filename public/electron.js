const { app, BrowserWindow, ipcMain, Notification, dialog} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { buildTree } = require('./src/utility/buildFileTree');
const { openFile, saveFile, deleteFile, renameFile } = require('./src/utility/fileFunctions');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 250,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    alwaysOnTop: true,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  });

  ipcMain.on('notify', (_, message)=>{
    new Notification({title: 'Notification', body: message}).show()
  })

  ipcMain.handle('open file dialog', async ()=>{
    try{
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
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
    try{
      saveFile(filePath, newValue)
    }catch(e){
      throw new Error(e)
    }
  })

  ipcMain.handle('delete file', (_, filePath)=>{
    try{
      deleteFile(filePath)
    }catch(e){
      throw new Error(e)
    }
  })

  ipcMain.handle('rename file', (_, {filePath, name})=>{
    try{
      return renameFile(filePath, name)
    }catch(e){
      throw new Error(e)
    }
  })

  ipcMain.handle('minimize window', ()=>{
    mainWindow.minimize()
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

