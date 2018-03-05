$.component = (function () {
    /**
     * 模板编译函数
     */
    var template = (function () {
        return {
            compile: function (template, data, attr, key) {
                var functionBody = template;

                functionBody = functionBody.replace(/\$/g, key).replace(/'/g, "\"").replace(/{%(.*?)%}/g, function (match, p) {
                    return "';" + p + "html+='";
                }).replace(/{{(.*?)}}/g, function (match, p) {
                    return "';html+=" + p + ";html +='";
                });
                functionBody = "var html = '" + functionBody + "';return html;";
                return new Function("state", "attr", functionBody)(data, attr);
            }
        }
    })();

    var uuid = 0;
    $.components = [];
    return function (func) {
        var component = func();
        var elements = document.getElementsByTagName(component.tagname);
        for (var i in elements) {
            if (elements[i].nodeType === 1) {
                var isRender = elements[i].getAttribute("isRender");
                if (isRender === null || isRender === "") {
                    (function (currentElement, currentComponent, key) {
                        currentComponent = $.clone(currentComponent, true); //Object.create(currentComponent);
                        currentComponent.attr = {};
                        for (var attrKey in currentElement.attributes) {
                            if (currentElement.attributes[attrKey].nodeType === 2) {
                                currentComponent.attr[currentElement.attributes[attrKey].name] = currentElement.attributes[attrKey].value;
                            }
                        }
                        var innerHTML = template.compile(currentComponent.template, currentComponent.state, currentComponent.attr, key);
                        currentElement.innerHTML = innerHTML;
                        currentComponent.node = currentElement;
                        currentComponent.key = key;
                        window[key] = currentComponent;
                        currentComponent.setState = function (state) {
                            for (var key in state) {
                                currentComponent.state[key] = state[key];
                            }
                            currentComponent.refresh();
                        }
                        currentComponent.refresh = function () {
                            var innerHTML = template.compile(currentComponent.template, currentComponent.state, currentComponent.attr, key);
                            currentElement.innerHTML = innerHTML;
                        }
                        currentComponent.controller.bind(currentComponent)();
                        $.component[currentElement.id] = currentComponent;
                    })(elements[i], component, "component_" + uuid++);
                    elements[i].setAttribute("isRender", true);
                }
            }
        }
        if (!func.isRecord) {
            $.components.push(func);
            func.isRecord = true;
        }
    }
})();

/**
 * onlinefs-checkbox
 */
$.component(function () {
    return {
        tagname: "onlinefs-checkbox",
        template: "<div onClick='$.changeValue()'>\
                        {%if(state.value){%}\
                            <span>√</span>\
                        {%} else {%}\
                            <span></span>\
                        {%}%}\
                   </div>",
        state: {
            value: false
        },
        controller: function () {

        },
        changeValue() {
            this.setState({
                value: !this.state.value
            })
        }
    }
});

$.component(function () {
    return {
        tagname: "onlinefs-loading",
        template: "{%if(state.isLoading){%}\
                        <div></div>\
                        <img src='/common/images/loading.gif' />\
                    {%}%}",
        state: {
            isLoading: false,
        },
        vm: {
            index: 0
        },
        controller: function () { },
        enable: function () {
            this.vm.index++;
            if (this.vm.index === 1) {
                this.setState({
                    isLoading: true
                });
            }
        },
        disable: function () {
            this.vm.index--;
            if (this.vm.index === 0) {
                this.setState({
                    isLoading: false
                });
            }
        }
    }
});

$.component(function () {
    return {
        tagname: "onlinefs-silder-list",
        template: "<div>\
                        {{attr.title}}\
                        {%if(state.isSpread){%}\
                            <img src='/common/images/common-spread.png' onClick='$.spread()' />\
                        {%} else {%}\
                            <img src='/common/images/common-shrink.png' onClick='$.spread()' />\
                        {%}%}\
                   </div>\
                    <ul style='height:{{state.height}}px'>\
                        {%for(var i in state.items){%}\
                            {%if(state.items[i].isActive){%}\
                                <li class='active'>{{state.items[i].title}}</li>\
                            {%} else {%}\
                                <li onclick='$.active({{state.items[i].id}})'>{{state.items[i].title}}</li>\
                            {%}%}\
                        {%}%}\
                    </ul>",
        state: {
            items: [],
            title: "",
            isSpread: false,
            height: 0
        },
        controller: function () {
            $.component.loading.enable();
            $.http.get(this.attr.url, function (result) {
                var items = result.map(function (item) {
                    return { id: item.id, title: item.name, isActive: false, type: this.attr.type };
                }.bind(this));
                if (this.attr.isdefault) {
                    $.event.on("manager", items[0]);
                    items[0].isActive = true;
                }
                this.setState({
                    items: items
                });
                $.component.loading.disable();
            }.bind(this));
            $.event.register("spread", function (key) {
                if (key !== this.key) {
                    this.displayList(false);
                }
            }.bind(this));
        },
        spread: function () {
            $.event.on("spread", this.key);
            this.displayList(!this.state.isSpread);
        },
        displayList: function (isSpread) {
            this.setState({
                isSpread: isSpread
            });
            var targetHeight = this.state.items.length * 40;
            var interval = setInterval(function () {
                if ((this.state.isSpread && this.state.height > targetHeight) || (!this.state.isSpread && this.state.height <= 0)) {
                    clearInterval(interval);
                    this.setState({
                        height: this.state.isSpread ? targetHeight : 0
                    });
                } else {
                    this.setState({
                        height: this.state.height + (this.state.isSpread ? 4 : -4)
                    });
                }
            }.bind(this), 10);
        },
        active: function (id) {
            $.event.on("manager", this.state.items.find(function (item) {
                return item.id === id;
            }));
            var items = this.state.items.map(function (i) {
                if (i.id === id) {
                    i.isActive = true;
                } else {
                    i.isActive = false;
                }
                return i;
            });
            this.setState({
                items: items
            });
        }
    }
});

