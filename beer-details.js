document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const beerName = params.get('beer').replace(/-/g, ' ');

    const beerDetailsContainer = document.getElementById('beer-details');
    let beer;

    breweries.forEach(brewery => {
        brewery.beers.forEach(b => {
            if (b.name.toLowerCase() === beerName) {
                beer = b;
            }
        });
    });

    if (beer) {
        beerDetailsContainer.innerHTML = `
            <h1>${beer.name}</h1>
            <img src="${beer.image}" alt="${beer.name}">
            <p>${beer.details}</p>
        `;
    } else {
        beerDetailsContainer.innerHTML = '<p>Beer not found.</p>';
    }
});
