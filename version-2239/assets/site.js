(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            document.body.classList.toggle("nav-open");
        });
    }

    var filterInputs = document.querySelectorAll("[data-filter-input]");
    filterInputs.forEach(function (input) {
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-text]"));
        var empty = document.querySelector("[data-empty-state]");

        function applyFilter() {
            var value = input.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-filter-text") || card.textContent || "").toLowerCase();
                var match = !value || text.indexOf(value) !== -1;
                card.style.display = match ? "" : "none";
                if (match) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        input.addEventListener("input", applyFilter);

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query && !input.value) {
            input.value = query;
        }

        applyFilter();
    });

    var heroLinks = document.querySelectorAll(".hero-featured a");
    heroLinks.forEach(function (link, index) {
        link.style.transitionDelay = String(index * 40) + "ms";
    });
})();
