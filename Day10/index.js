import fs from 'fs';

function parseLine(line, lineNumber) {
    const symbols = line.split('');
    symbols.forEach((symbol, index) => {
        switch (symbol) {
            case '|':
                symbols[index] = {symbol: '|', in: [lineNumber - 1, index], out: [lineNumber + 1, index]};
                break;
            case '-':
                symbols[index] = {symbol: '-', in: [lineNumber, index - 1], out: [lineNumber, index + 1]};
                break;
            case 'L':
                symbols[index] = {symbol: 'L', in: [lineNumber - 1, index], out: [lineNumber, index + 1]};
                break;
            case 'J':
                symbols[index] = {symbol: 'J', in: [lineNumber - 1, index], out: [lineNumber, index - 1]};
                break;
            case '7':
                symbols[index] = {symbol: '7', in: [lineNumber + 1, index], out: [lineNumber, index - 1]};
                break;
            case 'F':
                symbols[index] = {symbol: 'F', in: [lineNumber + 1, index], out: [lineNumber, index + 1]};
                break;
            case '.':
                symbols[index] = {symbol: '.', in: null, out: null};
                break;
            case 'S':
                symbols[index] = {symbol: 'S', in: null, out: null, distance: 0};
                break;
            default:
                throw new Error(`Unknown symbol ${symbol} at line ${index}`);
        }
    });
    return symbols;
}

function findInitialPosition(map) {
    const initialPosition = [];
    for (let i = 0; i < map.length; i++) {
        const line = map[i];
        for (let j = 0; j < line.length; j++) {
            const symbol = line[j];
            if (symbol.symbol === 'S') {
                initialPosition[0] = i;
                initialPosition[1] = j;
            }
        }
    }
    return initialPosition
}

function replaceInitialPositionSymbol(map, initialPosition) {

    const topSymbols = ['|', '7', 'F'];    
    const bottomSymbols = ['|', 'J', 'L'];
    const leftSymbols = ['-', 'F', 'L'];
    const rightSymbols = ['-', '7', 'J'];
    
    const top = initialPosition[0] > 0 ? map[initialPosition[0] - 1][initialPosition[1]] : null;
    const bottom = initialPosition[0] < map.length - 1 ? map[initialPosition[0] + 1][initialPosition[1]]: null;
    const left = initialPosition[1] > 0 ? map[initialPosition[0]][initialPosition[1] - 1]: null;
    const right = initialPosition[1] < map[0].length - 1 ? map[initialPosition[0]][initialPosition[1] + 1]: null;

    if (topSymbols.includes(top?.symbol) && bottomSymbols.includes(bottom?.symbol))
        map[initialPosition[0]][initialPosition[1]].symbol = '|';
    else if (leftSymbols.includes(left?.symbol) && rightSymbols.includes(right?.symbol))
        map[initialPosition[0]][initialPosition[1]].symbol = '-';
    else if (topSymbols.includes(top?.symbol) && rightSymbols.includes(right?.symbol))
        map[initialPosition[0]][initialPosition[1]].symbol = 'L';
    else if (topSymbols.includes(top?.symbol) && leftSymbols.includes(left?.symbol))
        map[initialPosition[0]][initialPosition[1]].symbol = 'J';
    else if (bottomSymbols.includes(bottom?.symbol) && rightSymbols.includes(right?.symbol))
        map[initialPosition[0]][initialPosition[1]].symbol = 'F';
    else if (bottomSymbols.includes(bottom?.symbol) && leftSymbols.includes(left?.symbol))
        map[initialPosition[0]][initialPosition[1]].symbol = '7';
    else
        throw new Error(`Unknown initial position ${initialPosition}`);
}

