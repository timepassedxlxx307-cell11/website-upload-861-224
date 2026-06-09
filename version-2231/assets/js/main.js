(function () {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let currentSlide = 0;
    let slideTimer = null;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === currentSlide);
        });
    }

    function startSlides() {
        if (slideTimer) {
            clearInterval(slideTimer);
        }

        if (slides.length > 1) {
            slideTimer = setInterval(function () {
                setSlide(currentSlide + 1);
            }, 5200);
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            setSlide(index);
            startSlides();
        });
    });

    setSlide(0);
    startSlides();

    const filterPanels = Array.from(document.querySelectorAll('[data-filter-panel]'));

    filterPanels.forEach(function (panel) {
        const rootSelector = panel.getAttribute('data-target') || '.movie-grid';
        const root = document.querySelector(rootSelector);

        if (!root) {
            return;
        }

        const cards = Array.from(root.querySelectorAll('.movie-card'));
        const keyword = panel.querySelector('[data-filter-keyword]');
        const year = panel.querySelector('[data-filter-year]');
        const type = panel.querySelector('[data-filter-type]');
        const region = panel.querySelector('[data-filter-region]');
        const empty = document.querySelector(panel.getAttribute('data-empty') || '');

        function cardValue(card, key) {
            return (card.getAttribute('data-' + key) || '').toLowerCase();
        }

        function applyFilter() {
            const q = keyword ? keyword.value.trim().toLowerCase() : '';
            const selectedYear = year ? year.value.trim().toLowerCase() : '';
            const selectedType = type ? type.value.trim().toLowerCase() : '';
            const selectedRegion = region ? region.value.trim().toLowerCase() : '';
            let visible = 0;

            cards.forEach(function (card) {
                const text = [
                    cardValue(card, 'title'),
                    cardValue(card, 'region'),
                    cardValue(card, 'type'),
                    cardValue(card, 'genre'),
                    cardValue(card, 'year')
                ].join(' ');

                const matched = (!q || text.indexOf(q) !== -1) &&
                    (!selectedYear || cardValue(card, 'year') === selectedYear) &&
                    (!selectedType || cardValue(card, 'type').indexOf(selectedType) !== -1) &&
                    (!selectedRegion || cardValue(card, 'region').indexOf(selectedRegion) !== -1);

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [keyword, year, type, region].forEach(function (field) {
            if (field) {
                field.addEventListener('input', applyFilter);
                field.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });
})();
