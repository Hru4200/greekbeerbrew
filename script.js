document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([38.0, 23.7], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
    }).addTo(map);

    const storedBreweries = JSON.parse(localStorage.getItem('breweries')) || breweries;

    const markers = [];

    function addBreweryToMap(brewery) {
        const icon = L.divIcon({
            html: `<div class="brewery-marker"><img src="${brewery.logo}" alt="${brewery.name} logo" /></div>`,
            iconSize: [32, 32],  // Defines the size of the icon
            iconAnchor: [16, 32],  // Defines the point of the icon which will correspond to marker's location
            className: ''
        });

        const marker = L.marker([brewery.lat, brewery.lng], { icon }).addTo(map);
        marker.on('click', () => {
            showBreweryDetails(brewery);
        });
        markers.push({ marker, brewery });
    }

    function showBreweryDetails(brewery) {
        const popupTitle = document.getElementById('popup-title');
        const popupContent = document.getElementById('popup-content');

        popupTitle.textContent = brewery.name;
        popupContent.innerHTML = `
            <p><strong>Founded:</strong> ${brewery.yearFounded}</p>
            <p><strong>Founder:</strong> ${brewery.founder}</p>
            <p><strong>Owner:</strong> ${brewery.owner}</p>
            <p><strong>Beer categories:</strong> ${brewery.categories.join(', ')}</p>
            <div class="beer-list">
                ${brewery.beers ? brewery.beers.map(beer => `
                    <div class="beer-item" onclick="window.location.href='${beer.link}'">
                        <img src="${beer.image}" alt="${beer.name}">
                        <p>${beer.name}</p>
                    </div>
                `).join('') : ''}
            </div>
        `;

        document.getElementById('popup').style.display = 'block';
    }

    function filterMarkers() {
        const selectedCategory = document.getElementById('beer-category-filter').value;

        markers.forEach(({ marker, brewery }) => {
            const hasCategory = selectedCategory === 'all' || brewery.categories.includes(selectedCategory);
            if (hasCategory) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        });
    }

    document.getElementById('beer-category-filter').addEventListener('change', filterMarkers);

    storedBreweries.forEach(addBreweryToMap);

    document.getElementById('popup-close').addEventListener('click', () => {
        document.getElementById('popup').style.display = 'none';
    });

    function makePopupDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById(elmnt.id + "-header");

        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    makePopupDraggable(document.getElementById("popup"));
});
