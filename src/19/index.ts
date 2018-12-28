import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';
import { Registers, operations, Instruction, OpCode } from "../common/OpCodes";

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const registers: Registers = [0,0,0,0,0,0];
    const { ipRegister, instructions }: { ipRegister: number; instructions: Instruction[]; } = parseProgram(input);

    while (registers[ipRegister] >= 0 && registers[ipRegister] < instructions.length) {
        const {op, a, b, c} = instructions[registers[ipRegister]];
        operations[op](registers, a, b, c);
        registers[ipRegister]++;
    }

    const part1 = registers[0];

    return {
        part1,
        // part2,
    };
}

function parseProgram(input: string) {
    const programRegex = new RegExp(`#ip\\s+(\\d+)|(${Object.keys(operations).join('|')})\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)`, 'gm');
    let ipRegister = 0;
    const instructions: Instruction[] = [];
    let regexMatch: RegExpExecArray | null = null;
    while ((regexMatch = programRegex.exec(input)) !== null) {
        const [, ip, op, a, b, c] = regexMatch
            .map((s, i) => {
                return i === 1 || i > 2 ?
                    parseInt(s)
                    : s;
            }) as [string, number, OpCode, number, number, number];
        if (!isNaN(ip)) {
            ipRegister = ip;
        }
        else {
            instructions.push({ op, a, b, c });
        }
    }
    return { ipRegister, instructions };
}
