import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

interface Point {
    x: number;
    y: number;
}

interface Rect {
    x: [number, number];
    y: [number, number];
}

interface LinearEquation {
    slope: number;
    offset: number;
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const points: Point[] = input
        .split('\n')
        .map(line => {
            const [x, y] = line.split(', ').map(i => parseInt(i))
            return { x, y };
        });

    const pointBounds: Rect = points
        .reduce<Rect>(({ x, y }, { x: px, y: py }) => {
            return {
                x: [
                    Math.min(px, x[0]),
                    Math.max(px, x[1]),
                ],
                y: [
                    Math.min(py, y[0]),
                    Math.max(py, y[1]),
                ],
            }
        }, { x: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER], y: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER] });

    const part1 = calculatePart1(pointBounds, points);

    const maximumAggregateDistance = 10000;

    let part2 = 0;
    for (let x = pointBounds.x[0]; x <= pointBounds.x[1]; x++) {
        for (let y = pointBounds.y[0]; y <= pointBounds.y[1]; y++) {
            let aggregateDistance = 0;
            for (const p of points) {
                aggregateDistance += getManhattanDistance(p, {x, y});
            }

            if (aggregateDistance < maximumAggregateDistance) {
                part2++;
            }
        }
    }

    return {
        part1,
        part2,
    };
}

function calculatePart1(pointBounds: Rect, points: Point[]) {
    const searchBounds: Rect = {
        x: [2 * pointBounds.x[0] - pointBounds.x[1], 2 * pointBounds.x[1] - pointBounds.x[0]],
        y: [2 * pointBounds.y[0] - pointBounds.y[1], 2 * pointBounds.y[1] - pointBounds.y[0]],
    };
    const pointDomainSizes = new Map<Point | null, number>();
    for (let x = searchBounds.x[0]; x <= searchBounds.x[1]; x++) {
        for (let y = searchBounds.y[0]; y <= searchBounds.y[1]; y++) {
            let closestPoint = findClosestPointTo(points, { x, y });
            if (closestPoint) {
                pointDomainSizes.set(closestPoint, (pointDomainSizes.get(closestPoint) || 0) + 1);
            }
        }
    }
    // Eliminate any points that have infinite domains, by searching one level out from the searchBounds
    for (let x = searchBounds.x[0]; x <= searchBounds.x[1]; x++) {
        pointDomainSizes.delete(findClosestPointTo(points, { x, y: searchBounds.y[0] - 1}));
        pointDomainSizes.delete(findClosestPointTo(points, { x, y: searchBounds.y[1] - 1}));
    }
    for (let y = searchBounds.y[0]; y <= searchBounds.y[1]; y++) {
        pointDomainSizes.delete(findClosestPointTo(points, { x: searchBounds.x[0] - 1, y}));
        pointDomainSizes.delete(findClosestPointTo(points, { x: searchBounds.x[1] - 1, y}));
    }
    const part1 = [...pointDomainSizes.values()]
        .reduce((acc, i) => Math.max(acc, i), 0);
    return part1;
}

function findClosestPointTo(searchPoints: Point[], domainPoint: Point) {
    let closestPoint: Point | null = null;
    let closestDistance: number = Number.MAX_SAFE_INTEGER;

    for (const p of searchPoints) {
        const distance = getManhattanDistance(p, domainPoint);
        if (distance < closestDistance) {
            closestPoint = p;
            closestDistance = distance;
        } else if (distance === closestDistance) {
            closestPoint = null;
        }
    }

    return closestPoint;
}

function getManhattanDistance({x: x1, y: y1}: Point, {x: x2, y: y2}: Point): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
