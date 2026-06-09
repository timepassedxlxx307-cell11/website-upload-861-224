(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function startAuto() {
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        showSlide(dotIndex);
        startAuto();
      });
    });

    showSlide(0);
    startAuto();
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var searchInput = document.querySelector('[data-search-input]');
  var clearButton = document.querySelector('[data-clear-search]');
  var categoryFilter = document.querySelector('[data-category-filter]');
  var regionFilter = document.querySelector('[data-region-filter]');
  var yearFilter = document.querySelector('[data-year-filter]');

  function uniqueValues(attribute) {
    var map = {};
    cards.forEach(function (card) {
      var value = card.getAttribute(attribute);
      if (value) {
        map[value] = true;
      }
    });
    return Object.keys(map).sort(function (a, b) {
      return String(b).localeCompare(String(a), 'zh-CN');
    });
  }

  function fillSelect(select, attribute) {
    if (!select) {
      return;
    }

    uniqueValues(attribute).forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  fillSelect(regionFilter, 'data-region');
  fillSelect(yearFilter, 'data-year');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var keyword = normalize(searchInput && searchInput.value);
    var category = categoryFilter ? categoryFilter.value : '';
    var region = regionFilter ? regionFilter.value : '';
    var year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre')
      ].join(' '));

      var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchedCategory = !category || card.getAttribute('data-category') === category;
      var matchedRegion = !region || card.getAttribute('data-region') === region;
      var matchedYear = !year || card.getAttribute('data-year') === year;

      card.classList.toggle('is-hidden', !(matchedKeyword && matchedCategory && matchedRegion && matchedYear));
    });
  }

  [searchInput, categoryFilter, regionFilter, yearFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
      }
      if (categoryFilter) {
        categoryFilter.value = '';
      }
      if (regionFilter) {
        regionFilter.value = '';
      }
      if (yearFilter) {
        yearFilter.value = '';
      }
      applyFilters();
    });
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
      applyFilters();
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-play]');
    var src = player.getAttribute('data-video');
    var hls = null;
    var ready = false;

    function attach() {
      if (!video || !src || ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }

      video.controls = true;
      ready = true;
    }

    function play() {
      attach();

      if (cover) {
        cover.hidden = true;
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          video.controls = true;
        });
      }
    }

    if (cover && video) {
      cover.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!ready) {
          play();
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    }
  });
})();
