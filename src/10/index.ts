import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

interface Point {
    x: number;
    y: number;
}

class Dot {
    constructor(private x0: number, private y0: number, private vx: number, private vy: number) { }

    getPositionAtTime(t: number): Point {
        return {
            x: this.x0 + t * this.vx,
            y: this.y0 + t * this.vy
        };
    }
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const parsingRegex = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;

    const points: Dot[] = input
        .split('\n')
        .map(line => {
            const [, x0, y0, vx, vy] = parsingRegex.exec(line)!.map(i => parseInt(i));
            return new Dot(x0, y0, vx, vy);
        });

    let t = 0;
    let part1 = '';
    while (true) {
        const currentPositions: Point[] = [];
        let maxX = Number.MIN_SAFE_INTEGER, minX = Number.MAX_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER;

        for (let dot of points) {
            const newPoint = dot.getPositionAtTime(t);
            maxX = Math.max(maxX, newPoint.x);
            minX = Math.min(minX, newPoint.x);
            maxY = Math.max(maxY, newPoint.y);
            minY = Math.min(minY, newPoint.y);

            if (maxY - minY > 12) {
                break;
            }

            currentPositions.push(newPoint);
        }

        if (maxY - minY > 12) {
            t++;
            continue;
        } else {
            const xSize = maxX - minX + 1, ySize = maxY - minY + 1;
            const grid: string[][] = new Array<string[]>(ySize).fill([]).map(i => new Array<string>(xSize).fill('.'));

            for (let {x, y} of currentPositions) {
                grid[y - minY][x - minX] = '#';
            }

            part1 = '\n' + grid.map(l => l.join('')).join('\n');
            break;
        }
    }


    return {
        part1,
        part2: t,
    };
}