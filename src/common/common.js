const Base64 = require('js-base64').Base64;
const oprnTypeConfig = require("../config/opentypeconfig");

var $ = {};

$.string = {
    secretkey: "1qaz2wsxE",
    decrypt: function (input) {
        var password = Base64.decode(Base64.decode(input));
        return password.substring(this.secretkey.length, password.length);
    },
    encrypt: function (input) {
        return Base64.encode(Base64.encode(this.secretkey + input));
    }
}

$.convert = {
    toFileSize: function (size) {
        var filesize = size;
        if (filesize < 1024) {
            return `${filesize} b`;
        }
        filesize = filesize / 1024;
        if (filesize < 1024) {
            return `${filesize} k`;
        }
        filesize = filesize / 1024;
        if (filesize < 1024) {
            return `${filesize} M`;
        }
        filesize = filesize / 1024;
        return `${filesize} G`;
    }
}

$.config = {
    getOpenTypeConfig: function (extname) {
        var config = oprnTypeConfig.find(item => {
            return item.extname === extname;
        });
        return config;
    }
}

module.exports = $;