const controller = require("../base/controller");
const diskService = require("../services/diskService");

module.exports = class diskController extends controller {
    constructor(request, response) {
        super(request, response);
    }

    getDisks() {
        return new diskService().getDisks().then((result) => {
            this.json(result);
        });
    }
}