import React from 'react'
import { Editor } from '@monaco-editor/react'
import fileIcon from '../assets/icons/files.svg'

export default function EditorPage() {

  const test=()=>{
    console.log('testing')
    // electron.notificationApi.sendNotification('testing this')
  }

  return (
    <div>
        <div className='p-3'>
              <img src={fileIcon} alt='files' onClick={test}/>
        </div>
        <Editor height="100vh" defaultLanguage="javascript" defaultValue="//code along" theme='vs-dark' />;
    </div>
  )
}
