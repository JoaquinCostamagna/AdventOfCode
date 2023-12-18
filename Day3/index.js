import fs from 'fs';

const numberRegex = /\d+/g;

//regEx for anything not a dot (.) or a number
const symbolRegex = /[\/$&+,:;=?@#|'<>^*()%!-]/;

function hasASymbol(value){
    if (!value) return false;
    // if (value.includes('*')) return true;
    return symbolRegex.test(value);
}

function hasAdyacentSymbol(lines, lineNumber, number, index){
    const numberLength = number.toString().length;
    const previous = index > 0 ? lines[lineNumber][index - 1] : null;
    const next = index + numberLength < lines[lineNumber].length? lines[lineNumber][index + numberLength] : null;
    const top = lineNumber > 0 ? lines[lineNumber - 1].substring(index-1, index + numberLength + 1) : null;
    const bottom = lineNumber < lines.length - 1 ? lines[lineNumber + 1].substring(index-1, index + numberLength + 1) : null;
    
    // console.log(number, index,'previous:', previous,'next:', next,'top:', top,'bottom:', bottom);

    return hasASymbol(previous) || hasASymbol(next) || hasASymbol(top) || hasASymbol(bottom);
}

function calculateGearRatios(lines, line, lineNumber) {
    const lineRatios = [];

    line.split('').forEach((element, index) => {
        if (element !== '*') return;
        else lineRatios.push(calculateGearRatio(lines, lineNumber, index));
    });

    return lineRatios;
}   

function calculateGearRatio(lines, lineNumber, index) {
    // const top = lineNumber > 0 ? lines[lineNumber - 1].substring(index-1, index + 1) : null;
    // const bottom = lineNumber < lines.length - 1 ? lines[lineNumber + 1].substring(index-1, index + 1) : null;

    // const left = index > 0 ? lines[lineNumber][index - 1] : null;
    // const right = index + 1 < lines[lineNumber].length? lines[lineNumber][index + 1] : null;

    const top = exploreNumbers(lines, lineNumber - 1, index - 1, index + 1);
    const bottom = exploreNumbers(lines, lineNumber + 1, index - 1, index + 1);
    const left = exploreNumbers(lines, lineNumber, index - 1, index - 1);
    const right = exploreNumbers(lines, lineNumber, index + 1, index + 1);
    
    const ratios = [...top, ...bottom, ...left, ...right];
    
    if (ratios.length === 2) return ratios[0] * ratios[1];
    
    return 0;
}

function exploreNumbers(lines, lineNumber, indexFrom, indexTo) {
    const line = lines[lineNumber];
    let match;
    const lineNumbers = [];
    while ((match = numberRegex.exec(line)) != null) {
        const matchLength = match[0].length - 1;
        if (match.index > indexTo || match.index + matchLength < indexFrom ) continue;
        lineNumbers.push(parseInt(match[0]));
    }
    return lineNumbers;
}

function partOne() {
    const lines = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

    const linesNumbers = lines.map(line => {
        let match;
        const lineNumbers = [];
        while ((match = numberRegex.exec(line)) != null) {
            lineNumbers.push({
                number: parseInt(match[0]),
                index: match.index
            });
        }
        return lineNumbers;
    });

    const linesNumbersWithAdyacentSymbol = linesNumbers.map((lineNumbers, lineNumber) => {
        return lineNumbers.filter(({number, index}) => hasAdyacentSymbol(lines, lineNumber, number, index))
            .map(({number}) => number)
    }).flat();

    const result = linesNumbersWithAdyacentSymbol.reduce((acc, number) => acc + number, 0);

    // console.log(linesNumbersWithAdyacentSymbol);
    console.log(result);
}

function partTwo() {
    const lines = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');
    
    const ratios = lines.map((line, lineNumber) => {
        return calculateGearRatios(lines, line, lineNumber);
    }).flat();

    console.log(ratios);

    const result = ratios.reduce((acc, number) => acc + number, 0);

    console.log(result);
}

// partOne();
partTwo();