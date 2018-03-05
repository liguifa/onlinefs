$.messager = (function () {
    return {
        popup: function (title, innerHTML, func) {
            var template = "<div class='messager-popup-model'></div>\
                            <div class='messager-popup-content'>\
                                <div><span>{{title}}</span></div>\
                                <div>{{innerHTML}}</div>\
                                <div>\
                                    <button onclick='$.confirm()'>确认</button>\
                                    <button onclick='$.cancel()'>取消</button>\
                                </div>\
                            </div>";
            var key = "message_" + $.messager.uuid++;
            var html = template.replace("{{title}}", title).replace("{{innerHTML}}", innerHTML).replace(/\$/g, key);
            var popup = document.createElement("div");
            popup.innerHTML = html;
            popup.classList.add("messager-popup");
            document.body.appendChild(popup);
            window[key] = {
                confirm: func,
                cancel: function () {
                    popup.remove();
                }
            }
            return key;
        },
        success: function (message) {
            var title = "提示";
            var innerHTML = "<div class='onlinefs-message-context'><img src='/common/images/common-success.png' /><span>" + message + "</span></div>";
            var key = this.popup(title, innerHTML, function () {
                window[key].cancel();
            });
        },
        error: function (message) {
            var title = "错误";
            var innerHTML = "<div class='onlinefs-message-context'><img src='/common/images/common-error.png' /><span>" + message + "</span></div>";
            var key = this.popup(title, innerHTML, function () {
                window[key].cancel();
            });
        }
    }
})();

$.messager.uuid = 0;