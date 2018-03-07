import { resolve } from "url";

const sqlHelper = require("../common/sqlHelper");

module.exports = class fileSevice {
    constructor() {

    }

    getFileById(id) {
        return new Promise((resolve, reject) => {
            sqlHelper.query(`select * from onlinefs_files where id = ${id}`).then(result => {
                resolve(result[0]);
            });
        });
    }
}