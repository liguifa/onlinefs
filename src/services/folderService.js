const sqlHelper = require("../common/sqlHelper");

module.exports = class folderServcie {
    constructor() {

    }

    getShortcutsByUsername(username) {
        return sqlHelper.query(`select onlinefs_folders.id as id,onlinefs_folders.name as name from onlinefs_shortcuts 
            join onlinefs_users on onlinefs_users.id = onlinefs_shortcuts.userId
            join onlinefs_folders on onlinefs_folders.id = onlinefs_shortcuts.folderId
            where onlinefs_users.username = '${username}'`);
    }

    getFolderInfo(id) {
        var folders = [];
        return new Promise((resolve, reject) => {
            sqlHelper.query(`select * from onlinefs_folders where id = ${id}`).then(result => {
                folders.push(result[0]);
                if (result[0].parentFolderId === 0) {
                    resolve(folders);
                } else {
                    this.getFolderInfo(result[0].parentFolderId).then(result => {
                        resolve(folders.concat(result));
                    });
                }
            });
        });
    }

    getFilesAndSubFoldersByFolderId(folderId, sortType, isAsc, searchKey) {
        var sortColumn = this._getSortColumnBySortType(sortType);
        var asc = isAsc === 1 ? "asc" : "desc";
        return sqlHelper.query(`select * from (select onlinefs_files.id as id, onlinefs_files.name as name,onlinefs_versions.size as size,onlinefs_filetypes.name as fileType, onlinefs_versions.version as version,onlinefs_users.displayName as modifyBy, onlinefs_files.modifyTime as modifyTime,1 as type
            from onlinefs_files join onlinefs_folders on onlinefs_files.folderId = onlinefs_folders.id
            left join onlinefs_filetypes on onlinefs_files.fileTypeId= onlinefs_filetypes.id
            join onlinefs_versions on onlinefs_files.id = onlinefs_versions.fileId 
            join onlinefs_users on onlinefs_files.modifyBy = onlinefs_users.id
            where onlinefs_folders.id = ${folderId} and onlinefs_versions.isCurrent = 1
        union
            select folders2.id as id, folders2.name as name,0 as size,'文件夹' as fileType, 0 as version,onlinefs_users.displayName as modifyBy, folders2.modifyTime as modifyTime,2 as type
                from onlinefs_folders join onlinefs_folders as folders2 on folders2.parentFolderId= onlinefs_folders.id 
                join onlinefs_users on onlinefs_folders.modifyBy = onlinefs_users.id
                where onlinefs_folders.id=${folderId}) as t1
        where name like '%${searchKey}%' or '${searchKey}' = ''
        order by ${sortColumn} ${asc}`);
    }

    _getSortColumnBySortType(sortType) {
        var columns = ["type", "name", "size", "filetype", "version", "modifyBy", "modifyTime"];
        return columns[sortType];
    }
}