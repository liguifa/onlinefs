(function () {
    var currentFolderId = 0;
    var currentSearchKey = "";

    $.component(function () {
        return {
            tagname: "onlinefs-title",
            template: "<h1>{{state.title}}</h1>",
            state: {
                title: "",
            },
            controller: function () {

            }
        }
    });

    $.component(function () {
        return {
            tagname: "onlinefs-crumbs",
            template: "<div class='onlinefs-crumbs'>\
                        <ul>\
                            {%for(var i in state.navs){%}\
                                {%if(state.navs[i].isActive){%}\
                                    <li><span>{{state.navs[i].title}}</span></li>\
                                {%} else {%}\
                                    <li><a href='{{state.navs[i].url}}'>{{state.navs[i].title}}</a><span>></span></li>\
                                {%}%}\
                            {%}%}\
                        </ul>\
                      </div>",
            state: {
                navs: []
            },
            controller: function () {

            }
        }
    });

    $.event.register("manager", function (folder) {
        var folderId = folder.id;
        var type = folder.type;
        currentFolderId = folder.id;
        $.component.loading.enable();
        $.http.get($.string.format("/getFolderInfo?folderId={{folderId}}&type={{type}}", { folderId: folderId, type: type }), function (result) {
            $.component.title.setState({
                title: result.find(function (item) {
                    return item.isActive;
                }).title
            });
            $.component.crumbs.setState({
                navs: result
            });
            getFiles(folderId, 0, 0, currentSearchKey);
            $.component.loading.disable();
        });
    });

    function getFiles(folderId, sortType, isAsc, searchKey) {
        $.component.loading.enable();
        $.http.get($.string.format("/getFiles?folderId={{folderId}}&sortType={{sortType}}&isAsc={{isAsc}}&searchKey={{searchKey}}", { folderId: folderId, sortType: sortType, isAsc: isAsc, searchKey: searchKey }), function (result) {
            $.component.files.setState({
                rows: result
            });
            $.component.loading.disable();
        });
    }

    $.component.files.fileSort = function (sortColumn) {
        getFiles(currentFolderId, sortColumn.index + 1, sortColumn.isAsc ? 1 : 0, currentSearchKey);
    }

    $.component.search.fileSearch = function (value) {
        currentSearchKey = value;
        getFiles(currentFolderId, 0, 0, value);
    }
})();