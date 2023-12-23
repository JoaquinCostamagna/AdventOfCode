import fs from 'fs';

function splitBySpaces(line){
    return line.split(/(\s+)/).filter( e => e.trim().length > 0);
}

function parseMap(map){
    const object = {}
    const lines = map.split('\n');
    const regex = /[A-Z1-9]{3}/g;

    lines.forEach((line) => {
        const words = line.match(regex);
        object[words[0]] = {left: words[1], right: words[2]};
    });
    return object
}

function findSteps(instructions, mapObject){
    let steps = 0;
    let current = 'AAA';

    while (current !== 'ZZZ'){
        const instruction = instructions[steps % instructions.length];
        current = instruction === 'L' ? mapObject[current].left : mapObject[current].right;
        steps++;
    }

    return steps;
}

function leastCommonMultiple(...arr){
    const gcd = (x, y) => (!y ? x : gcd(y, x % y));
    const _lcm = (x, y) => (x * y) / gcd(x, y);
    return [...arr].reduce((a, b) => _lcm(a, b));
}; 

function findSteps2(instructions, mapObject){
    let steps = 0;
    const currents = [];
    // console.log(instructions.length);

    Object.keys(mapObject).forEach((key) => {
        if (key[2] === 'A') currents.push(key);
    });

    const solutions = [];

    for (let i = 0; i < currents.length; i++){
        solutions[i] = [];
    }

    // console.log(currents);

    while (currents.some(element => element[2] !== 'Z') && solutions.some(element => element.length < 2)){
        const instruction = instructions[steps % instructions.length];
        currents.forEach((element, index) => {
            currents[index] = instruction === 'L' ? mapObject[element].left : mapObject[element].right;
            if (currents[index][2] === 'Z') solutions[index].push(steps);
        });
        steps++;
    }

    // console.log(solutions);

    const jumps = solutions.map(element => {
        const jumps = [];
        for (let i = 0; i < element.length - 1; i++){
            jumps.push(element[i + 1] - element[i]);
        }
        return jumps;
    });

    // console.log(jumps);

    const lcm = leastCommonMultiple(...jumps.map(row => (row[0])));

    return lcm;
}

function partOne() {
    const [instructions, map] = fs.readFileSync('./input.txt', 'utf8').trim().split('\n\n');
    const mapObject = parseMap(map);

    const steps = findSteps(instructions, mapObject);

    console.log(steps);
}

function partTwo() {
    const [instructions, map] = fs.readFileSync('./example3.txt', 'utf8').trim().split('\n\n');
    const mapObject = parseMap(map);

    const steps = findSteps2(instructions, mapObject);

    console.log(steps);
}

// partOne();
partTwo();


// console.log('lcm: ', leastCommonMultiple(21883, 19667, 14681, 16897, 13019, 11911));