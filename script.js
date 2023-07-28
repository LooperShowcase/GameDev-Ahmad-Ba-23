const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let scoreBOard = document.getElementById("score");
scoreBOard.textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(cards);
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });
function shuffleCards() {
  let currentIndex = cards.length;
  let randomIndex;
  let temporaryValue;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = cards[randomIndex];
    cards[randomIndex] = cards[currentIndex];
    cards[currentIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src="${card.image}" />
        </div>
        
        <div class="back"></div>
       `;
    cardsContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) {
    return;
  }
  if (this === firstCard) {
    return;
  }
  this.classList.add("flipped");
  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  checkForMatch();
  scoreBOard.textContent = score;
}

function checkForMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) disableCards();
  else unflipCards();
}


function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("touchstart", flipCard);
  score++;
  if(score===9){
    startConfetti()
  }
  unlockBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
  }, 1000);
}

function unlockBoard() {
  firstCard = null;
  secondCard = null;    
  lockBoard = false;
}

function restart() {
  shuffleCards();
  unlockBoard();
  score = 0;
  scoreBOard.textContent = score;
  cardsContainer.innerHTML = "";
  generateCards();
  stopConfetti()
}
