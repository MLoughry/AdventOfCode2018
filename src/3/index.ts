import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

interface Claim {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');
    const claims: Claim[] = input
        .split('\n')
        .map(line => {
            const [id, x, y, width, height] =
                /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(line)!
                    .slice(1)
                    .map(i => parseInt(i, 10));

            return { id, x, y, width, height };
        });

    const cloth: number[][] = new Array<any>(1000)
        .fill(null)
        .map(i => new Array<number>(1000).fill(0));

    for (const {x, y, width, height} of claims) {
        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                cloth[i][j]++;
            }
        }
    }

    const part1: number = cloth
        .reduce((total, row) => total + row.reduce((sum, count) => count > 1 ? sum + 1 : sum, 0), 0);

    const {id: part2} = claims
        .find(({x, y, width, height}) => {
            for (let i = x; i < x + width; i++) {
                for (let j = y; j < y + height; j++) {
                    if (cloth[i][j] > 1) {
                        return false;
                    }
                }
            }

            return true;
        })!;

    return {part1, part2};
}