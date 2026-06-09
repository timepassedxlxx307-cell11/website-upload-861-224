(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterBar = document.querySelector('[data-filter-bar]');
  var filterGrid = document.querySelector('[data-filter-grid]');

  if (filterBar && filterGrid) {
    var filterButtons = Array.prototype.slice.call(filterBar.querySelectorAll('[data-filter-value]'));
    var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card'));

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter-value');
        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        cards.forEach(function (card) {
          var matched = value === 'all' || card.getAttribute('data-region') === value || card.getAttribute('data-type') === value;
          card.classList.toggle('is-filter-hidden', !matched);
        });
      });
    });
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchBox = document.getElementById('search-box');
  var results = document.getElementById('search-results');
  var status = document.querySelector('[data-search-status]');

  function cardTemplate(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '<article class="movie-card movie-card-compact">' +
      '<a class="poster" href="./' + escapeHtml(movie.file) + '">' +
      '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>' +
      '</a>' +
      '<div class="card-body">' +
      '<h3><a href="./' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="meta-line">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.genre) + '</div>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function performSearch(query) {
    if (!results || !window.SEARCH_MOVIES) {
      return;
    }

    var keyword = String(query || '').trim().toLowerCase();
    var pool = window.SEARCH_MOVIES;
    var matches = keyword ? pool.filter(function (movie) {
      return movie.searchText.indexOf(keyword) !== -1;
    }) : pool.slice(0, 48);

    var limited = matches.slice(0, 96);
    results.innerHTML = limited.map(cardTemplate).join('');

    if (status) {
      status.textContent = keyword ? '搜索结果：' + keyword : '热门影片';
    }
  }

  if (searchForm && searchBox) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (query) {
      searchBox.value = query;
      performSearch(query);
    }

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      performSearch(searchBox.value);
      var nextUrl = './search.html?q=' + encodeURIComponent(searchBox.value.trim());
      window.history.replaceState(null, '', nextUrl);
    });

    searchBox.addEventListener('input', function () {
      performSearch(searchBox.value);
    });
  }
})();
