(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function setupMenu() {
        var button = $(".menu-toggle");
        var panel = $(".mobile-panel");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    function setupHero() {
        var hero = $(".hero");
        if (!hero) {
            return;
        }
        var slides = $all(".hero-slide", hero);
        var dots = $all(".hero-dots button", hero);
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === index);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, position) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(position);
                start();
            });
        });
        show(0);
        start();
    }

    function setupFilters() {
        var bar = $(".filter-bar");
        if (!bar) {
            return;
        }
        var keyword = $("[data-filter-keyword]", bar);
        var year = $("[data-filter-year]", bar);
        var type = $("[data-filter-type]", bar);
        var reset = $("[data-filter-reset]", bar);
        var cards = $all(".movie-card[data-title]");
        var noResults = $(".no-results");
        function apply() {
            var q = normalize(keyword && keyword.value);
            var y = normalize(year && year.value);
            var t = normalize(type && type.value);
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type")
                ].join(" "));
                var matched = (!q || text.indexOf(q) !== -1) &&
                    (!y || normalize(card.getAttribute("data-year")) === y) &&
                    (!t || normalize(card.getAttribute("data-type")).indexOf(t) !== -1);
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (noResults) {
                noResults.classList.toggle("show", visible === 0);
            }
        }
        [keyword, year, type].forEach(function (item) {
            if (item) {
                item.addEventListener("input", apply);
                item.addEventListener("change", apply);
            }
        });
        if (reset) {
            reset.addEventListener("click", function () {
                if (keyword) {
                    keyword.value = "";
                }
                if (year) {
                    year.value = "";
                }
                if (type) {
                    type.value = "";
                }
                apply();
            });
        }
        apply();
    }

    function setupSearchPage() {
        var input = $("[data-search-input]");
        var cards = $all("[data-search-card]");
        if (!input || cards.length === 0) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q") || "";
        input.value = q;
        var noResults = $(".no-results");
        function apply() {
            var keyword = normalize(input.value);
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search-card"));
                var matched = !keyword || text.indexOf(keyword) !== -1;
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (noResults) {
                noResults.classList.toggle("show", visible === 0);
            }
        }
        input.addEventListener("input", apply);
        apply();
    }

    window.setupMoviePlayer = function (source) {
        var video = document.getElementById("moviePlayer");
        var overlay = document.getElementById("playOverlay");
        var isReady = false;
        function attach() {
            if (isReady || !video || !source) {
                return;
            }
            isReady = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video.hlsInstance = hls;
            } else {
                video.src = source;
            }
        }
        function play() {
            attach();
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }
        if (!video) {
            return;
        }
        if (overlay) {
            overlay.addEventListener("click", function () {
                play();
            });
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove("is-hidden");
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupSearchPage();
    });
})();
