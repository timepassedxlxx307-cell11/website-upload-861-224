(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var index = 0;

      function show(next) {
        index = next;
        slides.forEach(function (slide, current) {
          slide.classList.toggle("is-active", current === index);
        });
        dots.forEach(function (dot, current) {
          dot.classList.toggle("is-active", current === index);
        });
      }

      dots.forEach(function (dot, current) {
        dot.addEventListener("click", function () {
          show(current);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          show((index + 1) % slides.length);
        }, 5200);
      }
    });

    document.querySelectorAll("[data-search-box]").forEach(function (input) {
      var root = input.closest("main") || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));
      var chips = Array.prototype.slice.call(root.querySelectorAll("[data-filter-value]"));
      var empty = root.querySelector("[data-no-result]");
      var activeCategory = "all";
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");

      if (query) {
        input.value = query;
      }

      function normalize(value) {
        return String(value || "").toLowerCase().trim();
      }

      function apply() {
        var term = normalize(input.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-keywords"));
          var category = card.getAttribute("data-category") || "";
          var matchedText = !term || haystack.indexOf(term) !== -1;
          var matchedCategory = activeCategory === "all" || category === activeCategory;
          var showCard = matchedText && matchedCategory;

          card.hidden = !showCard;
          if (showCard) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      input.addEventListener("input", apply);

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeCategory = chip.getAttribute("data-filter-value") || "all";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          apply();
        });
      });

      apply();
    });
  });
})();
