const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message);
    }
  },
  batteryApi: {

  },
  filesApi: {
    async chooseDirectory(){
      return ipcRenderer.invoke('open file dialog')
    },
    buildFileTree(folderPath){
      return ipcRenderer.invoke('build file tree', folderPath)
    },
    openFile(item){
      return ipcRenderer.invoke('open file', item)
    },
    saveNewFile(folderPath){
      return ipcRenderer.invoke('open save file dialog', folderPath)
    },
    saveFileChanges({filePath, newValue}){
      return ipcRenderer.invoke('save file', {filePath, newValue})
    },
    deleteFile(filePath){
      return ipcRenderer.invoke('delete file', filePath)
    },
    renameFile(filePath, name){
      return ipcRenderer.invoke('rename file', {filePath, name})
    }
  },
  windowApi:{
    minimize(){
      return ipcRenderer.invoke('minimize window')
    }
  }
})