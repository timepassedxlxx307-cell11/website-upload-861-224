(function () {
    function playWithSource(video, sourceUrl) {
        if (!video || !sourceUrl) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
            video.load();
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            return;
        }

        video.src = sourceUrl;
        video.load();
        video.play().catch(function () {});
    }

    window.setupMoviePlayer = function (sourceUrl) {
        const video = document.querySelector('.player-video');
        const overlay = document.querySelector('.player-overlay');
        const button = document.querySelector('.player-start');
        let started = false;

        function start() {
            if (started) {
                if (video && video.paused) {
                    video.play().catch(function () {});
                }
                return;
            }

            started = true;

            if (overlay) {
                overlay.classList.add('is-hidden');
            }

            playWithSource(video, sourceUrl);
        }

        if (button) {
            button.addEventListener('click', start);
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!started) {
                    start();
                }
            });
        }
    };
})();
