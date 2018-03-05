const controller = require("../base/controller");

module.exports = class commonController extends controller {
    constructor(request, response) {
        super(request, response);
    }

    index() {
        var filename = `${__dirname}/../view/index/index.html`;
        this.view(filename);
    }

    getOtherNavs() {
        this.json([{
            id: 1, name: "操作历史"
        }, {
            id: 2, name: "回收站"
        }]);
    }
}