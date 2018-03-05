(function () {
    $.component(function () {
        return {
            tagname: "onlinefs-photo",
            template: "<div>\
                            <input type='text' value='{{state.filename}}' readonly />\
                            <button>选择文件</button>\
                            <input type='file' onChange='$.choose(this.value,this.files[0])' accept='image/*' />\
                        </div>\
                        <img src='{{state.newPhoto}}' />",
            state: {
                filename: "",
                newPhoto: $.selector("#onlinefs-index-user-photo").src,
                file: null,
            },
            controller: function () {

            },
            choose: function (value, file) {
                if (/\.jpg$|\.png$|\.bmp$|\.jpeg$/.test(value)) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        this.setState({
                            newPhoto: reader.result,
                            file: file
                        });
                    }.bind(this);
                    reader.readAsDataURL(file);
                    this.setState({
                        filename: value,
                    });
                }
            }
        }
    });

    $.dialog.subscribe("onlinefschangephoto", "submit", function () {
        $.component.loading.setState({ isLoading: true });
        $.http.post("/changePhoto", { photo: $.component.photo.state.file }, function (result) {
            $.component.loading.setState({ isLoading: false });
            if (result.isSuccess) {
                $.messager.success("修改头像成功!");
                $.component.onlinefschangephoto.close();
                $.http.get("/getUserInfo", function (result) {
                    $.selector("#onlinefs-index-user-displayname").innerText = result.DisplayName;
                    if (result.Photo && result.Photo != "") {
                        $.selector("#onlinefs-index-user-photo").src = "/upload/" + result.Photo;
                    }
                });
            } else {
                $.messager.error("修改头像失败,请重试!");
            }
        }, "formData");
    });
})();

//@ sourceURL=photo.js