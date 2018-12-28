import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';
import { operations, AssemblyOperation, OpCode } from "../common/OpCodes";

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const sampleRegex = /Before:\s*(\[\d+,\s*\d+,\s*\d+,\s*\d+\])\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*After:\s*(\[\d+,\s*\d+,\s*\d+,\s*\d+\])/gm;

    let threePlusPossibilitySamples = 0;
    let match: RegExpExecArray | null;

    let possibleNumToOpMap: Set<OpCode>[] = [];
    for (let i = 0; i < 16; i++) {
        possibleNumToOpMap[i] = new Set<OpCode>(Object.keys(operations) as OpCode[]);
    }

    while ((match = sampleRegex.exec(input)) !== null) {
        const { before, opNum, a, b, c, after } = parseSample(match);
        let possibleOpCodes: number = 0;
        for (let [key, op] of Object.entries(operations) as [OpCode, AssemblyOperation][]) {
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
    let opCodeMap: AssemblyOperation[] = possibleNumToOpMap
        .map((set, i) => {
            if (set.size !== 1) {
                console.error(`Op code ${i}: ${[...set]}`)
                throw new Error('Indeterminate data');
            } else {
                const key = [...set][0];
                return operations[key];
            }
        });

    const programLineRegex = /^(\d+)\s*(\d+)\s*(\d+)\s*(\d+)/gm;
    programLineRegex.lastIndex = input.indexOf('\r\n\r\n\r\n');

    while ((match = programLineRegex.exec(input)) !== null) {
        const [, op, a, b, c] = match.map(m => parseInt(m));
        (opCodeMap[op])(registers, a, b, c);
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
