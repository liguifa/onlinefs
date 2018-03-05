const AD = require("ad");
const config = require("../config/config");
const sqlHelper = require("../common/sqlHelper");

module.exports = class userService {
    constructor() {
        this.ad = new AD(config.ad);
    }

    login(username, password, func) {
        this.ad.user(username).authenticate(password).then((result) => {
            func(result);
        }).catch((err) => {
            console.log(err);
            func(false);
        })
    }

    getUserByUsername(username) {
        return sqlHelper.query(`select * from onlinefs_users where username='${username}'`);
    }

    changePhotoByUsername(username, photo) {
        return sqlHelper.query(`update onlinefs_users set Photo = '${photo}' where username='${username}'`);
    }
}