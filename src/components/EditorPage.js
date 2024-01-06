import React, { useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import fileIcon from '../assets/icons/files.svg'
import FileSelector from './FileSelector'
import newFileIcon from '../assets/icons/newFile.svg'
import { useDispatch, useSelector } from 'react-redux'
import { changeCurrentFile } from '../redux/features/currentFIle/currentFileSlice'
import { getProgrammingLanguage} from '../utility/fileFunctions'
import TerminalComponent from './TerminalComponent'

export default function EditorPage() {

  const [selectedFolderPath, setSelectedFolderPath] = useState(null)
  const [fileTree, setFileTree] = useState(null)
  const [fileSelectorIsVisible, setFileSelectorIsVisible] = useState(false)
  const [editorValue, setEditorValue] = useState(null) // content of the editor
  const [editorIsVisible, setEditorIsVisible] = useState(false)
  const [currentFileName, setCurrentFileName] = useState('')
  const [currentLanguage, setCurrentLanguage] = useState('')
  const dispatch = useDispatch()

  const currentFile = useSelector(state => state.currentFile.value)

  // first useEffect
  useEffect(()=>{
    // load current file
    if (currentFile){
      setEditorValue(currentFile.fileContent)
      setCurrentFileName(currentFile.index)
      setCurrentLanguage(currentFile.programmingLanguage.toLowerCase())
      
    }

    // build the file tree for the sidebar
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
  }, [selectedFolderPath, currentFile])

  //second useEffect
  useEffect(()=>{
    const handleKeyDown = async (event) => {
      // Check if Ctrl (or Command on Mac) and 's' are pressed
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // Prevent the default browser save action
        // Your custom logic for Ctrl+s goes her
        if (currentFile){
          if (currentFile.fileContent !== editorValue){
            try{
              const filePath = currentFile.path
              await window.electronApi.filesApi.saveFileChanges({filePath, newValue:editorValue})
              // update the value of current file
              const updatedFileItem = {...currentFile}
              updatedFileItem.fileContent = editorValue
              dispatch(changeCurrentFile(updatedFileItem))
            }catch(e){
              alert(e)
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown)
    return ()=>{
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editorValue, currentFile, dispatch])

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
      // create the file
      const result = await window.electronApi.filesApi.saveNewFile(selectedFolderPath)
      // set current file to the new file
      if (!result.canceled){
        const lastSeparatorIndex = result.filePath.lastIndexOf('/')
        const fileName = result.filePath.substring(lastSeparatorIndex + 1)
        const newFileItem = {
          index: fileName,
          data: fileName,
          path: result.filePath,
          isNewFile: true,
          programmingLanguage: getProgrammingLanguage(result.filePath),
          fileContent: ''
        }
        dispatch(changeCurrentFile(newFileItem))
      }
      // add the new file to folder structure
    } catch(e){
      alert(e)
    }
  }

  const handlefolderBtnClick =()=>{
    openFolderSelect().then((result)=>{
      if(!result.canceled){
        setSelectedFolderPath(result.filePaths[0])
        setEditorIsVisible(true)
      }
    }).catch((e)=>{
      alert(e)
    })
  }

  const handleEditorChange =(value)=>{
    setEditorValue(value)
  }

  return (
    <div>
      {
        editorIsVisible?(
          <div>
            {fileSelectorIsVisible && <FileSelector fileTree={fileTree} setIsVisble={setFileSelectorIsVisible} setData={setEditorValue} />}
            <div className='p-3 flex space-x-4'>
              <div className='flex space-x-4'>
                <img src={fileIcon} alt='files' onClick={()=>setFileSelectorIsVisible(true)} className='cursor-pointer h-6 w-6'/>
                <img src={newFileIcon} alt='create new file' onClick={handleCreateNewFile} className='cursor-pointer h-6 w-6'/>
              </div>
              <p className='flex-1 text-center'>{currentFileName} {currentFile && editorValue !== currentFile.fileContent && <span>*</span>}</p>
            </div>
            {
              editorValue !== null? (
                <Editor height="100vh" defaultLanguage='javascript' language={currentLanguage} value={editorValue} onChange={(value)=> handleEditorChange(value)}/>
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
      <TerminalComponent/>
    </div>
  )
}
