var $ = {};

$.selector = function (name, isSingle, element) {
    element = element || document;
    isSingle = isSingle === undefined ? true : isSingle;
    var first = name.split(" ")[0];
    var elements;
    if (name && name[0] === ".") {
        //class
        first = first.substring(1, first.length);
        elements = element.getElementsByClassName(first);
    } else if (name && name[0] === "#") {
        //id
        first = first.substring(1, first.length);
        elements = [element.getElementById(first)];
    } else {
        elements = element.getElementsByTagName(name);
    }
    if (name.split(" ").length === 1) {
        return isSingle ? elements[0] : elements;
    }
    return this.selector(name.substring(first.length + 2, name.length), isSingle, elements[0]);
}

$.http = {
    get: function (url, func, type, responseType) {
        type = type || "json";
        this.all("Get", url, {}, func, type, responseType);
    },
    post: function (url, data, func, type, responseType) {
        type = type || "json";
        this.all("Post", url, data, func, type, responseType);
    },
    all: function (method, url, data, func, type, responseType) {
        responseType = responseType || "json";
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        if (type === "json") {
            sendData = JSON.stringify(data)
            xhr.send(sendData);
        } else {
            var formData = new FormData();
            for (var key in data) {
                formData.append(key, data[key]);
                xhr.send(formData);
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                func(responseType === "json" ? JSON.parse(xhr.response) : xhr.response);
            }
        }
    }
}

$.string = {
    secretkey: "1qaz2wsxE",
    encrypt: function (input) {
        return Base64.encode(Base64.encode(this.secretkey + input));
    },
    format: function (template, args) {
        return template.replace(/{{(.*?)}}/g, function (m, p) {
            return args[p];
        });
    }
}

$.dialog = function (option) {
    this.option = option;
};

$.dialog.prototype = {
    show: function () {
        var dialog = document.createElement("div");
        dialog.innerHTML = "<onlinefs-dialog id='" + this.option.id + "'></onlinefs-dialog>";
        document.body.appendChild(dialog);
        var self = this;
        $.component(function () {
            return {
                tagname: "onlinefs-dialog",
                template: "<div>\
                                <div class='onlinefs-dialog-title'>\
                                    <span>{{state.title}}</span>\
                                    <img src='/common/images/common-close.png' onClick='$.close()' />\
                                </div>\
                                <div>\
                                    {{state.innerHTML}}\
                                </div>\
                                {%if(state.isFooter){%}\
                                    <div>\
                                        <button onClick='$.submit()'>{{state.button}}</button>\
                                    </div>\
                                {%}%}\
                           </div>\
                           <div class='onlinefs-dailog-model'></div>",
                state: {
                    title: self.option.title ? self.option.title : "",
                    button: self.option.button ? self.option.button : "",
                    innerHTML: self.option.innerHTML ? self.option.innerHTML : "",
                    isFooter: self.option.isFooter === undefined || self.option.isFooter ? true : false
                },
                vm: {
                    isMove: false,
                    position: {},
                },
                controller: function () {
                    $.selector(".onlinefs-dialog-title", true, this.node).addEventListener("mousedown", this.startMove.bind(this));
                    document.addEventListener("mousemove", this.move.bind(this));
                    document.addEventListener("mouseup", this.endMove.bind(this));
                    this.initContent();
                },
                startMove: function (e) {
                    this.vm.isMove = true;
                    this.vm.position = { x: e.clientX, y: e.clientY };
                },
                move: function (e) {
                    if (this.vm.isMove) {
                        var add = { x: e.clientX - this.vm.position.x, y: e.clientY - this.vm.position.y };
                        var dialog = $.selector("div", true, this.node)
                        dialog.style.left = dialog.offsetLeft + add.x + "px";
                        dialog.style.top = dialog.offsetTop + add.y + "px";
                        dialog.style.margin = "0px";
                    }
                    this.vm.position = { x: e.clientX, y: e.clientY };
                },
                endMove: function () {
                    this.vm.isMove = false;
                },
                initContent() {
                    var link = document.createElement("link");
                    link.href = self.option.style;
                    link.rel = "stylesheet";
                    this.node.appendChild(link);
                    var scipt = document.createElement("script");
                    scipt.src = self.option.script;
                    this.node.appendChild(scipt);
                },
                close: function () {
                    this.node.remove();
                    for (var i in $.dialog.subscribers) {
                        if ($.dialog.subscribers[i].event === "close" && $.dialog.subscribers[i].id === self.option.id) {
                            $.dialog.subscribers[i].func();
                        }
                    }
                    $.dialog.unsubscribe(self.option.id);
                },
                submit: function () {
                    for (var i in $.dialog.subscribers) {
                        if ($.dialog.subscribers[i].event === "submit" && $.dialog.subscribers[i].id === self.option.id) {
                            $.dialog.subscribers[i].func();
                        }
                    }
                }
            }
        });
    }
}

$.dialog.subscribe = function (dialogid, event, func) {
    $.dialog.subscribers = $.dialog.subscribers || [];
    $.dialog.subscribers.push({ id: dialogid, event: event, func: func });
}

//event 不传就取消全部事件
$.dialog.unsubscribe = function (dialogid, event) {
    for (var i in $.dialog.subscribers) {
        if ($.dialog.subscribers[i].id === dialogid && (event === undefined || $.dialog.subscribers[i].evnet === event)) {
            delete $.dialog.subscribers[i];
        }
    }
}

$.event = {
    pool: [],
    uuid: 0,
    histories: [],
    on: function (name, context) {
        this.pool.forEach(function (item) {
            if (item.name === name) {
                setTimeout(function () {
                    item.func(context);
                }, 0);
            }
        });
        this.histories.push({ name: name, context: context });
    },
    register: function (name, func) {
        var event = { id: this.uuid++, name: name, func: func };
        this.pool.push(event);
        this.histories.forEach(function (item) {
            if (item.name === name) {
                func(item.context);
            }
        });
        return event.id;
    },
    unregister: function (id) {
        var isFind = -1;
        for (var i = 0; i < this.pool.length; i++) {
            if (id === this.pool[i].id) {
                isFind = i;
                break;
            }
        }
        if (isFind !== -1) {
            this.pool.splice(isFind, 1);
        }
    }
}

$.clone = function (target, isDeep) {
    isDeep = isDeep === undefined ? false : true;
    var newObject = isDeep ? JSON.parse(JSON.stringify(target)) : Object.assign(target);
    newObject.__proto__ = target;
    return newObject;
}

$.page = {
    load: function (url, js, func) {
        $.component.loading.enable();
        $.http.get(url, function (result) {
            func(result);
            var script = document.createElement("script");
            script.src = js;
            document.body.appendChild(script);
            for (var i in $.components) {
                $.component($.components[i]);
            }
            $.component.loading.disable();
        }, "json", "html");
    }
}