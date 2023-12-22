import fs from 'fs';

function convertHandValues(hand){
    const values = hand.split('');
    return values.map((value) => {
        if (value === 'A') return 14;
        if (value === 'K') return 13;
        if (value === 'Q') return 12;
        if (value === 'J') return 11;
        if (value === 'T') return 10;
        return parseInt(value, 10);
    });
}

function convertHandValues2(hand){
    const values = hand.split('');
    return values.map((value) => {
        if (value === 'A') return 14;
        if (value === 'K') return 13;
        if (value === 'Q') return 12;
        if (value === 'J') return 1;
        if (value === 'T') return 10;
        return parseInt(value, 10);
    });
}

function getHandStength(values){
    const counts = {};
    values.forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
    });
    const pairs = [];
    const threes = [];
    const fours = [];
    const fives = [];
    Object.keys(counts).forEach((value) => {
        if (counts[value] === 2) pairs.push(value);
        if (counts[value] === 3) threes.push(value);
        if (counts[value] === 4) fours.push(value);
        if (counts[value] === 5) fives.push(value);
    });
    if (fives.length) return 6;
    if (fours.length) return 5;
    if (threes.length && pairs.length) return 4;
    if (threes.length) return 3;
    if (pairs.length === 2) return 2;
    if (pairs.length) return 1;
    return 0;
}


function getHandStength2(values){
    let handStrength = 0;
    const counts = {};
    values.forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
    });
    const repeated = [0,0,0,0];
    Object.keys(counts).forEach((value) => {
        if (value == 1 || counts[value] < 2) return;
        repeated[counts[value]-2] += 1;
    });
    const jokerCount = counts[1] ?? 0;
    if (jokerCount) {
        let usedJokers = false;
        for (let i = repeated.length - 1; i >= 0; i--){
            if (repeated[i] === 0) continue;
            repeated[i + jokerCount] += 1;
            repeated[i] -= 1;
            usedJokers = true;
            break;
        }
        if (!usedJokers){
            const indexToReplace = jokerCount < 5? jokerCount - 1 : 3;
            repeated[indexToReplace] = 1;
        }
    }

    if (repeated[3]) handStrength = 6;
    else if (repeated[2]) handStrength = 5;
    else if (repeated[1] && repeated[0]) handStrength = 4;
    else if (repeated[1]) handStrength = 3;
    else if (repeated[0] === 2) handStrength = 2;
    else if (repeated[0]) handStrength = 1;
    
    return handStrength;
}

function compareHands(hand1, hand2){
    if (hand1.handStrength > hand2.handStrength) return 1;
    if (hand1.handStrength < hand2.handStrength) return -1;
    for (let i = 0; i < hand1.values.length; i++) {
        if (hand1.values[i] > hand2.values[i]) return 1;
        if (hand1.values[i] < hand2.values[i]) return -1;
    }
    return 0;
}

function parseHand(line){
    const [hand, bid] = line.split(' ');
    const values = convertHandValues(hand);
    const handStrength = getHandStength(values);

    return {hand, values, handStrength, bid};
}

function parseHand2(line){
    const [hand, bid] = line.split(' ');
    const values = convertHandValues2(hand);
    const handStrength = getHandStength2(values);

    return {hand, values, handStrength, bid};
}

function getTotalWinnings(hands){
    let total = 0;
    hands.forEach((hand, index) => {
        total += hand.bid * (index + 1);
    });
    return total;
}

function partOne(){
    const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
    const hands = lines.map(parseHand);
    hands.sort(compareHands);
    const result = getTotalWinnings(hands);
    console.log(result);
}

function partTwo(){
    const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
    const hands = lines.map(parseHand2)
    hands.sort(compareHands);
    // console.log(hands);
    hands.forEach(hand => {console.log(hand.handStrength, hand.hand)})
    const result = getTotalWinnings(hands);
    console.log(result);
}

// partOne();
partTwo();