const controller = require("../base/controller");
const fileService = require("../services/fileService");
const smbHelper = require("../common/smbHepler");

module.exports = class folderController extends controller {
    constructor(request, response) {
        super(request, response);
    }

    getFileContext(vm) {
        new fileService().getFileById(vm.id).then(file => {
            if (vm.type === "txt") {
                smbHelper.readFile(file.name, file.domain, file.username, file.password).then(data => {
                    this.content(data);
                }, err => {
                    throw err;
                });
            }
        });
    }
}