const session = require("./session");
const $ = require("../common/common");
const fs = require("fs");

module.exports = class controller {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    json(data) {
        this.response.send(JSON.stringify(data));
        this.response.end();
    }

    setCookie(key, value, isExpire) {
        this.response.setHeader("set-cookie", `${key}=${value}${isExpire ? "" : (";expires=" + new Date("2229/1/1 1:1:1").toGMTString())};HttpOnly`);
    }

    getCookie(key) {
        var cookieString = this.request.headers["cookie"];
        if (cookieString !== undefined) {
            cookieString = cookieString.replace(/\s/g, "");
            var cooikes = cookieString.split(";");
            var cookie = cooikes.find((cookie) => {
                var cookieKeyValue = cookie.split("=");
                return cookieKeyValue[0] === key
            });
            if (cookie) {
                return cookie.split("=")[1];
            }
            return null;
        }
        return null;
    }

    getCurrentUsername() {
        return $.string.decrypt(this.getCookie("auth"));
    }

    setSession(name, value) {
        session[name] = value;
    }

    getSession(name) {
        return session[name];
    }

    buffer(buffer) {
        this.response.write(buffer);
        this.response.end();
    }

    view(filename) {
        fs.readFile(filename, { encoding: "utf8" }, (err, data) => {
            this.response.set("Content-Type", "text/html");
            this.response.send(data);
            this.response.end();
        });
    }

    content(context) {
        this.response.set("Content-Type", "text/plain");
        this.response.send(context);
        this.response.end();
    }

    stream(stream) {
        stream.on("data", data => {
            this.response.write(data);
        });
        stream.on("close", data => {
            this.response.write(data);
            this.response.end();
        });
    }
}