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
    }
  },
  terminalApi:{
    writeToTerminal(data){
      return ipcRenderer.send("terminal.toTerm", data)
    },
    onIncomingTerminalData(callback){
      ipcRenderer.on("terminal.incdata", (_event, data)=>{
        callback(data)
      })
    }
  }
})