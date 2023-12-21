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

function getSeedLocation(seed, sections){
    let location = seed;
    sections.forEach( section => {
        section.every( ({source, destination, range}) => {
            const diff = location - source;
            if (diff >= 0 && diff < range){
                location = destination + diff;
                return false;
            };
            return true;
        });
    });
    // console.log(seed, location);
    return location;
}

function getMinLocationFromSeedsRanges(seeds, sections){
    let globalMin = 9999999999999;
    for (let i = 0; i < seeds.length; i+=2){
        const seedFrom = seeds[i];
        const range = seeds[i+1] - 1;
        const localMin = findMinInRange(seedFrom, range, sections);
        if (localMin < globalMin) globalMin = localMin;
        // console.log(`seedFrom: ${seedFrom}, range: ${range}, localMin: ${localMin}, min: ${globalMin}`)
    }
    return globalMin;
}

function findMinInRange(seedFrom, range, sections){
    // console.log(`seedFrom: ${seedFrom}, range: ${range}`);
    if (range === 1 ) return Math.min(
        getSeedLocation(seedFrom, sections),
        getSeedLocation(seedFrom + 1, sections),
    );


    const stepSize = Math.floor(range / 2);
    const middle = seedFrom + stepSize;

    const seedFromLocation = getSeedLocation(seedFrom, sections);
    const middleLocation = getSeedLocation(middle, sections);
    const seedToLocation = getSeedLocation(seedFrom + range, sections);

    let leftMin = 9999999999999;
    let rightMin = 9999999999999;
    
    if (seedFromLocation + stepSize !== middleLocation){
        leftMin = findMinInRange(seedFrom, stepSize, sections);
    }

    if (middleLocation + (range - stepSize) !== seedToLocation){
        rightMin = findMinInRange(middle, (range - stepSize), sections);
    }

    const localMin = Math.min(leftMin, rightMin, seedFromLocation);

    // console.log(`seedFrom: ${seedFrom}, range: ${range}, localMin: ${localMin}, min: ${Math.min(seedFromLocation, localMin)}`);
    return localMin;

}

function parseSection(section){
    const lines = section.split('\n');
    const parsedSection = [];
    lines.forEach( (line, index) => {
        if (index !== 0){
            const [destination, source, range] = arrayToNumber(splitBySpaces(line));
            parsedSection.push({
                destination,
                source,
                range
            });
        }
    });
    return parsedSection
}

function partOne(){
    const sections = fs.readFileSync('./example.txt', 'utf-8').split('\n\n');
    const seeds = arrayToNumber(splitBySpaces(sections.shift().split(':')[1].trim()));
    const parsedSections = sections.map( section => (parseSection(section)));

    const locations = seeds.map( (seed) => {
        return getSeedLocation(seed, parsedSections);
    });
    console.log(locations);

    const result = Math.min(...locations);
    console.log(result);
}

function partTwo() {
    const sections = fs.readFileSync('./input.txt', 'utf-8').split('\n\n');
    const seeds = arrayToNumber(splitBySpaces(sections.shift().split(':')[1].trim()));
    const parsedSections = sections.map( section => (parseSection(section)));
    
    const result = getMinLocationFromSeedsRanges(seeds, parsedSections);
    console.log(result);
}


// partOne();
partTwo();
