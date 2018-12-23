import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

interface PowerSquare {
    x: number;
    y: number;
    power: number;
    size: number;
}

export default async function (): Promise<Solution> {
    const serialNumber = parseInt(await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8'));

    const fuelCells: number[][] = [];

    for (let x = 1; x <= 300; x++) {
        fuelCells[x] = [];
        for (let y = 1; y <= 300; y++) {
            fuelCells[x][y] = getCellPowerLevel(x, y);
        }
    }

    const part1Square: PowerSquare = calculateBestPowerForsize(3);

    let bestPart2Square: PowerSquare = calculateBestPowerForsize(1);
    for (let size = 2; size <= 300; size++) {
        const bestForSize = calculateBestPowerForsize(size);
        if (bestForSize.power > bestPart2Square.power) {
            bestPart2Square = bestForSize;
        }
    }

    return {
        part1: `${part1Square!.x},${part1Square!.y}`,
        part2: `${bestPart2Square.x},${bestPart2Square.y},${bestPart2Square.size}`,
    };

    function calculateBestPowerForsize(size: number): PowerSquare {
        let bestPowerSquare: PowerSquare | null = null;
        for (let x = 1; x <= 301 - size; x++) {
            for (let y = 1; y <= 301 - size; y++) {
                let power = 0;
                for (let offsetX = 0; offsetX < size; offsetX++) {
                    for (let offsetY = 0; offsetY < size; offsetY++) {
                        power += fuelCells[x + offsetX][y + offsetY];
                    }
                }
                if (!bestPowerSquare || power > bestPowerSquare.power) {
                    bestPowerSquare = { x, y, power, size };
                }
            }
        }
        return bestPowerSquare!;
    }

    function getCellPowerLevel(x: number, y: number) {
        const rackId = x + 10;
        let powerLevel = rackId * y;
        powerLevel += serialNumber;
        powerLevel *= rackId;
        powerLevel = Math.floor(powerLevel / 100) % 10;
        return powerLevel - 5;
    }
}