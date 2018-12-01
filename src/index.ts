import { SolutionFile } from './common/SolutionFile';
import { watch } from 'chokidar';
import log from 'fancy-log'

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

function runSolver(solverFilePath: string) {
    try {
        delete require.cache[solverFilePath];
        let solver = require(solverFilePath) as SolutionFile;
        const { part1, part2 } = solver.default();
        log('');
        if (part1) {
            log(`Part 1: ${part1}`);
        }
        if (part2) {
            log(`Part 1: ${part2}`);
        }
    }
    catch (err) {
        console.error(err);
    }
}
