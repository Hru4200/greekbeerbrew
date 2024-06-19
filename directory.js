document.addEventListener('DOMContentLoaded', () => {
    const beerTypeSelect = document.getElementById('beer-type');
    const beerList = document.getElementById('beer-list');

    function renderBeers(beers) {
        beerList.innerHTML = beers.map(beer => `
            <div class="beer-card" onclick="window.location.href='${beer.link}'">
                <img src="${beer.image}" alt="${beer.name}">
                <h3>${beer.name}</h3>
            </div>
        `).join('');
    }

    function getAllBeers() {
        return breweries.flatMap(brewery => brewery.beers);
    }

    function filterBeers() {
        const type = beerTypeSelect.value;
        let beers = getAllBeers();
        if (type !== 'all') {
            beers = beers.filter(beer => beer.name.toLowerCase().includes(type.toLowerCase()));
        }
        renderBeers(beers);
    }

    beerTypeSelect.addEventListener('change', filterBeers);

    // Initial render
    renderBeers(getAllBeers());
});