$.component(function () {
    return {
        tagname: "onlinefs-datagrid",
        template: "<table class='onlinefs-datagrid'>\
                    <thead>\
                        <tr>\
                            {%if(attr.isindex){%}\
                                <th width='34px'></th>\
                            {%}%}\
                            {%var columns = JSON.parse(attr.columns);%}\
                            {%for(var i in columns){%}\
                                <th width='{{columns[i].width}}%' class='\
                                    {%if(columns[i].isSort){%}\
                                        onlinefs-datagrid-isSort\
                                    {%}%}\
                                '\
                                    {%if(columns[i].isSort){%}\
                                        onclick='$.sort({{i}})'\
                                    {%}%}\
                                >\
                                    {{columns[i].title}}\
                                    {%if(state.sortColumn.index == i){%}\
                                        {%if(state.sortColumn.isAsc){%}\
                                            <img src='/common/images/common-sort-asc.png' class='onlinefs-datagrid-sort-img' />\
                                        {%} else {%}\
                                            <img src='/common/images/common-sort-desc.png' class='onlinefs-datagrid-sort-img' />\
                                        {%}%}\
                                    {%}%}\
                                </th>\
                            {%}%}\
                        </tr>\
                    </thead>\
                    <tbody>\
                        {%for(var i in state.rows){%}\
                            <tr>\
                                {%if(attr.isindex){%}\
                                    <td>{{parseInt(i)+1}}</td>\
                                {%}%}\
                                {%for(var j in state.rows[i]){%}\
                                    <td>{{state.rows[i][j]}}</td>\
                                {%}%}\
                            </tr>\
                        {%}%}\
                    </tbody>\
                  </table>",
        state: {
            rows: [],
            sortColumn: {

            }
        },
        controller: function () {

        },
        sort: function (index) {
            var sortColmun = {
                index: index,
                isAsc: this.state.sortColumn.index === index ? !this.state.sortColumn.isAsc : true
            }
            this.setState({
                sortColumn: sortColmun
            });
            this[this.attr.sort](sortColmun);
        }
    }
});

$.component(function () {
    return {
        tagname: "onlinefs-droplist",
        template: "<div class='onlinefs-droplist'>\
                    <div>\
                        <input type='text' readonly value='{{state.currentField.name}}' />\
                        <div onclick='$.showChoose()'>\
                            {%if(state.isShowChoose){%}\
                                <img src='/common/images/common-droplist-top.png' />\
                            {%} else {%}\
                                <img src='/common/images/common-droplist-down.png' />\
                            {%}%}\
                        </div>\
                    </div>\
                    <ul\
                        {%if(state.isShowChoose){%}\
                            style='display:block'\
                        {%}%}\
                    >\
                        {%for(var i in state.fields){%}\
                            <li onclick='$.choose({{i}})'>{{state.fields[i].name}}</li>\
                        {%}%}\
                    </ul>\
                  </div>",
        state: {
            isShowChoose: false,
            currentField: { name: "" },
            fields: [
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
                { name: "Word文档" },
            ]
        },
        controller: function () {

        },
        showChoose: function () {
            this.setState({
                isShowChoose: !this.state.isShowChoose
            });
        },
        choose: function (index) {
            this.setState({
                currentField: this.state.fields[index]
            });
        }
    }
});

$.component(function () {
    return {
        tagname: "onlinefs-search",
        template: "<div class='onlinefs-search'>\
                        <input type='text' onchange='$.onInputChanged(this.value)' />\
                        <div onclick='$.search()'>\
                            <img src='/common/images/common-search.png' />\
                        </div>\
                      </div>",
        state: {

        },
        vm:{

        },
        controller: function () {

        },
        onInputChanged:function(value){
            this.vm.value = value;
        },
        search:function(){
            this[this.attr.search](this.vm.value);
        }
    }
});