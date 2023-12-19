import fs from 'fs';
import { get } from 'http';

function splitBySpaces(line){
    return line.split(/(\s+)/).filter( e => e.trim().length > 0);
}

function parseCard(line){
    const [cardInfo, cardNummbersAll] = line.split(':');
    const cardNumber = Number(splitBySpaces(cardInfo)[1]);
    const [winnerNumbers, cardNumbers] = cardNummbersAll.split('|');

    return { cardNumber, winnerNumbers: splitBySpaces(winnerNumbers), cardNumbers: splitBySpaces(cardNumbers)}
}

function getCardPoints(card){
    const repetitions = getCardRepetitions(card);
    if (repetitions === 0) return 0;
    return 2 ** (repetitions - 1);
}

function getCardRepetitions(card){
    return card.cardNumbers.filter(number => number && card.winnerNumbers.includes(number)).length;
}

function partOne() {
    const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
    
    const cards = lines.map(line => parseCard(line));
    // console.log(cards);
    const cardPoints = cards.map(card => getCardPoints(card));

    const result = cardPoints.reduce((acc, curr) => acc + curr, 0);
    console.log(cardPoints);
    console.log(result);

};

function partTwo() {
    const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
    
    const cards = lines.map(line => ({ copies: 1, ...parseCard(line)}));

    cards.forEach((card, index) => {
        const repetitions = getCardRepetitions(card);
        if (!repetitions) return;
        for (let i = 1; i < repetitions + 1; i++) {
            cards[index + i].copies += card.copies;
        }
    });

    console.log(cards.map(card => `Card ${card.cardNumber}: ${card.copies}`));

    const result = cards.reduce((acc, curr) => acc + curr.copies, 0);

    console.log(result);
}

// partOne();
partTwo();

// console.log(splitBySpaces('Card   4'));