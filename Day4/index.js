import fs from 'fs';

function parseCard(line){
    const [cardInfo, cardNummbersAll] = line.split(':');
    const cardNumber = cardInfo.split(' ')[1];
    const [winnerNumbers, cardNumbers] = cardNummbersAll.split('|');

    return { cardNumber, winnerNumbers: winnerNumbers.trim(), cardNumbers: cardNumbers.trim() }
}

function partOne() {
    const lines = fs.readFileSync('./example.txt', 'utf-8').trim().split('\n');

    const cards = lines.map(line => parseCard(line));
    console.log(cards);
};

partOne();