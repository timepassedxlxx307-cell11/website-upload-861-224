(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var open = mobilePanel.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobilePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  }

  var hero = document.querySelector('[data-hero-slider]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
    var index = 0;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      slides[index].classList.remove('is-active');
      if (dots[index]) {
        dots[index].classList.remove('is-active');
      }
      index = (next + slides.length) % slides.length;
      slides[index].classList.add('is-active');
      if (dots[index]) {
        dots[index].classList.add('is-active');
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var lists = Array.prototype.slice.call(document.querySelectorAll('.searchable-list'));
  var searchInput = document.querySelector('.page-search-input');
  var yearFilter = document.querySelector('.year-filter');
  var categoryFilter = document.querySelector('.category-filter');

  function getQueryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  if (searchInput && searchInput.classList.contains('global-search-input')) {
    searchInput.value = getQueryFromUrl();
  }

  function filterCards() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    var category = categoryFilter ? categoryFilter.value : '';

    lists.forEach(function (list) {
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardCategory = card.getAttribute('data-category') || '';
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (category && cardCategory !== category) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', filterCards);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterCards);
  }
  filterCards();

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-cover');
    var stream = video ? video.getAttribute('data-stream') : '';
    var prepared = false;
    var hlsInstance = null;

    function prepare() {
      if (!video || !stream || prepared) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
      prepared = true;
    }

    function play() {
      prepare();
      box.classList.add('is-playing');
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (button && video) {
      button.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    }
  });
})();
