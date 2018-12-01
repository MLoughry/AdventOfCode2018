export interface Solution {
    part1?: string | number;
    part2?: string | number;
}

export type Solver = () => Solution;

export interface SolutionFile {
    default: Solver;
}