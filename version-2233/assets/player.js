(function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-video-url]'));

  buttons.forEach(function (button) {
    var shell = button.closest('.video-shell');
    var video = shell ? shell.querySelector('video') : null;
    var url = button.getAttribute('data-video-url');
    var started = false;
    var hls = null;

    function startPlayback() {
      if (!video || !url) {
        return;
      }

      button.classList.add('is-hidden');

      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          video.src = url;
        }
      }

      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', startPlayback);

    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          startPlayback();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
