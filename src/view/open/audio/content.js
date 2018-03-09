(function () {
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
            title: '音乐',
            author: '',
            url: '/getFileContext?type=stream&id=' + $.queryString.id
        }
    });
})();