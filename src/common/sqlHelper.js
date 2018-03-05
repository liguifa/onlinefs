const mysql = require("mysql");
const config = require("../config/config");

module.exports = {
    query: function (sql) {
        return new Promise(function(resolve, reject){
            let db = mysql.createConnection(config.db);
            db.connect();
            db.query(sql,function(err,results){
                if(err){
                    reject(err);
                } else {
                    resolve(results);
                }
            });
            db.end();
        })
    }
}