const sqlHelper = require("../common/sqlHelper");

module.exports = class diskService {
    getDisks() {
        return sqlHelper.query("select id,CONCAT(name,'(',letter,':)') as name from onlinefs_disks");
    }

    getDiskById(diskId) {
        return new Promise((resolve, reject) => {
            return sqlHelper.query(`select * from onlinefs_disks where id = ${diskId}`).then(result => {
                var disk = result[0];
                resolve(disk);
            });
        });
    }

    getSubFoldersById(diskId, sortType, isAsc, searchKey) {
        var sortColumn = this._getSortColumnBySortType(sortType);
        var asc = isAsc === 1 ? "asc" : "desc";
        return sqlHelper.query(`select onlinefs_folders.id as id, name as name,0 as size,'文件夹' as fileType, 0 as version,onlinefs_users.displayName as modifyBy, 
        onlinefs_folders.modifyTime as modifyTime,2 as type from onlinefs_folders
        join onlinefs_users on onlinefs_folders.modifyBy = onlinefs_users.id
        where diskId = ${diskId} and parentFolderId = 0 and (name like '%${searchKey}%' or '${searchKey}' = '')
        order by ${sortColumn} ${asc}`)
    }

    _getSortColumnBySortType(sortType) {
        var columns = ["type", "name", "size", "filetype", "version", "modifyBy", "modifyTime"];
        return columns[sortType];
    }
}