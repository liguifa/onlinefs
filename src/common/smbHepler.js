const smb2 = require("smb2");
const fs = require("fs");

module.exports = {
    readFile: function (filename, domain, username, password) {
        // var folder = filename.substring(0, filename.lastIndexOf("\\"));
        // var name = filename.substring(filename.lastIndexOf("\\") + 1, filename.length);
        // var smb2Client = new smb2({
        //     share: folder,
        //     domain: ".",
        //     username: "administrator",
        //     password: "199305080"
        // });
        // return new Promise((resolve, reject) => {
        //     smb2Client.readFile(name, { encoding: "utf8" }, function (err, data) {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve(data);
        //         }
        //     });
        // });

        return new Promise((resolve, reject) => {
            fs.readFile(filename, { encoding: "utf8" }, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    readFileStream:function (filename, domain, username, password) {
        return fs.createReadStream(filename);
    }
}