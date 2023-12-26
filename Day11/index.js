import fs from 'fs';

function showMap(map) {
    console.log(map.map(line => line.join('')).join('\n'));
}

function calculateDistance(star1, star2) {
    return Math.abs(star1.x - star2.x) + Math.abs(star1.y - star2.y);
}

function expandUniverse(map) {
    const newMap = [];
    // Adds aditional lines
    map.forEach(line => {
        if (line.indexOf('#') === -1) newMap.push([...line]);
        newMap.push([...line]);
    })

    // Adds aditional columns
    let j = 0;
    while (j < newMap[0].length) {
        const column = newMap.map(line => line[j]);
        if (column.indexOf('#') === -1) {
            newMap.forEach(line => line.splice(j, 0, '.'));
            j++;
        }
        j++;
    }

    return newMap;
}

function findStars(map) {
    const stars = [];
    for (let i = 0; i < map.length; i++) {
        const line = map[i];
        for (let j = 0; j < line.length; j++) {
            const cell = line[j];
            if (cell === '#') {
                stars.push({id: stars.length, x: j, y: i});
            }
        }
    }
    return stars;
}

function calculateMinStarDistance(map, stars) {
    let minDistance = 0;
    const queue = [...stars];
    const visited = [];
    const distances = [];
    let currentStar = queue.shift();
    
}

function partOne() {
    const lines = fs.readFileSync('./input.txt', 'utf-8').split('\n');
    const map = lines.map(line => line.split(''));

    const expandedMap = expandUniverse(map);
    // showMap(expandedMap)

    const stars = findStars(expandedMap);
    console.log(stars.length);
    const minDistance = calculateMinStarDistance(expandedMap, stars);
}

partOne();