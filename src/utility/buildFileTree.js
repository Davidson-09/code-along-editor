const fs = require('fs');
const path = require('path');

function buildTree(folderPath) {
    let fileItems = {
        root:{
            index: 'root',
            isFolder: true,
            children: [],
            data: folderPath
        }
    }
    const tree = {};

    function addToTree(currentNode, filePath) {
        const parts = path.relative(folderPath, filePath).split(path.sep);
        parts.reduce((node, part) => {
            node[part] = node[part] || {};
            return node[part];
        }, currentNode);
    }

    function exploreFolder(currentNode, folderPath, currentItem) {
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
                }
                addToTree(currentNode, itemPath);
                exploreFolder(currentNode[item], itemPath, item);
            } else {
                fileItems[item] = {
                    index: item,
                    children: [],
                    data: item,
                }
                addToTree(currentNode, itemPath);
            }
        });
    }

    exploreFolder(tree, folderPath);
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