import fs from 'fs';

function arrayToNumber(array) {
    array.forEach((element, index) => {
        if (!isNaN(element)) array[index] = Number(element);
    });
    return array;
}

function getIncrements(secuence) {
    const increments = [];
    for (let i = 0; i < secuence.length - 1; i++) {
        increments.push(secuence[i + 1] - secuence[i]);
    }
    return increments;
}

function predictNextValue(secuence, nextSecuence) {
    const lastValue = nextSecuence[nextSecuence.length - 1];
    const lastIncrement = secuence[secuence.length - 1];
    return lastValue + lastIncrement;
}

function predictNextValueBackwards(secuence, nextSecuence) {
    const firstValue = nextSecuence[0];
    const firstIncrement = secuence[0];
    return firstValue - firstIncrement;
}

function getLinePrediction(line) {

    const secuences = [arrayToNumber(line.split(' '))];

    while (secuences[secuences.length - 1].some(value => value !== 0)){
        const lastSecuence = secuences[secuences.length - 1];
        const nextSecuence = getIncrements(lastSecuence);
        secuences.push(nextSecuence);
    }

    for (let i = secuences.length - 1; i > 0; i--) {
        const secuence = secuences[i];
        const nextSecuence = secuences[i - 1];
        const predictionValue = predictNextValue(secuence, nextSecuence);
        nextSecuence.push(predictionValue);
    }

    return secuences[0].pop();

}

function getLineBackwardsPrediction(line) {

    const secuences = [arrayToNumber(line.split(' '))];

    while (secuences[secuences.length - 1].some(value => value !== 0)){
        const lastSecuence = secuences[secuences.length - 1];
        const nextSecuence = getIncrements(lastSecuence);
        secuences.push(nextSecuence);
    }

    for (let i = secuences.length - 1; i > 0; i--) {
        const secuence = secuences[i];
        const nextSecuence = secuences[i - 1];
        const predictionValue = predictNextValueBackwards(secuence, nextSecuence);
        nextSecuence.unshift(predictionValue);
    }

    return secuences[0].shift();

}

function partOne() {
    const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');

    const predictions = lines.map(getLinePrediction);

    console.log(predictions);

    const result = predictions.reduce((acc, value) => acc + value, 0);

    console.log(result);
}

function partTwo() {
    const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');

    const predictions = lines.map(getLineBackwardsPrediction);

    console.log(predictions);

    const result = predictions.reduce((acc, value) => acc + value, 0);

    console.log(result);
}

// partOne();
partTwo();