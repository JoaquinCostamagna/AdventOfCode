import fs from 'fs';

const numDictionary = {
    'one': 'o1e',
    'two': 't2o',
    'three': 't3e',
    'four': 'f4r',
    'five': 'f5e',
    'six': 's6x',
    'seven': 's7n',
    'eight': 'e8t',
    'nine': 'n9e'
}

function getNumbers(line){
    const firstNumber = line.split('').find((char) => !isNaN(char));
    const lastNumber = line.split('').findLast((char) => !isNaN(char));
    return Number([firstNumber, lastNumber].join(''));
}

function getNumbersWithSpelledNumbers(line){
    line = replaceSpelledNumbers(line);
    return getNumbers(line);
}


function replaceSpelledNumbers(line) {
    Object.keys(numDictionary).forEach((word) => {
        line = line.replaceAll(word, numDictionary[word]);
    });
    return line;
}

function partOne() {
    const lines = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

    const lineNumbers = lines.map((line) => {
        return getNumbers(line);
    });

    const result = lineNumbers.reduce((acc, curr) => {
        return acc + curr;
    });
    
    console.log('Part One: ', result);
    
}

function partTwo() {
    let lines = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');
    // const lines = ['dmhkvgbc6four6eightwofkk'];

    const lineNumbers = lines.map((line) => {
        return getNumbersWithSpelledNumbers(line);
    });

    const result = lineNumbers.reduce((acc, curr) => {
        return acc + curr;
    });

    
    console.log('Part Two: ', result);
}

partOne();
partTwo();