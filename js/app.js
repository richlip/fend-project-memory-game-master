/*
 * Create a list that holds all of your cards
 * three var sets available, this tiem uncomment and comment the var sets for using
 */
// nerd icons:
var cardLists = ["fa fa-windows", "fa fa-twitter-square", "fa fa-meetup", "fa fa-slack", "fa fa-whatsapp", "fa fa-btc", "fa fa-tripadvisor", "fa fa-maxcdn"];
// payment icons:
// var cardLists = ["fa fa-cc-amex", "fa fa-cc-diners-club", "fa fa-cc-mastercard", "fa fa-cc-discover", "fa fa-cc-visa", "fa fa-btc", "fa fa-paypal", "fa fa-google-wallet"];
// currency icons: 
// var cardLists = ["fa fa-jpy", "fa fa-krw", "fa fa-usd", "fa fa-rub", "fa fa-ils", "fa fa-eur", "fa fa-jpy", "fa fa-btc"];
var moves = 0;
var match_found = 0;

// Prüfung, ob Spiel startet
var game_started = false;

// Timer object
var timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {                  
$('#timer').html(timer.getTimeValues().toString());
});

// Reset
$('#reset-button').click(resetGame);
// Karte erstellen
function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}
// Zufallsgenerator
function generateCards() {
    for (var i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
// Array für geöffnete Karten
openCards = [];

// Karten Funktionalität
function toggleCard() {
    
    // Timerstart
    if (game_started == false) {
        game_started = true;
        timer.start();
    }
    
    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableCLick();
    }
    
    else if (openCards.length === 1) {
    // Bewegung hochzählen
        updateMoves();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}
// Geöffnete Katzen ohne klick
function disableCLick() {
    openCards.forEach(function (card) {
        card.off('click');
    });
}
// klick auf Karte
function enableClick() {
    openCards[0].click(toggleCard);
}
// Kartenvergleich
function matchOpenCards() {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        console.log("matchCard");
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableClick();
        removeOpenCards();
    }
}
// Funktion - Entfernung von geöffneten Karten
function removeOpenCards() {
    openCards = [];
}
// Animation
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});
// Move
function updateMoves() {
    moves += 1;
    $('#moves').html(`${moves} Moves`);
    if (moves == 24) {
        addBlankStar();
    }
    else if (moves == 15) {
        addBlankStar();
    }
}
// Spielende
function checkWin() {
    match_found += 1;
    if (match_found == 8) {
        showResults();
    }
}
// Sterne 
function addBlankStar() {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}
// Sterne abziehen
function addStars() {
    for (var i = 0; i < 3; i++) {
        $('#stars').append('<li><i class="fa fa-star"></i></li>');
    }
}
// Spielreset
function resetGame() {
    moves = 0;
    match_found = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#game-deck')[0].style.display = "";
    $('#sucess-result')[0].style.display = "none";
    game_started=false;
    timer.stop();
    $('#timer').html("00:00:00");
    playGame();
}
// Initiale function
function playGame() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Moves");
    addStars(3);
}
// Spielende - Ergebnisse
function showResults() {
    $('#sucess-result').empty();
    timer.pause();
    var scoreBoard = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " /> </svg>
        <p class="success"> Congrats !!! </p>
        <p>
            <span class="score-titles">Moves:</span>
            <span class="score-values">${moves}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
                <i class="fa fa-star fa-5x"></i>    
             </div>
             <div class="star">
                <i class="fa ${ (moves > 23) ? "fa-star-o" : "fa-star"}  fa-5x"></i>    
             </div>
            <div class="star">
                <i class="fa ${ (moves > 14) ? "fa-star-o" : "fa-star"} fa-5x"></i>    
             </div>
        </div>
        <div class="text-center margin-top-5" id="restart">
            <i class="fa fa-refresh fa-5x"></i>
          </div>
    `;
    $('#game-deck')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#restart').click(resetGame);
}

// Spielstart
playGame();