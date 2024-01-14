const fs = require('fs');
const path = require('path');

// the file tree interface
// const items = {
//     root: {
//       index: 'root',
//       isFolder: true,
//       children: ['child1', 'child2'],
//       data: 'Root item',
//     },
//     child1: {
//       index: 'child1',
//       children: [],
//       data: 'Child item 1',
//     },
//     child2: {
//       index: 'child2',
//       isFolder: true,
//       children: ['child3'],
//       data: 'Child item 2',
//     },
//     child3: {
//         index: 'child3',
//         children: [],
//         data: 'Child item 3',
//       }
// }

function buildTree(folderPath) {
    let fileItems = {
        root:{
            index: 'root',
            isFolder: true,
            children: [],
            data: folderPath
        }
    }

    function exploreFolder(folderPath, currentItem) {
        const contents = fs.readdirSync(folderPath);
        contents.forEach((item) => {
            // add every file and folder to the root object
            if (currentItem){
                fileItems[currentItem].children.push(item)
            }else{
                fileItems.root.children.push(item)
            }
            // create file objects for each file and folder
            const itemPath = path.join(folderPath, item);
            if (fs.statSync(itemPath).isDirectory()) {
                fileItems[item] = {
                    index: item,
                    isFolder: true,
                    children: [],
                    data: item,
                    path: itemPath
                }
                exploreFolder(itemPath, item);
            } else {
                fileItems[item] = {
                    index: item,
                    children: [],
                    data: item,
                    path: itemPath
                }
            }
        });
    }

    exploreFolder(folderPath);
    return fileItems;
}

function printTree(tree, indent = 0) {
    Object.entries(tree).forEach(([key, value]) => {
        console.log('  '.repeat(indent) + `[${key}]`);
        if (Object.keys(value).length > 0) {
            printTree(value, indent + 1);
        }
    });
}

module.exports = {buildTree, printTree}