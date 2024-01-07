import React from 'react'
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import cancelIcon from '../assets/icons/cancel.svg'
import { getProgrammingLanguage } from '../utility/fileFunctions';
import { useDispatch } from 'react-redux'
import { changeCurrentFile } from '../redux/features/currentFIle/currentFileSlice'

export default function FileSelector({fileTree, setIsVisble, setData}) {

    const dispatch = useDispatch()

    const openFile = async (item)=>{
        try{
            const fileContent = await window.electronApi.filesApi.openFile(item)
            const newCurrentFile = {
                ...item,
                isNewFile: false,
                programmingLanguage: getProgrammingLanguage(item.path),
                fileContent
            }
            dispatch(changeCurrentFile(newCurrentFile))
            // update current file item
        } catch(e){
            alert(e)
        }
    }

    return (
    <div className='h-screen absolute bg-white border border-black border-r-gray-700 z-30 top-0 overflow-scroll max-w-sm'>
        <div className='bg-gray-200 flex items-center justify-between p-3'>
            <p className='text-black'>File Explorer</p>
            <div className='hover:bg-gray-300 p-1 rounded-full' onClick={()=>setIsVisble(false)}>
                <img src={cancelIcon} alt='close file selector' className='h-4 w-4'/>
            </div>
        </div>
        
        <UncontrolledTreeEnvironment
        dataProvider={new StaticTreeDataProvider(fileTree, (item, data) => ({ ...item, data }))}
        getItemTitle={item => item.data}
        onFocusItem={item => openFile(item)}
        onRenameItem={async(item, name) => {
            try{
                await window.electronApi.filesApi.renameFile(item.path, name)
            }catch(e){
                alert(e)
            }
        }}
        viewState={{}}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
    </div>

    )
}
