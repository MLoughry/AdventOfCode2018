import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

export default async function(): Promise<Solution> {
    let input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const seenFrequencies = new Set<number>([0]);

    const inputNumbers = input
    .split('\n')
    .map(i => parseInt(i, 10));

    const part1 = inputNumbers
        .reduce((acc, i) => acc + i, 0);
            // const frequency = acc + i;

            // if (part2 === Number.MAX_VALUE && seenFrequencies.has(frequency)) {
            //     part2 = frequency;
            // }

            // seenFrequencies.add(frequency);

            // return frequency;

    let part2 = 0;
    for (let i = 0; ; i = (i + 1) % inputNumbers.length) {
        part2 += inputNumbers[i];
        if (seenFrequencies.has(part2)) {
            break;
        }
        seenFrequencies.add(part2);
    }


    return {part1, part2};
}