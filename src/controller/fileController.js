const controller = require("../base/controller");
const fileService = require("../services/fileService");
const fs = require("fs");

module.exports = class folderController extends controller {
    constructor(request,response){
        super(request,response);
    }

    getFileContext(vm){
        new fileService().getFileById(vm.id).then(file=>{
            if(vm.type === "txt"){
                fs.readFile(file.path,{encoding:"utf8"},(err,data)=>{
                    if(err){
                        throw err;
                    } else {
                        this.view(data);
                    }
                });
            }
        }); 
    }
}