(function () {
    function getContextLineCount() {
        var height = $.selector(".onlinefs-opentxt-body").clientHeight;
        return Math.ceil(height / 28);
    }

    function setIndex(lineCount) {
        var html = "";
        for (var i = 0; i < lineCount; i++) {
            html += "<span>" + (i + 1) + "</span>";
        }
        $.selector(".onlinefs-opentxt-index").innerHTML = html;
    }

    window.addEventListener("resize", function () {
        setIndex(0);
        var lineCount = getContextLineCount();
        setIndex(lineCount);
    });

    var lineCount = getContextLineCount();
    setIndex(lineCount);

    function getFileContext(id) {
        $.http.get("/getFileContext?type=txt&id=" + id, function (result) {
            $.selector(".onlinefs-opentxt-body").innerHTML = result;
            setIndex(0);
            var lineCount = getContextLineCount();
            setIndex(lineCount);
        }, "json", "html");
    }
})();