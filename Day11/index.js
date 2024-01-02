import fs from 'fs';

function showMap(map) {
    console.log(map.map(line => line.join('')).join('\n'));
}

function calculateDistance(star1, star2, map, emptyDistance) {
    let distance = Math.abs(star1.x - star2.x) + Math.abs(star1.y - star2.y);
    if (!map) return distance;


    const x = [star1.x, star2.x].sort((a, b) => a - b);
    const y = [star1.y, star2.y].sort((a, b) => a - b);

    for (let i = y[0]; i <= y[1]; i++) {
        if (map[i][x[0]] === '*'){
            distance += emptyDistance - 2;
        }
    }

    for (let j = x[0]; j <= x[1]; j++) {
        if (map[y[0]][j] === '*'){
            distance += emptyDistance - 2;
        }
    }

    return distance;
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

function expandUniverse2(map) {
    const newMap = [];
    // Adds aditional lines
    map.forEach(line => {
        if (line.indexOf('#') === -1) newMap.push([...'*'.repeat(line.length)]);
        newMap.push([...line]);
    })

    // Adds aditional columns
    let j = 0;
    while (j < newMap[0].length) {
        const column = newMap.map(line => line[j]);
        if (column.indexOf('#') === -1) {
            newMap.forEach(line => line.splice(j, 0, '*'));
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

function findDistance(stars, map ) {
    let distance = 0;
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            distance += calculateDistance(stars[i], stars[j], map, 1000000);
        }
    }
    return distance;
}

function partOne() {
    const lines = fs.readFileSync('./input.txt', 'utf-8').split('\n');
    const map = lines.map(line => line.split(''));

    const expandedMap = expandUniverse(map);
    showMap(expandedMap)
    // console.log(expandedMap);

    const stars = findStars(expandedMap);
    console.log(stars.length);

    const minDistance = findDistance(stars);
    console.log(minDistance);
}

function partTwo(){
    const lines = fs.readFileSync('./input.txt', 'utf-8').split('\n');
    const map = lines.map(line => line.split(''));

    const expandedMap = expandUniverse2(map);
    showMap(expandedMap);
    
    const stars = findStars(expandedMap);
    console.log(stars);
    console.log(calculateDistance(stars[0], stars[1], expandedMap, 10));

    const minDistance = findDistance(stars, expandedMap);
    console.log(minDistance);
}

// partOne();
partTwo();