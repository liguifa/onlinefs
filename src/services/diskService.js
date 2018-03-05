const sqlHelper = require("../common/sqlHelper");

module.exports = class diskService {
    getDisks() {
        return sqlHelper.query("select id,CONCAT(name,'(',letter,':)') as name from onlinefs_disks");
    }

    getDiskById(diskId) {
        return new Promise((resolve,reject) => {
            return sqlHelper.query(`select * from onlinefs_disks where id = ${diskId}`).then(result => {
                var disk = result[0];
                resolve(disk);
            });
        });
    }
}