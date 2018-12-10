import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const [,playerCount, marbleCount] = /(\d+) players; last marble is worth (\d+) points/.exec(input)!.map(i => parseInt(i));
    // const [playerCount, marbleCount] = [9, 25];

    const part1 = calculateHighestScore(playerCount, marbleCount);
    const part2 = calculateHighestScore(playerCount, marbleCount * 100);

    return {
        part1,
        part2,
    };
}

interface Marble {
    value: number;
    next: Marble;
    previous: Marble;
}

class MarbleCircle {
    private currentMarble: Marble;

    constructor() {
        const firstMarble: any = { value: 0 };
        firstMarble.next = firstMarble;
        firstMarble.previous = firstMarble;

        this.currentMarble = firstMarble;
    }

    addMarble(n: number): number {
        if ((n % 23) !== 0) {
            this.currentMarble = this.currentMarble.next;
            const newMarble: Marble = {
                value: n,
                previous: this.currentMarble,
                next: this.currentMarble.next,
            };
            newMarble.next.previous = newMarble;
            newMarble.previous.next = newMarble;
            this.currentMarble = newMarble;
            return 0;
        } else {
            for (let i = 0; i < 7; i++) {
                this.currentMarble = this.currentMarble.previous;
            }
            const score = n  + this.currentMarble.value;
            this.currentMarble.previous.next = this.currentMarble.next;
            this.currentMarble.next.previous = this.currentMarble.previous;
            this.currentMarble = this.currentMarble.next;
            return score;
        }
    }

    printCircle() {
        let current = this.currentMarble;
        let values: number[] = [current.value];
        while (current.next !== this.currentMarble) {
            current = current.next;
            values.push(current.value);
        }
        console.log(values.join(','));
    }
}

function calculateHighestScore(playerCount: number, marbleCount: number) {
    const players: number[] = new Array<number>(playerCount).fill(0);
    const circle = new MarbleCircle();
    // circle.printCircle();
    for (let i = 1; i <= marbleCount; i++) {
        players[i % playerCount] += circle.addMarble(i);
        // circle.printCircle();
    }
    const part1 = players.reduce((max, score) => Math.max(max, score), 0);
    return part1;
}
