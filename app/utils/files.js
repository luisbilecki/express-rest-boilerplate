// https://gist.github.com/kethinov/6658166#gistcomment-3079220
const { readdirSync, lstatSync } = require('fs');
const path = require('path');

const DEFAULT_FILTER = new RegExp();

const findFiles = (dir, filter = DEFAULT_FILTER, fileList = []) => {
    const files = readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStats = lstatSync(filePath);

        if (fileStats.isDirectory()) {
            findFiles(filePath, filter, fileList);
        } else if (filter.test(filePath)) {
            fileList.push(filePath);
        }
    });

    return fileList;
};

const getLastDirName = (filename) => {
    return path.dirname(filename).split(path.sep).pop();
};

module.exports = {
    findFiles,
    getLastDirName,
};
