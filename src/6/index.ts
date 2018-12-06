import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

interface Point {
    x: number;
    y: number;
}

interface Rect {
    x: [number, number];
    y: [number, number];
}

interface LinearEquation {
    slope: number;
    offset: number;
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const points: Point[] = input
        .split('\n')
        .map(line => {
            const [x, y] = line.split(', ').map(i => parseInt(i))
            return {x, y};
        });

    const bounds: Rect = points
        .reduce<Rect>(({x, y}, {x: px, y: py}) => {
            return {
                x: [
                    Math.min(px, x[0]),
                    Math.max(px, x[1]),
                ],
                y: [
                    Math.min(py, y[0]),
                    Math.max(py, y[1]),
                ],
            }
        }, {x: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER ], y: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]});

    return {
        // part1,
        // part2,
    };
}

function findSlopeBetweenPoints(a: Point, b: Point) {

}