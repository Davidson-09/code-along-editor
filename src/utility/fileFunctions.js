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

function getFileExtension(filePath) {
    const dotIndex = filePath.lastIndexOf('.');
    if (dotIndex !== -1) {
      return filePath.slice(dotIndex + 1).toLowerCase();
    } else {
      return ''; // No extension found
    }
}

function getProgrammingLanguage(filePath) {
    const fileExtension = getFileExtension(filePath);

    // Mapping of file extensions to programming languages
    const languageMapping = {
        js: 'JavaScript',
        py: 'Python',
        java: 'Java',
        cpp: 'C++',
        html: 'HTML',
        css: 'CSS',
        txt: 'Plain Text',
        // Add more extensions and corresponding languages as needed
    };

    // Check if the file extension is in the mapping
    if (languageMapping.hasOwnProperty(fileExtension)) {
        return languageMapping[fileExtension];
    } else {
        return 'Unknown'; // Default if the language is not in the mapping
    }
}

const saveFile = (filePath, content) => {
    fs.writeFile(filePath, content, (err) => {
        return
    });
};

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw new Error("could not delete file")
        }
    });
};

const renameFile = (oldPath, newName) => {
    const pathParts = oldPath.split('/');
    const newPath = pathParts.join('/') + `/${newName}`;
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            throw new Error(`Error renaming file from ${oldPath} to ${newPath}: ${err}`);
        } 
    });
};


module.exports = {openFile, getFileExtension, getProgrammingLanguage, saveFile, deleteFile, renameFile}