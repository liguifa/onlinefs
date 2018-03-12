const express = require("express");
const config = require("../config/config");
const routes = require("../routes/route");
const controllers = require("../controller");
const formidable = require("formidable");
const $ = require("../common/common");
const userService = require("../services/userService");
const fs = require("fs");

module.exports = class Application {
    constructor() {
        this.app = express();
    }

    setStatic() {
        this.app.use(express.static(__dirname + "/../view", {
            dotfiles: "ignore",
            etag: false,
            extensions: config.static.extensions,
            index: false,
            maxAge: config.static.maxAge,
            redirect: true,
            setHeaders: (res, path, stat) => {
                res.set("x-timestamp", Date.now());
            }
        }));
    }

    setGet() {
        this.app.get(/.*/, (request, response, next) => {
            request.data = request.query;
            next();
        });
    }

    setJson() {
        this.app.post(/.*/, (request, response, next) => {
            if (/text\/plain/.test(request.headers["content-type"])) {
                var data = "";
                request.on("readable", function () {
                    request.setEncoding("utf8");
                    var temp = request.read();
                    if (temp && temp !== null) {
                        data += temp;
                    }
                });
                request.on("end", () => {
                    data = JSON.parse(data);
                    request.data = data;
                    next();
                });
            } else {
                next();
            }
        });
    }

    setFormData() {
        this.app.post(/.*/, (request, response, next) => {
            if (!/text\/plain/.test(request.headers["content-type"])) {
                var form = new formidable.IncomingForm();
                form.uploadDir = config.uploadDir;
                form.keepExtensions = true;
                form.parse(request, (err, fields, files) => {
                    request.data = fields;
                    request.files = files;
                    next();
                });
            } else {
                next();
            }
        });
    }

    setCheckAuthority() {
        this.app.use((request, response, next) => {
            for (let i in config.anonymous) {
                if (config.anonymous[i].test(request.url)) {
                    next();
                    return;
                }
            }
            let cookieString = request.headers["cookie"];
            let isLogin = true;
            if (!cookieString || cookieString === "") {
                response.statusCode = 401;
                throw new Error("Unauthorized");
            } else {
                var key = "auth";
                cookieString = cookieString.replace(/\s/g, "");
                var cooikes = cookieString.split(";");
                var cookie = cooikes.find((cookie) => {
                    var cookieKeyValue = cookie.split("=");
                    return cookieKeyValue[0] === key
                });
                if (cookie) {
                    let auth = cookie.split("=")[1];
                    try {
                        let username = $.string.decrypt(auth);
                        new userService().getUserByUsername(username).then((result) => {
                            if (result && result.length >= 1) {
                                next();
                            } else {
                                response.statusCode = 401;
                                throw new Error("Unauthorized");
                            }
                        });
                    } catch (err) {
                        console.log(err);
                        response.statusCode = 401;
                        throw new Error("Unauthorized");
                    }
                } else {
                    response.statusCode = 401;
                    throw new Error("Unauthorized");
                }
            }
        });
    }

    setErrorHander() {
        this.app.use((err, request, response, next) => {
            response.set("Content-Type", "text/html");
            response.statusCode = response.statusCode !== 401 && response.statusCode !== 404 ? 500 : response.statusCode;
            var errorPagePath = `${__dirname}/../view/error/${response.statusCode}.html`;
            fs.readFile(errorPagePath, { encoding: "utf8" }, (err, data) => {
                response.send(data);
                response.end();
            })
        });
    }

    start() {
        //this.setCheckAuthority();
        this.setStatic();
        this.setGet();
        this.setJson();
        this.setFormData();
        for (let key in routes) {
            this.app.all(routes[key].url, (request, response) => {
                try {
                    var controller = new controllers[routes[key].controller](request, response);
                    controller[routes[key].action](request.data);
                } catch (e) {
                    console.log(e);
                    throw e;
                }
            });
        }
        this.app.all(/.*/, (request, response) => {
            response.statusCode = 404;
            throw new Error("Not found");
        });
        this.setErrorHander();
        this.app.listen(config.port);
    }
}