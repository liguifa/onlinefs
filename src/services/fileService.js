const sqlHelper = require("../common/sqlHelper");

module.exports = class fileSevice {
    constructor() {

    }

    getFileById(id) {
        return new Promise((resolve, reject) => {
            sqlHelper.query(`select CONCAT(onlinefs_folders.path,'\\\\',onlinefs_files.id,'.onlinefs') as name,domain,username,password from onlinefs_files 
                join onlinefs_folders on folderId = onlinefs_folders.id
                join onlinefs_disks on diskId = onlinefs_disks.id
                where onlinefs_files.id = ${id}`).then(result => {
                    resolve(result[0]);
                });
        });
    }
}