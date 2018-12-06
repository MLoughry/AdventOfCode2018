import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    const part1 = collapsePolymer(input);

    let part2 = input.length;
    for(const l of alphabet) {
        part2 = Math.min(
            part2,
            collapsePolymer(input.replace(new RegExp(`[${l}${l.toUpperCase()}]`, 'g'), ''))
        );
    }

    return {
        part1,
        part2,
    };

    function collapsePolymer(polymer: string) {
        const resultingPolymer: string[] = [];

        for (const unit of polymer) {
            // A letter XOR'd with its uppercase letter is 32.
            if (resultingPolymer.length
                && (unit.charCodeAt(0) ^ resultingPolymer[resultingPolymer.length - 1].charCodeAt(0)) === 32) {
                    resultingPolymer.pop();
            } else {
                resultingPolymer.push(unit);
            }
        }

        return resultingPolymer.length;
    }
}
