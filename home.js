let blackjackGame = {
    'you': { 'scoreSpan': '#human-score', 'div': '#player-cont', 'human-score': 0 },
    'dealer': { 'scoreSpan': '#bot-score', 'div': '#bot-cont', 'bot-score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] }
};

document.querySelector('#hit').addEventListener('click', blackjackHit);
document.querySelector('#stand').addEventListener('click', blackJackStand);
document.querySelector('#deal').addEventListener('click', blackJackDeal);

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

function blackjackHit() {
    document.querySelector('#result').textContent = 'Let\'s play';
    document.querySelector('#result').style.color = 'black';
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    // console.log(YOU['human-score']);
}

function showCard(card, activePlayer) {
    if (activePlayer === YOU) {
        if (activePlayer['human-score'] <= 21) {
            let cardImage = document.createElement('img');
            cardImage.src = `images/${card}.png`;
            document.querySelector(activePlayer['div']).appendChild(cardImage);
            hitSound.play();
        }
    }

    else if (activePlayer === DEALER) {
        if (activePlayer['bot-score'] <= 21) {
            let cardImage = document.createElement('img');
            cardImage.src = `images/${card}.png`;
            document.querySelector(activePlayer['div']).appendChild(cardImage);
            hitSound.play();
        }
    }
}

function blackJackDeal() {
    let yourImage = document.querySelector('#player-cont').querySelectorAll('img');
    let dealerImage = document.querySelector('#bot-cont').querySelectorAll('img');

    for (i = 0; i < yourImage.length; i++) {
        yourImage[i].remove();
    }

    for (i = 0; i < dealerImage.length; i++) {
        dealerImage[i].remove();
    }

    YOU['human-score'] = 0;
    DEALER['bot-score'] = 0;
    document.querySelector('#human-score').textContent = 0;
    document.querySelector('#bot-score').textContent = 0;

    document.querySelector('#human-score').style.color = 'white';
    document.querySelector('#bot-score').style.color = 'white';
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) {

    if (activePlayer === YOU) {//for human
        if (card === 'A') {
            //if add 11 is beneficial, add 11, else add 1 if Ace card comes up
            if (((activePlayer['human-score']) + (blackjackGame['cardsMap'][card])) <= 21) {
                activePlayer['human-score'] += blackjackGame['cardsMap'][card][1];
            }
            else {
                activePlayer['human-score'] += blackjackGame['cardsMap'][card][0];
            }
        } else {
            activePlayer['human-score'] += blackjackGame['cardsMap'][card];
        }
    }

    else if (activePlayer === DEALER) {//for BOT
        if (card === 'A') {
            //if add 11 is beneficial, add 11, else add 1 if Ace card comes up
            if (((activePlayer['bot-score']) + (blackjackGame['cardsMap'][card])) <= 21) {
                activePlayer['bot-score'] += blackjackGame['cardsMap'][card][1];
            }
            else {
                activePlayer['bot-score'] += blackjackGame['cardsMap'][card][0];
            }
        } else {
            activePlayer['bot-score'] += blackjackGame['cardsMap'][card];
        }
    }
}

function showScore(activePlayer) {
    if (activePlayer === YOU) {
        if (activePlayer['human-score'] > 21) {
            document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
            document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        } else {
            document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['human-score'];
        }
    }

    else if (activePlayer === DEALER) {
        if (activePlayer['bot-score'] > 21) {
            document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
            document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        } else {
            document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['bot-score'];
        }
    }
}

function blackJackStand() {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);

    if(DEALER['bot-score']>15){
        let winner = computeWinner();
        showResult(winner);
    }
}

function computeWinner() {
    let winner;

    if (YOU['human-score'] <= 21) {
        if (YOU['human-score'] > DEALER['bot-score'] || (DEALER['bot-score'] > 21)) {
            console.log('You won!');
            winner = YOU;
        } else if (YOU['human-score'] < DEALER['bot-score']) {
            console.log('You lost!');
            winner = DEALER;
        }
        else if (YOU['human-score'] === DEALER['bot-score']) {
            console.log('You drew!');
        }
    } else if (YOU['human-score'] > 21 && DEALER['bot-score'] <= 21) {
        console.log('You lost!');
        winner = DEALER;
    } else if (YOU['human-score'] > 21 && DEALER['bot-score'] > 21) {
        console.log('You drew!');
    }
    console.log('Winner is', winner)
    return winner;;
}

function showResult(winner){
    if (winner === YOU){
    message = 'You won!';
    messageColor = 'cyan';
    winSound.play();
    }

    else if(winner === DEALER){
    message = 'You lost!';
    messageColor = 'red';
    lossSound.play();
    }

    else {
    message = 'You drew!';
    messageColor = 'orange';
    }

    document.querySelector('#result').textContent = message;
    document.querySelector('#result').style.color = messageColor;

    updateTable(winner);
}

function updateTable(winner){
    var score=1;
    if (winner === YOU){
        let wins = document.querySelector('#wins').textContent;
        wins++;
        document.querySelector('#wins').textContent = wins;
        
    } else if (winner === DEALER){
        let losses = document.querySelector('#losses').textContent;
        losses++;
        document.querySelector('#losses').textContent = losses;
        
    } else {
        let draws = document.querySelector('#draws').textContent;
        draws++;
        document.querySelector('#draws').textContent = draws;
    }
}