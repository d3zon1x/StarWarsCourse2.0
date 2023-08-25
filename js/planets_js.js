const planetsPerPage = 10; 
let currentPage = 1; 
let totalPlanets = 0; 

const loadingAnimation = document.getElementById('loading-animation');

function showLoadingAnimation() {
  loadingAnimation.style.display = 'block';
}

function hideLoadingAnimation() {
  loadingAnimation.style.display = 'none';
}


function fetchPlanets(page) {
  showLoadingAnimation();

  const url = `https://swapi.dev/api/planets/?page=${page}`;

  fetch(url)
  .then(response => response.json())
  .then(data => {
    const planets = data.results;
    totalPlanets = data.count;
    hideLoadingAnimation();
    
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';

    for (let i = 0; i < planets.length; i += 3) {
      const row = document.createElement('tr');
      for (let j = i; j < i + 3; j++) {
        if (j < planets.length) {
          const planet = planets[j];
          const card = createCard(planet);
          const cell = document.createElement('td');
          cell.appendChild(card);
          row.appendChild(cell);
        }
      }
      cardsContainer.appendChild(row);
    }

    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === Math.ceil(totalPlanets / planetsPerPage);

    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  })
  .catch(error => {
    hideLoadingAnimation();
    console.error('Error:', error);
  });
}

function createCard(planet) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('card-planet');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h3');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = planet.name;

  const cardImage = document.createElement('img');
  cardImage.classList.add('card-image');
  cardImage.src = `https://starwars-visualguide.com/assets/img/planets/${getPlanetId(planet)}.jpg`;
  cardImage.alt = 'Planet Image';
  cardImage.onerror = function() {
     cardImage.src = "img/img_error_planet.png";
  };

  const cardInfo = document.createElement('ul');
  cardInfo.classList.add('card-info');

  const diameterItem = createListItem('Diameter', planet.diameter);
  const climateItem = createListItem('Climate', planet.climate);
  const gravityItem = createListItem('Gravity', planet.gravity);
  const terrainItem = createListItem('Terrain', planet.terrain);
  const populationItem = createListItem('Population', planet.population);

  cardInfo.appendChild(diameterItem);
  cardInfo.appendChild(climateItem);
  cardInfo.appendChild(gravityItem);
  cardInfo.appendChild(terrainItem);
  cardInfo.appendChild(populationItem);

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardImage);
  cardBody.appendChild(cardInfo);

  card.appendChild(cardBody);
  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card-footer');
  cardFooter.textContent = 'Star Wars Info';

  card.appendChild(cardFooter);
  return card;
}

function getPlanetId(planet) {
  const urlParts = planet.url.split('/');
  return urlParts[urlParts.length - 2];
}

function createListItem(label, value) {
  const listItem = document.createElement('li');
  listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
  return listItem;
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchPlanets(currentPage);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  const totalPages = Math.ceil(totalPlanets / planetsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    fetchPlanets(currentPage);
  }
});

fetchPlanets(currentPage);