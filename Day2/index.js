import fs from 'fs';


const startingValues = {
    red: 12,
    green: 13,
    blue: 14
}

function parseLine(line) {
    const [game, score] = line.split(':');
    const gameIndex = game.split(' ')[1];
    const scores = score.replaceAll(';', ',').split(',').map((score) => score.trim().split(' '));
    return {
        index: gameIndex,
        scores: scores
    }
}

function isGameValid(game) {
    const scores = game.scores;
    let valid = true;
    scores.forEach((score) => {
        const number = score[0];
        const color = score[1];
        if (number > startingValues[color]) {
            valid = false;
            
        }
    });
    return valid;
}

function getNumberOfColoredCubes(scores, color) {
    let value = 0;
    scores.forEach((score) => {
        if (score[1] === color && Number(score[0]) > value) {
            value = Number(score[0]);
        }
    });
    return value;
}

function getPowerOfGame(game) {
    const scores = game.scores;
    const red = getNumberOfColoredCubes(scores, 'red');
    const green = getNumberOfColoredCubes(scores, 'green');
    const blue = getNumberOfColoredCubes(scores, 'blue');

    return red * green * blue;
}

function partOne() {
    const lines = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');
    const games = lines.map((line) => parseLine(line));

    const validGames = games.filter((game) => isGameValid(game));

    console.log(validGames.map((game) => game.index));

    const result = validGames.reduce((acc, curr) => {
        return acc + Number(curr.index);
    }, 0);

    console.log(result);
}

function partTwo(){
    const lines = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

    const games = lines.map((line) => parseLine(line));

    const powers = games.map((game) => getPowerOfGame(game));

    const result = powers.reduce((acc, curr) => {
        return acc + curr;
    }, 0);

    console.log(powers);
    console.log(result);

}

// partOne();
partTwo();