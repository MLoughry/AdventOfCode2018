import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

type Acre = '.' | '#' | '|';

interface AcreCount {
    '#': number;
    '.': number;
    '|': number;
}

type Landscape = Acre[][];

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const initialLandscape = input.split('\n').map(l => l.split('')) as Landscape;

    let { resourceCount: part1} = getResourceValueAfterXMinutes(10, initialLandscape);
    let { resourceCount: part2 } = getResourceValueAfterXMinutes(1000000000, initialLandscape);

    return {
        part1,
        part2,
    };
}

function getResourceValueAfterXMinutes(minutes: number, currentLandscape: Acre[][]) {
    const seenStates = new Map<string, number>();
    for (let i = 0; i < minutes; i++) {
        currentLandscape = iterateLandscape(currentLandscape);
        const landscapeKey = currentLandscape.map(l => l.join('')).join('');
        if (seenStates.has(landscapeKey)) {
            let period = i - seenStates.get(landscapeKey)!;
            i += Math.floor((minutes - i) / period) * period;
        } else {
            seenStates.set(landscapeKey, i);
        }
    }
    const totalCount: AcreCount = currentLandscape
        .reduce<AcreCount>((acc, row) => {
            return row.reduce<AcreCount>((acc, acre) => {
                (acc[acre])++;
                return acc;
            }, acc);
        }, { '#': 0, '.': 0, '|': 0 });
    const resourceCount = totalCount['#'] * totalCount['|'];
    return { resourceCount, currentLandscape };
}

function iterateLandscape(initial: Landscape): Landscape {
    return initial
        .map((row, y) =>
            row.map((cell, x) => {
                const surrounding = countSurroundings(initial, x, y);
                switch (cell) {
                    case '.':
                        return surrounding['|'] >= 3 ? '|' : '.';
                    case '|':
                        return surrounding['#'] >= 3 ? '#' : '|';
                    case '#':
                        return (surrounding['#'] >= 1 && surrounding['|'] >= 1) ? '#' : '.';
                }
            })
        );
}

function countSurroundings(landscape: Landscape, x: number, y: number): AcreCount {
    const count = {
        '.': 0,
        '|': 0,
        '#': 0.
    };

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if ((i !== x || j !== y)
                && landscape[j]
                && landscape[j][i]) {
                count[landscape[j][i]]++;
            }
        }
    }

    return count;
}