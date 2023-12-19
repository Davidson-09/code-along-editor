const fs = require('fs');
const path = require('path');

function buildTree(folderPath) {
    const tree = {};

    function addToTree(currentNode, filePath) {
        const parts = path.relative(folderPath, filePath).split(path.sep);
        parts.reduce((node, part) => {
            node[part] = node[part] || {};
            return node[part];
        }, currentNode);
    }

    function exploreFolder(currentNode, folderPath) {
        try{
            const contents = fs.readdirSync(folderPath);
            contents.forEach((item) => {
                const itemPath = path.join(folderPath, item);
                if (fs.statSync(itemPath).isDirectory()) {
                    addToTree(currentNode, itemPath);
                    exploreFolder(currentNode[item], itemPath);
                } else {
                    addToTree(currentNode, itemPath);
                }
            });
        }catch(e){
            throw new Error(e)
        }
    }

    exploreFolder(tree, folderPath);
    return tree;
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