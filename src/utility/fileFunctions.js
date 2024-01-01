const fs = require('fs');
const path = require('path');

const openFile =(item)=>{
    const filePath = item.path
    if (!fs.statSync(filePath).isDirectory()){
        try{
            const data = fs.readFileSync(filePath, 'utf8');
            return data
        } catch(e){
            throw new Error(e)
        }
    }
}

module.exports = {openFile}