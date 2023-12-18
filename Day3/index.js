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

partOne();