const fs = require('fs');
const path = require('path');

function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    const files = fs.readdirSync(source);

    files.forEach(file => {
        const currentSource = path.join(source, file);
        const currentTarget = path.join(target, file);

        if (fs.lstatSync(currentSource).isDirectory()) {
            copyFolderSync(currentSource, currentTarget);
        } else {
            fs.copyFileSync(currentSource, currentTarget);
        }
    });
}

module.exports = {
    copyFolderSync
};
