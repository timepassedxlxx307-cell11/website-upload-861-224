(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function textValue(node) {
    return (node.getAttribute("data-title") + " " + node.getAttribute("data-region") + " " + node.getAttribute("data-year") + " " + node.getAttribute("data-genre")).toLowerCase();
  }

  function bindMenu() {
    var button = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
        button.setAttribute("aria-expanded", "true");
        button.textContent = "×";
      } else {
        panel.setAttribute("hidden", "");
        button.setAttribute("aria-expanded", "false");
        button.textContent = "☰";
      }
    });
  }

  function bindHero() {
    var slides = selectAll("[data-hero-slide]");
    var dots = selectAll("[data-hero-dot]");
    var thumbs = selectAll("[data-hero-thumb]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("mouseenter", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function bindFilters() {
    var input = document.querySelector("[data-page-filter]");
    var list = document.querySelector("[data-filter-list]");
    var clear = document.querySelector("[data-clear-filter]");
    if (!input || !list) {
      return;
    }
    var items = selectAll("[data-title]", list);
    function apply() {
      var q = input.value.trim().toLowerCase();
      items.forEach(function (item) {
        item.classList.toggle("hidden-by-filter", q && textValue(item).indexOf(q) === -1);
      });
    }
    input.addEventListener("input", apply);
    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        apply();
        input.focus();
      });
    }
  }

  function cardTemplate(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return "<article class=\"movie-card compact-card\" data-title=\"" + escapeHtml(movie.title) + "\" data-region=\"" + escapeHtml(movie.region) + "\" data-year=\"" + escapeHtml(movie.year) + "\" data-genre=\"" + escapeHtml(movie.genre) + "\">" +
      "<a class=\"poster-link\" href=\"" + movie.url + "\" aria-label=\"观看 " + escapeHtml(movie.title) + "\"><img src=\"" + movie.cover + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\"><span class=\"play-badge\">▶</span><span class=\"duration-badge\">" + escapeHtml(movie.duration) + "</span></a>" +
      "<div class=\"movie-card-body\"><a class=\"movie-title\" href=\"" + movie.url + "\">" + escapeHtml(movie.title) + "</a><p>" + escapeHtml(movie.oneLine) + "</p><div class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div><div class=\"tag-row\">" + tags + "</div></div></article>";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>\"]/g, function (char) {
      return {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"}[char];
    });
  }

  function bindSearchPage() {
    var input = document.querySelector("[data-search-input]");
    var output = document.querySelector("[data-search-results]");
    if (!input || !output || !window.SEARCH_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var current = params.get("q") || "";
    input.value = current;
    function render() {
      var q = input.value.trim().toLowerCase();
      var pool = window.SEARCH_MOVIES;
      var found = pool.filter(function (movie) {
        if (!q) {
          return movie.featured;
        }
        return movie.keywords.indexOf(q) !== -1;
      }).slice(0, 80);
      output.innerHTML = found.map(cardTemplate).join("");
    }
    input.addEventListener("input", render);
    render();
  }

  function ensureHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    var existing = document.getElementById("hls-runtime");
    if (existing) {
      existing.addEventListener("load", callback, {once: true});
      return;
    }
    var script = document.createElement("script");
    script.id = "hls-runtime";
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
    script.onload = callback;
    document.head.appendChild(script);
  }

  window.SitePlayer = {
    bind: function (videoId, overlayId, url) {
      var video = document.getElementById(videoId);
      var overlay = document.getElementById(overlayId);
      if (!video || !overlay || !url) {
        return;
      }
      var started = false;
      function playNow() {
        if (started) {
          video.play().catch(function () {});
          return;
        }
        started = true;
        overlay.classList.add("is-hidden");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
          video.play().catch(function () {});
          return;
        }
        ensureHls(function () {
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({maxBufferLength: 30});
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {});
            });
          } else {
            video.src = url;
            video.play().catch(function () {});
          }
        });
      }
      overlay.addEventListener("click", playNow);
      video.addEventListener("click", function () {
        if (!started) {
          playNow();
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    bindMenu();
    bindHero();
    bindFilters();
    bindSearchPage();
  });
})();
