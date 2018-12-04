import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    return {
        // part1,
        // part2,
    };
}