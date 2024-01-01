import React, { useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import fileIcon from '../assets/icons/files.svg'
import FileSelector from './FileSelector'
import newFileIcon from '../assets/icons/newFile.svg'

export default function EditorPage() {

  const [selectedFolderPath, setSelectedFolderPath] = useState(null)
  const [fileTree, setFileTree] = useState(null)
  const [fileSelectorIsVisible, setFileSelectorIsVisible] = useState(false)
  const [data, setData] = useState(null)
  const [editorIsVisible, setEditorIsVisible] = useState(false)

  

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
      return result
    }catch(e){
      throw new Error(e)
    }
  }

  const handleCreateNewFile = async()=>{
    try{
      console.log(JSON.stringify(selectedFolderPath))
      const result = await window.electronApi.filesApi.saveNewFile(selectedFolderPath)
    } catch(e){
      alert(e)
    }
  }

  const handlefolderBtnClick =()=>{
    openFolderSelect().then((result)=>{
      console.log(result, 'second result')
      if(!result.canceled){
        setSelectedFolderPath(result.filePaths[0])
        setEditorIsVisible(true)
      }
    }).catch((e)=>{
      alert('error occured while choosing folder')
    })
  }

  return (
    <div>
      {
        editorIsVisible?(
          <div>
            {fileSelectorIsVisible && <FileSelector fileTree={fileTree} setIsVisble={setFileSelectorIsVisible} setData={setData} />}
            <div className='p-3 flex space-x-4'>
                  <img src={fileIcon} alt='files' onClick={()=>setFileSelectorIsVisible(true)} className='cursor-pointer h-6 w-6'/>
                  <img src={newFileIcon} alt='create new file' onClick={handleCreateNewFile} className='cursor-pointer h-6 w-6'/>
            </div>
            {
              data !== null? (
                <Editor height="100vh" defaultLanguage='javascript' defaultValue="//code along"  value={data}/>
              ):(
                <div className='h-screen w-full bg-gray-100 flex justify-center items-center'>
                  <p>Click on file icon to select a file or create a new file to get started</p>
                </div>
              )
            }
            
          </div>
        ):(
          <div className='flex h-screen w-full bg-gray-100 flex-col justify-center items-center space-y-4'>
            <p className='text-xl'>Choose a folder to get started</p>
            <button className='py-3 px-4 bg-gray-300 rounded-lg font-bold' onClick={()=>handlefolderBtnClick()}>
              Choose folder
            </button>
          </div>
        )
      }
    </div>
  )
}
