import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

type PotRules = (1 | 0)[];

class PotRow {
    private pots: (1 | 0)[];
    private potOffset: number;

    constructor(initialState: (1 | 0)[], private rules: PotRules) {
        this.pots = initialState;
        this.potOffset = 0;

        this.bufferPotRow();
    }

    iterateGeneration() {
        this.pots = this.pots.map((val, idx) => this.getResultForPotIndex(idx));

        this.bufferPotRow();
    }

    getPlantSum() {
        return this.pots.reduce((sum: number, pot, idx) => {
            return pot ?
                sum + (idx + this.potOffset)
                : sum
        }, 0)
    }

    private bufferPotRow() {
        const firstPlantIndex = this.pots.findIndex(value => !!value);
        if (firstPlantIndex < 4) {
            const additionalOffset = firstPlantIndex - 4;
            this.potOffset += additionalOffset;
            for (let i = 0; i < -additionalOffset; i++) {
                this.pots.unshift(0);
            }
        }

        const lastPlantIndex = this.pots.length - this.pots.slice().reverse().findIndex(v => !!v) - 1;
        if (lastPlantIndex > this.pots.length - 5) {
            for (let i = 0; i < (lastPlantIndex - (this.pots.length - 5)); i++) {
                this.pots.push(0);
            }
        }
    }

    private getResultForPotIndex(idx: number): 1 | 0 {
        let ruleIndex = 0;
        for (let i = idx - 2; i <= idx + 2; i++) {
            ruleIndex *= 2;
            ruleIndex += (this.pots[i] || 0);
        }

        return this.rules[ruleIndex];
    }
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const initialStateRegex = /initial state: ([#\.]+)/;
    const ruleRegex = /([#\.]{5}) => ([\.#])/;

    const lines = input.split('\n');

    const initialState: (1 | 0)[] = initialStateRegex.exec(lines[0])![1].split('').map(char => char === '#' ? 1 : 0);
    const rules: PotRules = [];

    lines.slice(2).forEach(line => {
        const [, input, result] = ruleRegex.exec(line)!;

        let ruleIndex = 0;
        for (let pot of input) {
            ruleIndex *= 2;
            ruleIndex += pot === '#' ? 1 : 0;
        }

        rules[ruleIndex] = result === '#' ? 1 : 0;
    });

    const row = new PotRow(initialState, rules);

    for (let i = 0; i < 20; i++) {
        row.iterateGeneration();
    }

    const part1 = row.getPlantSum();

    // Let's hope that it's linear by 500/1000 iterations

    for (let i = 20; i < 500; i++) {
        row.iterateGeneration();
    }

    const count500 = row.getPlantSum();
    
    for (let i = 0; i < 500; i++) {
        row.iterateGeneration();
    }

    const count1000 = row.getPlantSum();

    const a = (count1000 - count500) / 500;
    const b = count500 - (a * 500);
    const part2 = a * (5e10) + b;

    return {
        part1,
        part2,
    };
}