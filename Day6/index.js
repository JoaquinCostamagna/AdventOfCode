import fs from 'fs';

function splitBySpaces(line){
    return line.split(/(\s+)/).filter( e => e.trim().length > 0);
}

function arrayToNumber(array) {
    array.forEach((element, index) => {
        if (!isNaN(element)) array[index] = Number(element);
    });
    return array;
}

function getAllWinningStarts(times, distances){
    const winningStarts = [];
    for (let i = 0; i < times.length; i++){
        const time = times[i];
        const distance = distances[i];
        const winningStart = getWinningStarts(time, distance);
        winningStarts.push(winningStart);
    }
    return winningStarts;
}

function getWinningStarts(time, distance){
    if (distance < ((time ** 2) / 4) - 1){
        const altRange = ((time ** 2) - 4 * distance - 4) ** 0.5;
        const rangeFrom = ((altRange * -1) + time) / 2;
        const rangeTo = ((altRange * 1) + time) / 2;
        const rangeFromInt = Math.ceil(rangeFrom);
        const rangeToInt = Math.floor(rangeTo);
        const range = rangeToInt - rangeFromInt + 1;
        // console.log(rangeFromInt, rangeToInt, range);
        // console.log(rangeFrom, rangeTo);
        return range
    }
    else {
        console.log('no winning starts');
        return 0;
    }
}

function getConcatedNumber(array){
    let result = '';
    array.forEach( (element, index) => {
        result += element.toString();
    });
    return Number(result);
}

function partOne() {
    const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');
    const times = arrayToNumber(splitBySpaces(input[0].split(':')[1].trim()));
    const distances = arrayToNumber(splitBySpaces(input[1].split(':')[1].trim()))
    
    const winningStarts = getAllWinningStarts(times, distances);
    const result = winningStarts.reduce((acc, val) => acc * val, 1);
    console.log(result);
}

function partTwo() {
    const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');
    const times = arrayToNumber(splitBySpaces(input[0].split(':')[1].trim()));
    const distances = arrayToNumber(splitBySpaces(input[1].split(':')[1].trim()));
    
    const concatedTimes = getConcatedNumber(times);
    const concatedDistances = getConcatedNumber(distances);

    const result = getWinningStarts(concatedTimes, concatedDistances);
    console.log(result);
}

// partOne();
partTwo();