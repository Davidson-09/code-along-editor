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
      console.log('running...')
      console.log(folderPath)
      return ipcRenderer.invoke('build file tree', folderPath)
    }
  }
})