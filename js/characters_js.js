const charactersPerPage = 10; 
let currentPage = 1; 
let totalCharacters = 0; 

const loadingAnimation = document.getElementById('loading-animation');

function showLoadingAnimation() {
  loadingAnimation.style.display = 'block';
}

function hideLoadingAnimation() {
  loadingAnimation.style.display = 'none';
}


function fetchCharacters(page) {
  showLoadingAnimation();

  const url = `https://swapi.dev/api/people/?page=${page}`;
  
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const characters = data.results;
    totalCharacters = data.count;
    hideLoadingAnimation();
 
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';

    for (let i = 0; i < characters.length; i += 3) {
      const row = document.createElement('tr');
      for (let j = i; j < i + 3; j++) {
        if (j < characters.length) {
          const character = characters[j];
          const card = createCard(character);
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
    nextBtn.disabled = currentPage === Math.ceil(totalCharacters / charactersPerPage);

    
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

function createCard(character) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('div');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = character.name;

  const cardImage = document.createElement('img');
  cardImage.classList.add('card-image');
  cardImage.src = `https://starwars-visualguide.com/assets/img/characters/${getCharacterId(character)}.jpg`;
  cardImage.alt = 'Character Image';
  cardImage.onerror = function() {
    cardImage.src = "img/img_error.png";
 };

  const cardInfo = document.createElement('ul');
  cardInfo.classList.add('card-info');

  const heightItem = createListItem('Height', character.height);
  const massItem = createListItem('Mass', character.mass);
  const hairColorItem = createListItem('Hair Color', character.hair_color);
  const skinColorItem = createListItem('Skin Color', character.skin_color);
  const eyeColorItem = createListItem('Eye Color', character.eye_color);
  const birthYearItem = createListItem('Birth Year', character.birth_year);
  const genderItem = createListItem('Gender', character.gender);

  cardInfo.appendChild(heightItem);
  cardInfo.appendChild(massItem);
  cardInfo.appendChild(hairColorItem);
  cardInfo.appendChild(skinColorItem);
  cardInfo.appendChild(eyeColorItem);
  cardInfo.appendChild(birthYearItem);
  cardInfo.appendChild(genderItem);

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

function getCharacterId(character) {
  const urlParts = character.url.split('/');
  return urlParts[urlParts.length - 2];
}

function createListItem(label, value) {
  const listItem = document.createElement('li');
  listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
  return listItem;
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchCharacters(currentPage);
  }
}

function goToNextPage() {
  const totalPages = 9;
  if (currentPage < totalPages) {
    currentPage++;
    fetchCharacters(currentPage);
  }
}


document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchCharacters(currentPage);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  const totalPages = Math.ceil(totalCharacters / charactersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    fetchCharacters(currentPage);
  }
});


fetchCharacters(currentPage);
