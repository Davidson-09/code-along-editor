import React, { useEffect } from 'react'
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import cancelIcon from '../assets/icons/cancel.svg'

export default function FileSelector({fileTree, setIsVisble, setData}) {

    const openFile = async (item)=>{
        try{
            const data = await window.electronApi.filesApi.openFile(item)
            setData(data)
        } catch(e){
            alert(e)
        }
    }

    return (
    <div className='h-screen absolute bg-white border border-black border-r-gray-700 z-10 top-0 overflow-scroll max-w-sm'>
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
        onRenameItem={item => console.log('item renamed')}
        viewState={{}}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
    </div>

    )
}
