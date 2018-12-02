import { SolutionFile } from './common/SolutionFile';
import { watch } from 'chokidar';
import log from 'fancy-log'
import { blue, yellow } from 'ansi-colors';

async function main() {
    if (!process.argv[2]) {
        console.error('Must pass a day to run');
        return;
    }

    const day = parseInt(process.argv[2], 10);
    const solverFilePath = require.resolve(`./${day}`);

    runSolver(solverFilePath);
    watch(solverFilePath)
        .on(
            'change',
            () => {
                runSolver(solverFilePath);
            });
}

main();

async function runSolver(solverFilePath: string) {
    try {
        delete require.cache[solverFilePath];
        let solver = require(solverFilePath) as SolutionFile;
        console.time('Solver runtime');
        const { part1, part2 } = await solver.default();
        console.timeEnd('Solver runtime');
        if (part1) {
            log(yellow(`Part 1: ${blue(part1.toString())}`));
        }
        if (part2) {
            log(yellow(`Part 2: ${blue(part2.toString())}`));
        }
        log('');
    }
    catch (err) {
        console.error(err);
    }
}
