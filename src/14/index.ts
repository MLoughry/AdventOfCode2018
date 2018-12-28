import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');
    const inputNum = parseInt(input);

    const recipeScores: number[] = [3, 7];
    let elf1Index = 0, elf2Index = 1;

    while (recipeScores.length < (inputNum + 10)) {
        calculateNewScores();
    }

    const part1 = recipeScores.slice(inputNum, inputNum + 10).join('');
    let part2: number = -1;

    if ((part2 = recipeScores.join('').indexOf(input)) === -1) {
        let inputIndex = 0;
        while (part2 === -1) {
            let newScores = calculateNewScores();
            newScores.forEach((digit, i) => {
                if (input.charCodeAt(inputIndex) === (digit + 0x30)) {
                    inputIndex++;
                    if (inputIndex === input.length) {
                        part2 = recipeScores.length - input.length - (newScores.length - i - 1);
                    }
                } else {
                    inputIndex = 0;
                }
            });
        }

    }

    return {
        part1,
        part2,
    };

    function calculateNewScores() {
        const newScores = getDigits(recipeScores[elf1Index] + recipeScores[elf2Index]);
        newScores.forEach(n => recipeScores.push(n));
        elf1Index = (elf1Index + recipeScores[elf1Index] + 1) % recipeScores.length;
        elf2Index = (elf2Index + recipeScores[elf2Index] + 1) % recipeScores.length;
        return newScores;
    }

    function getDigits(n: number): number[] {
        let digits: number[] = [];
        do {
            digits.unshift(n % 10);
            n = Math.floor(n / 10);
        } while (n !== 0);
        return digits;
    }
}