(function () {
    var names = $.queryString.name.split(".");
    var extname = names[names.length - 1];
    var video = extname === "flv" ? {
        url: "/getFileContext?type=stream&id=" + $.queryString.id,
        type: 'customFlv',
        customType: {
            'customFlv': function (video, player) {
                const flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: video.src,
                    withCredentials: true,
                    isLive: true
                });
                flvPlayer.attachMediaElement(video);
                flvPlayer.load();
            }
        }
    } : {
            url: "/getFileContext?type=stream&id=" + $.queryString.id,
        };
    var dp = new DPlayer({
        container: document.getElementById('onlinefs-player'),
        screenshot: true,
        video: video
    });
})();