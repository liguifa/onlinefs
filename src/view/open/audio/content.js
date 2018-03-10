(function () {
    var vm = {
        pageIndex: 1,
        pageSize: 20,
        sortType: "name",
        isAsc: 1
    }

    var ap = new APlayer({
        element: document.getElementById("onlinefs-player"),
        narrow: false,
        autoplay: true,
        showlrc: false,
        mutex: true,
        theme: '#e6d0b2',
        preload: 'metadata',
        mode: 'circulation',
        music: {
            title: $.queryString.name,
            author: '',
            url: '/getFileContext?type=stream&id=' + $.queryString.id
        }
    });

    function getAudios() {
        $.http.get($.string.format("/getAudioList?pageIndex={{pageIndex}}&pageSize={{pageSize}}&sortType={{sortType}}&isAsc={{isAsc}}", vm), function (result) {
            var musics = result.filter(function (item) {
                return item.Id != $.queryString.id;
            }).map(function (item) {
                return {
                    title: item.Name,
                    author: '',
                    url: '/getFileContext?type=stream&id=' + item.Id
                };
            });
            ap.addMusic(musics);
        });
    }

    getAudios();

    $.selector(".aplayer-list").addEventListener("scroll", function (e) {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            vm.pageIndex++;
            getAudios();
        }
    });
})();