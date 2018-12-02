import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';
import { stringify } from "querystring";

export default async function (): Promise<Solution> {
    let input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const part1 = input
        .split('\n')
        .reduce(
            (acc, line) => {
                let charCounts = new Map<string, number>();

                for(let char of line) {
                    charCounts.set(char, (charCounts.get(char) || 0) + 1);
                }

                let has2 = false, has3 = false;
                for (let count of charCounts.values()) {
                    switch (count) {
                        case 2: has2 = true; break;
                        case 3: has3 = true; break;
                    }
                }

                if (has2) {
                    acc[0]++;
                }
                if (has3) {
                    acc[1]++;
                }

                return acc;
            },
            [0, 0]
        )
        .reduce((acc, i) => acc * i, 1);

    return { part1 };
}