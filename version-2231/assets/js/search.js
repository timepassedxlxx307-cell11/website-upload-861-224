(function () {
    const input = document.querySelector('#globalSearchInput');
    const results = document.querySelector('#searchResults');
    const empty = document.querySelector('#searchEmpty');

    if (!input || !results || !Array.isArray(MOVIE_SEARCH_DATA)) {
        return;
    }

    function getQueryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function cardTemplate(movie) {
        const tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card">',
            '    <a href="' + movie.href + '">',
            '        <div class="poster-wrap">',
            '            <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '            <span class="rating-pill">' + movie.rating + '</span>',
            '        </div>',
            '        <div class="movie-card-body">',
            '            <div class="card-line">',
            '                <span>' + escapeHtml(movie.region) + '</span>',
            '                <span>' + escapeHtml(movie.year) + '</span>',
            '            </div>',
            '            <h3>' + escapeHtml(movie.title) + '</h3>',
            '            <p>' + escapeHtml(movie.desc) + '</p>',
            '            <div class="tag-list">' + tags + '</div>',
            '        </div>',
            '    </a>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function render() {
        const query = input.value.trim().toLowerCase();
        const source = query
            ? MOVIE_SEARCH_DATA.filter(function (movie) {
                return movie.searchText.indexOf(query) !== -1;
            })
            : MOVIE_SEARCH_DATA.slice(0, 48);

        const list = source.slice(0, 120);
        results.innerHTML = list.map(cardTemplate).join('');

        if (empty) {
            empty.classList.toggle('is-visible', list.length === 0);
        }
    }

    input.value = getQueryFromUrl();
    input.addEventListener('input', render);
    render();
})();