function findConectedNodes(map, startingPosition) {
    const connectingNodes = [];

    for (let i = startingPosition[0] -1; i < startingPosition[0] + 2; i++) {
        for (let j = startingPosition[1] -1; j < startingPosition[1] + 2; j++) {
            if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) continue;
            if (!map[i][j]?.in) continue;
            if (map[i][j].in?.toString() === startingPosition.toString()){
                connectingNodes.push({node: map[i][j], position: [i, j], direction: 'in'})
            };
            if (map[i][j].out?.toString() === startingPosition.toString()){
                connectingNodes.push({node: map[i][j], position: [i, j], direction: 'out'})
            };
        }
    }

    return connectingNodes;
}

function findNextNode(map, currentNode) {
    const nextNode = {node: null, position: null, direction: null};

    if (currentNode.direction === 'in') {
        nextNode.position = currentNode.node.out;
        nextNode.node = map[currentNode.node.out[0]][currentNode.node.out[1]];
    } else {
        nextNode.position = currentNode.node.in;
        nextNode.node = map[currentNode.node.in[0]][currentNode.node.in[1]];
    }

    nextNode.direction = nextNode.node.in?.toString() === currentNode.position.toString() ? 'in' : 'out';

    return nextNode;
}

function discoverMap(map, node) {
    let distance = 1;
    let currentNode = node;

    while (currentNode.node.distance !== 0) {
        currentNode.node.distance = currentNode.node.distance? Math.min(currentNode.node.distance, distance) : distance;
        distance++;
        const nextNode = findNextNode(map, currentNode);
        currentNode = nextNode;
    }
}

function getDistances(map) {
    const initialPosition = findInitialPosition(map);
    map[initialPosition[0]][initialPosition[1]].distance = 0;

    replaceInitialPositionSymbol(map, initialPosition);
    const connectingNodes = findConectedNodes(map, initialPosition);
    
    connectingNodes.forEach((node) => {
        discoverMap(map, node)
    });
}

function showMap(map) {
    map.forEach((line) => {
        console.log(line.map((symbol) => !isNaN(symbol.distance)? symbol.distance : '.').join(''));
    })
}

function showNormalMap(map) {
    map.forEach((line) => {
        console.log(line.map((symbol) => symbol.symbol).join(''));
    })
}

function showMapInnerOuterTiles(map) {
    map.forEach((line) => {
        console.log(line.map((symbol) => !isNaN(symbol.distance)? symbol.symbol : symbol.isIn).join(''));
    })
}

function countInnerTiles(map) {
    let innerTiles = 0;
    let isInState = false;
    let goesUp = false;
    let goesDown = false;
    for (let i = 0; i < map.length; i++) {
        const line = map[i];
        for (let j = 0; j < line.length; j++) {
            const symbol = line[j];
            if (isNaN(symbol.distance)) {
                if (isInState) {
                    symbol.isIn = 'I';
                    innerTiles++;
                } else {
                    symbol.isIn = 'O';
                }
            }
            else {
                switch (symbol.symbol) {
                    case '|':
                        isInState = !isInState;
                        goesUp = false;
                        goesDown = false;
                        break;
                    case 'F':
                        isInState = !isInState;
                        goesUp = true;
                        goesDown = false;
                        break;
                    case 'L':
                        isInState = !isInState;
                        goesUp = false;
                        goesDown = true;
                        break;
                    case '7':
                        isInState = goesUp? !isInState : isInState;
                        goesUp = false;
                        goesDown = false;
                        break;
                    case 'J':
                        isInState = goesDown? !isInState : isInState;
                        goesUp = false;
                        goesDown = false;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    return innerTiles;
}

function partOne() {
    const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

    const map = input.map((line, lineNumber) => parseLine(line, lineNumber));

    getDistances(map);

    showMap(map);

    const maxDistance = Math.max(...map.map((line) => Math.max(...line.map((symbol) => symbol.distance? symbol.distance : 0))));
    console.log(maxDistance);
}

function partTwo() {

    const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

    const map = input.map((line, lineNumber) => parseLine(line, lineNumber));

    getDistances(map);

    const innerTiles = countInnerTiles(map);  

    showMapInnerOuterTiles(map);
    console.log(innerTiles);
}

// partOne();

partTwo();