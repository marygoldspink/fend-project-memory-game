/*
 * Create a list that holds all of your cards
 */
const namesOfCards = ["diamond", "diamond", "paper-plane-o", "paper-plane-o", "anchor", "anchor", "bolt", "bolt", "cube", "cube", "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"];
let listOfOpenCards = [];
let moveCounter = 0;
let startTime = -1;
let starRating = 3;
const moveCounterDisplay = document.getElementsByClassName('moves')[0];
const timerElement = document.getElementsByClassName('timer')[0];

resetGame();

setInterval(function() {
    if (startTime > -1) {
        startTime += 1
        timerElement.innerHTML = startTime;
    }
}, 1000);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// add click listener to our reset button and restart after game complete button
const resetButton = document.getElementsByClassName('restart')[0];
resetButton.addEventListener("click", function () {
    resetGame();
});

const restartGameButton = document.getElementById('play-again-button');
restartGameButton.addEventListener("click", function () {
    resetGame();
    document.getElementById('winner-popup').classList.remove('show');
});

function showCard(card) {
    card.classList.add('open', 'show');
}

/*
 * Add to the list of open cards.
 */
function addCardToOpenCardList(card) {
    listOfOpenCards.push(card);

    // if we now have 2 cards in that list then check to see if they match
    if (listOfOpenCards.length == 2) {
        const cardA = listOfOpenCards[0];
        const cardB = listOfOpenCards[1];

        // if the cards do match, lock the cards in the open position
        if (cardA.firstElementChild.className === cardB.firstElementChild.className) {
            lockMatchingCards(cardA, cardB);
            showWinnerModalIfFinshed();
        }

        removeOpenShowClasses(cardA, cardB);
        // reset our list of open cards
        listOfOpenCards = [];
        updateMoveCounter()
    }
}

function showWinnerModalIfFinshed() {
    let matchingCards = document.getElementsByClassName('match');
    if (matchingCards.length == 16) {
        document.getElementById('winner-popup').classList.add('show');
        document.getElementById('moves').innerHTML = moveCounter;
        document.getElementById('time-taken').innerHTML = startTime;
        document.getElementById('star-rating').innerHTML = starRating;
    }
}

function lockMatchingCards(cardA, cardB) {
    cardA.classList.add('match');
    cardB.classList.add('match');
}

function removeOpenShowClasses(cardA, cardB) {
    setTimeout(function () {
        cardA.classList.remove('open', 'show');
        cardB.classList.remove('open', 'show');
    }, 1000);
}

function updateMoveCounter() {
    moveCounter += 1;
    moveCounterDisplay.innerHTML = moveCounter;

    let stars = document.querySelectorAll('.stars .fa');
    if (moveCounter > 10) {
        stars[2].classList.remove('fa-star')
        stars[2].classList.add('fa-star-o');
        starRating = 2;
    }
    if (moveCounter > 15) {
        stars[1].classList.remove('fa-star');
        stars[1].classList.add('fa-star-o');
        starRating = 1;
    }
}

function resetGame() {
    listOfOpenCards = [];
    moveCounter = 0;
    starRating = 3;
    startTime = -1;
    moveCounterDisplay.innerHTML = moveCounter;
    timerElement.innerHTML = 0;

    /*
    * Display the cards on the page
    *   - shuffle the list of cards using the provided "shuffle" method below
    *   - loop through each card and create its HTML
    *   - add each card's HTML to the page
    */
    shuffle(namesOfCards);

    // create a variable to hold a String which is the HTML text to show our cards
    let cardsAsString = '';

    // now loop through each card in the deck and append it (using +=) to our variable
    // with with the text for that card - we use deck[i] to get the name of the card
    for (var i = 0; i < namesOfCards.length; i++) {
        cardsAsString += '<li class="card">' +
            '<i class="fa fa-' + namesOfCards[i] + '"></i>' +
            '</li>';
    }

    // now we'll use this getElementsByClassName to get our HTML element which holds the deck 
    // NOTE getElementsByClassName returns an array, so we use [0] to get the first element of that
    //      array
    const UlElementHolder = document.getElementsByClassName('deck')[0];

    // now we change the HTML text inside of this element to be the HTML of our shuffled cards
    UlElementHolder.innerHTML = cardsAsString;

    /*
    * set up the event listener for a card. If a card is clicked:
    *  - display the card's symbol (put this functionality in another function that you call from this one)
    *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
    *  - if the list already has another card, check to see if the two cards match
    *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
    *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
    *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
    *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
    */
    const allCards = document.getElementsByClassName('card');

    for (var i = 0; i < allCards.length; i++) {

        allCards[i].addEventListener("click", function ifClicked(clickEvent) {
            startTimerIfNotStarted();
            let clickedCard = clickEvent.target;

            if (clickedCard.classList.contains('open') ||
                clickedCard.classList.contains('match')) {
                return;
            }

            showCard(clickedCard);
            addCardToOpenCardList(clickedCard);
        });

    }
}

/*
 * This function checks to see if we started a timer and if not starts one by using
 * setInterval() and updating the startTime count
 */
function startTimerIfNotStarted() {
    if (startTime === -1) {
        startTime = 0;
        timerElement.innerHTML = startTime;
    }
}