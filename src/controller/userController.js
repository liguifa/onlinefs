const controller = require("../base/controller");
const $ = require("../common/common");
const userService = require("../services/userService");
const captcha = require('trek-captcha')

module.exports = class userController extends controller {
    constructor(request, response) {
        super(request, response);
    }

    login(user) {
        var time = this.getSession(`${user.username}_time`);
        if (time) {
            if (time.number >= 3 && (time.modify - new Date()) < new Date(1970, 1, 1, 24, 0, 0).getTime()) {
                this.json({ isValidate: true });
                return;
            }
        }
        new userService().login(user.username, $.string.decrypt(user.password), (adResult) => {
            var result = adResult ? { isLogin: true } : { isLogin: false, message: "密码或用户名错误！" };
            if (adResult) {
                this.setCookie("auth", $.string.encrypt(user.username), !user.remember);
            } else {
                var time = this.getSession(`${user.username}_time`);
                var number = time && time.number ? time.number + 1 : 1;
                if (time && (time.modify - new Date()) > new Date(1970, 1, 1, 24, 0, 0).getTime()) {
                    number = 1;
                }
                this.setSession(`${user.username}_time`, { number: number, modify: new Date() });
            }
            this.json(result);
        });
    }

    getVerificationCode(user) {
        captcha().then(function (code) {
            this.buffer(code.buffer);
            var time = this.getSession(`${user.username}_time`);
            time.token = code.token;
            this.setSession(time);
        }.bind(this));
    }

    checkVerificationCode(code) {
        var time = this.getSession(`${code.username}_time`);
        var result = {};
        if (time) {
            result.isSuccess = time.token === code.token;
        } else {
            result.isSuccess = true;
        }
        if (result.isSuccess) {
            this.setSession(`${code.username}_time`, undefined);
        }
        this.json(result);
    }

    getUserInfo() {
        var username = this.getCurrentUsername();
        new userService().getUserByUsername(username).then((result) => {
            this.json(result[0]);
        });
    }

    changePhoto() {
        var username = this.getCurrentUsername();
        var paths = this.request.files.photo.path.split("\\");
        new userService().changePhotoByUsername(username, paths[paths.length - 1]).then(result => {
            this.json({ isSuccess: true });
        }, err => {
            this.json({ isSuccess: false });
        });
    }
}