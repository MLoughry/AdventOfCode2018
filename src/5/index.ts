import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const annihilationRegex = new RegExp(
        alphabet
            .split('')
            .map(l => `${l}${l.toUpperCase()}|${l.toUpperCase()}${l}`)
            .join('|'),
            'g'
    );

    const part1 = collapsePolymer(input);

    let part2 = part1;
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

    function collapsePolymer(collapsedString: string) {
        for (let lastLength = 0; collapsedString.length !== lastLength; collapsedString = collapsedString.replace(annihilationRegex, '')) {
            lastLength = collapsedString.length;
        }
        return collapsedString.length;
    }
}
