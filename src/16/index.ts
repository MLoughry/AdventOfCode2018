import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

type Registers = number[];
type Opcode = (r: Registers, a: number, b: number, c: number) => Registers;

const operations: { [opcode: string]: Opcode } = {
    addr: function (r, a, b, c) { r[c] = r[a] + r[b]; return r; },
    addi: function (r, a, b, c) { r[c] = r[a] + b; return r; },
    mulr: function (r, a, b, c) { r[c] = r[a] * r[b]; return r; },
    muli: function (r, a, b, c) { r[c] = r[a] * b; return r; },
    banr: function (r, a, b, c) { r[c] = r[a] & r[b]; return r; },
    bani: function (r, a, b, c) { r[c] = r[a] & b; return r; },
    borr: function (r, a, b, c) { r[c] = r[a] | r[b]; return r; },
    bori: function (r, a, b, c) { r[c] = r[a] | b; return r; },
    setr: function (r, a, b, c) { r[c] = r[a]; return r; },
    seti: function (r, a, b, c) { r[c] = a; return r; },
    gtir: function (r, a, b, c) { r[c] = a > r[b] ? 1 : 0; return r; },
    gtri: function (r, a, b, c) { r[c] = r[a] > b ? 1 : 0; return r; },
    gtrr: function (r, a, b, c) { r[c] = r[a] > r[b] ? 1 : 0; return r; },
    eqir: function (r, a, b, c) { r[c] = a === r[b] ? 1 : 0; return r; },
    eqri: function (r, a, b, c) { r[c] = r[a] === b ? 1 : 0; return r; },
    eqrr: function (r, a, b, c) { r[c] = r[a] === r[b] ? 1 : 0; return r; },
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const sampleRegex = /Before:\s*(\[\d+,\s*\d+,\s*\d+,\s*\d+\])\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*After:\s*(\[\d+,\s*\d+,\s*\d+,\s*\d+\])/gm;

    let threePlusPossibilitySamples = 0;
    let match: RegExpExecArray | null;

    let possibleNumToOpMap: Set<string>[] = [];
    for (let i = 0; i < 16; i++) {
        possibleNumToOpMap[i] = new Set(Object.keys(operations));
    }

    while ((match = sampleRegex.exec(input)) !== null) {
        const { before, opNum, a, b, c, after } = parseSample(match);
        let possibleOpCodes: number = 0;
        for (let [key, op] of Object.entries(operations)) {
            let afterOp = op([...before], a, b, c) as number[];
            if (afterOp[c] === after[c]) {
                possibleOpCodes++;
                if (possibleOpCodes === 3) {
                    threePlusPossibilitySamples++;
                }
            } else {
                possibleNumToOpMap[opNum].delete(key);
            }
        }
    }

    // Further refine the op codes
    let shouldIterateAgain = true;
    while (shouldIterateAgain) {
        shouldIterateAgain = false;
        possibleNumToOpMap.forEach(set => {
            if (set.size === 1
                && possibleNumToOpMap.some(other => other !== set && other.has([...set][0]))) {
                shouldIterateAgain = true;
                possibleNumToOpMap.forEach(other => {
                    if (other !== set) {
                        other.delete([...set][0]);
                    }
                })
            }
        });
    }

    const registers = [0, 0, 0, 0];
    let opCodeMap: [Opcode, string][] = possibleNumToOpMap
        .map((set, i) => {
            if (set.size !== 1) {
                console.error(`Op code ${i}: ${[...set]}`)
                throw new Error('Indeterminate data');
            } else {
                const key = [...set][0];
                return [operations[key], key];
            }
        });

    const programLineRegex = /^(\d+)\s*(\d+)\s*(\d+)\s*(\d+)/gm;
    programLineRegex.lastIndex = sampleRegex.lastIndex;

    while ((match = programLineRegex.exec(input)) !== null) {
        const [, op, a, b, c] = match.map(m => parseInt(m));
        (opCodeMap[op][0])(registers, a, b, c);
        console.log(`${opCodeMap[op][1]} ${a} ${b} ${c} => [${registers.join(', ')}]`);
    }

    return {
        part1: threePlusPossibilitySamples,
        part2: registers[0],
    };
}

function parseSample(match: RegExpExecArray) {
    const [, beforeJson, opStr, aStr, bStr, cStr, afterJson] = match;
    const before = JSON.parse(beforeJson) as number[], opNum = parseInt(opStr), a = parseInt(aStr), b = parseInt(bStr), c = parseInt(cStr), after = JSON.parse(afterJson) as number[];
    return { before, opNum, a, b, c, after };
}
