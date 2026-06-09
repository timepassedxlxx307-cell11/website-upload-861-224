(function () {
    window.initMoviePlayer = function (src) {
        var video = document.getElementById("movie-player");
        var start = document.querySelector(".player-start");
        var loaded = false;
        var hls = null;

        if (!video || !src) {
            return;
        }

        function attach() {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
            } else {
                video.src = src;
            }
        }

        function play() {
            attach();

            if (start) {
                start.classList.add("is-hidden");
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    if (start) {
                        start.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (start) {
            start.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    };
})();
