import React, { useEffect } from 'react'
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';

export default function FileSelector({fileTree}) {

    const items = {
        root: {
          index: 'root',
          isFolder: true,
          children: ['child1', 'child2'],
          data: 'Root item',
        },
        child1: {
          index: 'child1',
          children: [],
          data: 'Child item 1',
        },
        child2: {
          index: 'child2',
          isFolder: true,
          children: ['child3'],
          data: 'Child item 2',
        },
        child3: {
            index: 'child3',
            children: [],
            data: 'Child item 3',
          }
    }

    useEffect(()=>{
        console.log(fileTree, 'the damn tree')
    }, [])

    return (
    <div className='absolute bg-gray-500 border border-black border-r-gray-700 z-10 top-0 '>
        <p className='text-white p-3'>File Explorer</p>
        <UncontrolledTreeEnvironment
        dataProvider={new StaticTreeDataProvider(fileTree, (item, data) => ({ ...item, data }))}
        getItemTitle={item => item.data}
        viewState={{}}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
    </div>

    )
}
