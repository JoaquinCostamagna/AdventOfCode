import fs from 'fs';

function splitBySpaces(line){
    return line.split(/(\s+)/).filter( e => e.trim().length > 0);
}

function arrayToNumber(array) {
    array.forEach((element, index) => {
        if (!isNaN(element)) array[index] = Number(element);
    });
}

function parseSection(section){
    const lines = section.split('\n');
    const parsedSection = [];
    lines.forEach( (line, index) => {
        if (index !== 0){
            const [from, to, value] = splitBySpaces(line);
            parsedSection.push({
                from,
                to,
                value
            });
        }
    });
    return parsedSection
}

function partOne(){
    const sections = fs.readFileSync('./example.txt', 'utf-8').split('\n\n');
    const seeds = splitBySpaces(sections.shift().split(':')[1].trim());
    console.log(seeds);
    const parsedSections = sections.map( section => (parseSection(section)));
    console.log(parsedSections);
}

partOne();