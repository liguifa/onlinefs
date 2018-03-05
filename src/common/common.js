const Base64 = require('js-base64').Base64;

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
module.exports = $;