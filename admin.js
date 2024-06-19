document.addEventListener('DOMContentLoaded', () => {
    const storedBreweries = JSON.parse(localStorage.getItem('breweries')) || breweries;
    const newBreweryForm = document.getElementById('new-brewery-form');
    const beerListDiv = document.getElementById('beer-list');
    const addBeerBtn = document.getElementById('add-beer-btn');
    const breweryListContent = document.getElementById('brewery-list-content');

    let beers = [];
    let currentBreweryIndex = -1;

    function createBeerFields(index, beer = {}) {
        return `
            <div class="beer-fields" data-index="${index}">
                <label for="beer-name-${index}">Beer Name:</label>
                <input type="text" id="beer-name-${index}" name="beer-name-${index}" value="${beer.name || ''}" required><br>
                <label for="beer-image-${index}">Beer Image URL:</label>
                <input type="text" id="beer-image-${index}" name="beer-image-${index}" value="${beer.image || ''}" required><br>
                <label for="beer-details-${index}">Beer Details:</label>
                <textarea id="beer-details-${index}" name="beer-details-${index}" required>${beer.details || ''}</textarea><br>
                <button type="button" class="remove-beer-btn">Remove Beer</button><br>
            </div>
        `;
    }

    function populateBreweryList() {
        breweryListContent.innerHTML = storedBreweries.map((brewery, index) => `
            <li>
                <strong>${brewery.name}</strong>
                <button type="button" onclick="editBrewery(${index})">Edit</button>
                <button type="button" onclick="deleteBrewery(${index})">Delete</button>
            </li>
        `).join('');
    }

    addBeerBtn.addEventListener('click', () => {
        const index = beers.length;
        beers.push({});
        beerListDiv.insertAdjacentHTML('beforeend', createBeerFields(index));
    });

    beerListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-beer-btn')) {
            const index = e.target.parentElement.getAttribute('data-index');
            beers.splice(index, 1);
            e.target.parentElement.remove();
        }
    });

    newBreweryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newBrewery = {
            name: document.getElementById('brewery-name').value,
            lat: parseFloat(document.getElementById('brewery-lat').value),
            lng: parseFloat(document.getElementById('brewery-lng').value),
            yearFounded: document.getElementById('brewery-year').value,
            founder: document.getElementById('brewery-founder').value,
            owner: document.getElementById('brewery-owner').value,
            categories: document.getElementById('brewery-categories').value.split(',').map(category => category.trim()),
            logo: document.getElementById('brewery-logo').value,
            beers: beers.map((_, index) => ({
                name: document.getElementById(`beer-name-${index}`).value,
                image: document.getElementById(`beer-image-${index}`).value,
                details: document.getElementById(`beer-details-${index}`).value
            }))
        };

        if (currentBreweryIndex >= 0) {
            storedBreweries[currentBreweryIndex] = newBrewery;
        } else {
            storedBreweries.push(newBrewery);
        }
        
        localStorage.setItem('breweries', JSON.stringify(storedBreweries));

        newBreweryForm.reset();
        beerListDiv.innerHTML = '';
        beers = [];
        currentBreweryIndex = -1;

        alert('Brewery saved successfully!');
        populateBreweryList();
    });

    window.editBrewery = (index) => {
        currentBreweryIndex = index;
        const brewery = storedBreweries[index];

        document.getElementById('brewery-id').value = index;
        document.getElementById('brewery-name').value = brewery.name;
        document.getElementById('brewery-lat').value = brewery.lat;
        document.getElementById('brewery-lng').value = brewery.lng;
        document.getElementById('brewery-year').value = brewery.yearFounded;
        document.getElementById('brewery-founder').value = brewery.founder;
        document.getElementById('brewery-owner').value = brewery.owner;
        document.getElementById('brewery-categories').value = brewery.categories.join(', ');
        document.getElementById('brewery-logo').value = brewery.logo;

        beers = brewery.beers;
        beerListDiv.innerHTML = beers.map((beer, index) => createBeerFields(index, beer)).join('');
    };

    window.deleteBrewery = (index) => {
        if (confirm('Are you sure you want to delete this brewery?')) {
            storedBreweries.splice(index, 1);
            localStorage.setItem('breweries', JSON.stringify(storedBreweries));
            populateBreweryList();
        }
    };

    populateBreweryList();
});
