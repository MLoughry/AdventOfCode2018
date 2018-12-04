import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

const startShiftRegex = /Guard #(\d+) begins shift/;
const fallsAsleepRegex = /(\d{2})\] falls asleep/;
const wakesUpRegex = /(\d{2})\] wakes up/;

interface Guard {
    id: number;
    total: number;
    minutes: number[];
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const lines = input.split('\r\n').sort();

    const guardSleepTimes: {[id: number]: Guard} = {};

    let currentGuard: number | null = null;
    let asleepTime: number | null = null;

    for (const line of lines) {
        if(startShiftRegex.test(line)) {
            currentGuard = parseInt(startShiftRegex.exec(line)![1]);
        } else if (fallsAsleepRegex.test(line)) {
            asleepTime = parseInt(fallsAsleepRegex.exec(line)![1]);
        } else {
            const awakeTime = parseInt(wakesUpRegex.exec(line)![1]);
            const current = (guardSleepTimes[currentGuard!] = guardSleepTimes[currentGuard!] || {id: currentGuard, total: 0, minutes: new Array(60).fill(0)});

            current.total += awakeTime - asleepTime!;
            for (let i = asleepTime!; i < awakeTime; i++) {
                current.minutes[i]++;
            }
        }
    }
    const guards = Object.values(guardSleepTimes);

    let sleepiestGuard = findGuardWithMostTotalMinutesAsleep();

    let { sleepiestMinute } = findSleepiestMinuteForGuard(sleepiestGuard);

    const part1 = sleepiestGuard.id * sleepiestMinute;

    const {id: part2Id, sleepiestMinute: part2Minute} = guards
        .map(guard => {
            const {sleepiestMinute, minutesAsleep} = findSleepiestMinuteForGuard(guard);
            return { id: guard.id, sleepiestMinute, minutesAsleep };
        })
        .sort((a, b) => b.minutesAsleep - a.minutesAsleep)[0];

    const part2 = part2Id * part2Minute;

    return {
        part1,
        part2,
    };

    function findGuardWithMostTotalMinutesAsleep(): Guard {
        let sleepiestGuard: null | Guard = null;
        for (const guard of guards) {
            if (sleepiestGuard === null
                || guard.total > sleepiestGuard!.total) {
                sleepiestGuard = guard;
            }
        }
        return sleepiestGuard!;
    }

    function findSleepiestMinuteForGuard(guard: Guard) {
        let sleepiestMinute = 0;
        guard.minutes.forEach((val, i) => {
            if (val > guard.minutes[sleepiestMinute]) {
                sleepiestMinute = i;
            }
        });
        return {
            sleepiestMinute,
            minutesAsleep: guard.minutes[sleepiestMinute]
        };
    }
}