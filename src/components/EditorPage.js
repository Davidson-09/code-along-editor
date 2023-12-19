import React, { useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import fileIcon from '../assets/icons/files.svg'
import FileSelector from './FileSelector'

export default function EditorPage() {

  const [selectedFolderPath, setSelectedFolderPath] = useState(null)
  const [fileTree, setFileTree] = useState(null)
  const [fileSelectorIsVisible, setFileSelectorIsVisible] = useState(false)

  

  useEffect(()=>{
    if (selectedFolderPath !== null){
      const getFileTree =async ()=>{
        try{
          const tree = await window.electronApi.filesApi.buildFileTree(selectedFolderPath)
          return tree
        }catch(e){
          alert(e)
        }
      }
      getFileTree().then(tree=>{
        setFileTree(tree)
      })
    }
  }, [selectedFolderPath])

  const openFolderSelect= async ()=>{
    try{
      const result = await window.electronApi.filesApi.chooseDirectory()
      console.log(result.filePaths[0], 'the file path')
      setSelectedFolderPath(result.filePaths[0])
    }catch(e){
      alert(e)
    }
  }

  const handleFileView =()=>{
    if (selectedFolderPath !== null){
      // open file view
      setFileSelectorIsVisible(true)
    }else{
      openFolderSelect()
    }
  }

  return (
    <div>
        <div className='p-3'>
              <img src={fileIcon} alt='files' onClick={handleFileView} className='cursor-pointer'/>
        </div>
        <Editor height="100vh" defaultLanguage="javascript" defaultValue="//code along" theme='vs-dark' />;
        {fileSelectorIsVisible && <FileSelector fileTree={fileTree}/>}
    </div>
  )
}
