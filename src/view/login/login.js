(function () {
    $.selector("#onlinefs-login-form").onsubmit = function () {
        $.component.loading.setState({ isLoading: true });
        $.selector(".onlinefs-login-content-form-error").style.display = "none";
        var username = $.selector("#username").value;
        var password = $.selector("#password").value;
        var remember = $.component.remember.state.value;
        $.http.post("/login", { username: username, password: $.string.encrypt(password), remember: remember }, function (result) {
            $.component.loading.setState({ isLoading: false });
            if (result.isValidate) {
                var popupHTML = "<div class='onlinefs-validate-message'>你的密码三次输入错误,请输入验证码进行身份验证</div>\
                                  <div class='onlinefs-validate-content'><img class='onlinefs-validate-img' src='/verificationCode?id="+ Math.random() + "&username=" + username + "'>\
                                  <input class='onlinefs-validate-input' type='text' /></div>\
                                  <span class='onlinefs-validate-error'>验证码输入错误,请重新输入</span>";
                $.messager.popup("信息", popupHTML, function () {
                    $.component.loading.setState({ isLoading: true });
                    $.selector(".onlinefs-validate-error").style.display = "none";
                    var token = $.selector(".onlinefs-validate-input").value;
                    $.http.post("/checkVerificationCode", { username: username, token: token }, function (result) {
                        $.component.loading.setState({ isLoading: false });
                        if (result.isSuccess) {
                            $.selector(".messager-popup").remove();
                        } else {
                            $.selector(".onlinefs-validate-error").style.display = "block";
                        }
                    });
                });
            } else if (!result.isLogin) {
                $.selector(".onlinefs-login-content-form-error").style.display = "inline";
            } else {
                location.href = "/index/index.html";
            }
        });
        return false;
    }
})();