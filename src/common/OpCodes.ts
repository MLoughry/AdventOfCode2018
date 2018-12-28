
export type Registers = number[];
export type AssemblyOperation = (r: Registers, a: number, b: number, c: number) => Registers;

export interface OpCodes { 
    addr: AssemblyOperation; 
    addi: AssemblyOperation; 
    mulr: AssemblyOperation; 
    muli: AssemblyOperation; 
    banr: AssemblyOperation;
    bani: AssemblyOperation; 
    borr: AssemblyOperation; 
    bori: AssemblyOperation;
    setr: AssemblyOperation;
    seti: AssemblyOperation;
    gtir: AssemblyOperation;
    gtri: AssemblyOperation;
    gtrr: AssemblyOperation;
    eqir: AssemblyOperation;
    eqri: AssemblyOperation;
    eqrr: AssemblyOperation;
};

export type OpCode = keyof OpCodes;

export const operations: OpCodes = {
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
