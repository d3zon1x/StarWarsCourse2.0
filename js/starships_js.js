const starshipsPerPage = 10;
let currentPage = 1; 
let totalStarships = 0; 

const loadingAnimation = document.getElementById('loading-animation');

function showLoadingAnimation() {
  loadingAnimation.style.display = 'block';
}

function hideLoadingAnimation() {
  loadingAnimation.style.display = 'none';
}


function fetchStarships(page) {
  showLoadingAnimation();

  const url = `https://swapi.dev/api/starships/?page=${page}`;

  fetch(url)
  .then(response => response.json())
  .then(data => {
    const starships = data.results;
    totalStarships = data.count;
    hideLoadingAnimation();

    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';

    for (let i = 0; i < starships.length; i += 3) {
      const row = document.createElement('tr');
      for (let j = i; j < i + 3; j++) {
        if (j < starships.length) {
          const starship = starships[j];
          const card = createCard(starship);
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
    nextBtn.disabled = currentPage === Math.ceil(totalStarships / starshipsPerPage);

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

function createCard(starship) {
  const card_space = document.createElement('div');
  card_space.classList.add('card');
  card_space.classList.add('card-space');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h3');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = starship.name;

  const cardImage = document.createElement('img');
  cardImage.classList.add('card-image');
  cardImage.src = `https://starwars-visualguide.com/assets/img/starships/${getStarshipId(starship)}.jpg`;
  cardImage.alt = 'Starship Image';
  cardImage.onerror = function() {
    cardImage.src = "img/img_error_star.png";
 };

  const cardInfo = document.createElement('ul');
  cardInfo.classList.add('card-info');

  const modelItem = createListItem('Model', starship.model);
  const manufacturerItem = createListItem('Manufacturer', starship.manufacturer);
  const crewItem = createListItem('Crew', starship.crew);
  const passengersItem = createListItem('Passengers', starship.passengers);
  const starshipClassItem = createListItem('Starship Class', starship.starship_class);

  cardInfo.appendChild(modelItem);
  cardInfo.appendChild(manufacturerItem);
  cardInfo.appendChild(crewItem);
  cardInfo.appendChild(passengersItem);
  cardInfo.appendChild(starshipClassItem);

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardImage);
  cardBody.appendChild(cardInfo);

  card_space.appendChild(cardBody);
  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card-footer');
  cardFooter.textContent = 'Star Wars Info';

  card_space.appendChild(cardFooter);
  return card_space;
}
function getStarshipId(starship) {
  const urlParts = starship.url.split('/');
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
    fetchStarships(currentPage);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  const totalPages = Math.ceil(totalStarships / starshipsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    fetchStarships(currentPage);
  }
});


fetchStarships(currentPage);