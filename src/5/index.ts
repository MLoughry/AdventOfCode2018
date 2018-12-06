import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    const { size: part1, resultingPolymer: resultingPolymerArray } = collapsePolymer(input);
    let resultingPolymer = resultingPolymerArray.join('');

    let part2 = resultingPolymer.length;
    for(const l of alphabet) {
        part2 = Math.min(
            part2,
            collapsePolymer(resultingPolymer.replace(new RegExp(`${l}`, 'gi'), '')).size
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

        return {
            size: resultingPolymer.length,
            resultingPolymer
        };
    }
}
