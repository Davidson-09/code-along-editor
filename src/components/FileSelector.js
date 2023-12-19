import React, { useEffect } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function FileSelector({fileTree}) {

    const renderTree = (nodes) => (
        <TreeItem key={Math.random().toString()} nodeId={Math.random().toString()} label={Math.random().toString()}>
          {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
        </TreeItem>
    );

    useEffect(()=>{
        console.log(fileTree, 'from component')
    })

    return (
    <div className='w-40 h-screen absolute bg-black border border-black border-r-gray-700 z-10 top-0 '>
        <p className='text-white p-3'>File Explorer</p>
        <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        className='text-white'
        >
        {renderTree(fileTree)}
        </TreeView>
    </div>

    )
}
