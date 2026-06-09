(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            var opened = mobileNav.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    var slider = document.querySelector(".hero-slider");

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startSlider() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var index = Number(dot.getAttribute("data-slide") || 0);
                showSlide(index);
                startSlider();
            });
        });

        startSlider();
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll(".js-search-input"));

    inputs.forEach(function (input) {
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-item"));

        function filterCards() {
            var keyword = input.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                card.classList.toggle("is-hidden", keyword !== "" && text.indexOf(keyword) === -1);
            });
        }

        input.addEventListener("input", filterCards);

        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q");

        if (initial) {
            input.value = initial;
            filterCards();
        }
    });
})();
