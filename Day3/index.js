import fs from 'fs';

const numberRegex = /\d+/g;

//regEx for anything not a dot (.) or a number
const symbolRegex = /[^.\d]/g;

function hasASymbol(value){
    return symbolRegex.test(value);
}

function hasAdyacentSymbol(lines, lineNumber, number, index){
    const previous = lines[lineNumber][index - 1];
    const next = lines[lineNumber][index + number.length];
    const top = lineNumber > 0 ? lines[lineNumber - 1].substring(index-1, index + number.length) : null;
    const bottom = lineNumber < lines.length - 1 ? lines[lineNumber + 1].substring(index-1, index + number.length) : null;
    
    console.log(number, index,'previous:', previous,'next:', next,'top:', top,'bottom:', bottom);

    return hasASymbol(previous) || hasASymbol(next) || hasASymbol(top) || hasASymbol(bottom);
}

function partOne() {
    const lines = fs.readFileSync('./example.txt', 'utf8').trim().split('\n');

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
        return lineNumbers.filter(({number, index}) => hasAdyacentSymbol(lines, lineNumber, number, index));
    });

    lines
}

partOne();