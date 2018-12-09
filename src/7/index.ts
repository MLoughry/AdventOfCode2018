import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';
import { stringify } from "querystring";

interface Step {
    id: string;
    before: Step[];
    after: Step[];
}

interface InProgressTask {
    completionTime: number;
    step: Step;
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    let part1: string = calculatePart1(input);

    let part2 = calculatePart2(input);

    return {
        part1,
        part2,
    };
}

class SortedQueue<T> {
    private queue: T[] = [];

    constructor(private comparator: (a: T, b: T) => number) { }

    push(item: T) {
        let index = this.queue.findIndex(a => this.comparator(a, item) > 0);
        if (index === -1) {
            index = this.queue.length;
        }

        this.queue.splice(index, 0, item);
    }

    shift(): T | undefined {
        return this.queue.shift();
    }

    peek(): T | undefined {
        return this.queue[0];
    }

    get length() {
        return this.queue.length;
    }
}

function calculatePart2(input: string) {
    const workers = 5;
    const stepMap = buildStepMap(input);
    const readyQueue: SortedQueue<Step> = new SortedQueue<Step>((a, b) => a.id.localeCompare(b.id));
    const tasksInProgress: SortedQueue<InProgressTask> = new SortedQueue<InProgressTask>((a, b) => (a.completionTime - b.completionTime) || a.step.id.localeCompare(b.step.id));
    for (const step of stepMap.values()) {
        if (step.before.length === 0) {
            readyQueue.push(step);
        }
    }
    let part2 = 0;
    while (readyQueue.length || tasksInProgress.length) {
        queueAllAvailableTasks();
        const { completionTime, step: completedStep } = (tasksInProgress.shift()!);
        part2 = completionTime;
        for (const step of completedStep.after) {
            step.before = step.before.filter(b => b.id !== completedStep.id);
            if (step.before.length === 0) {
                readyQueue.push(step);
            }
        }
    }
    function queueAllAvailableTasks() {
        while (readyQueue.length && tasksInProgress.length < workers) {
            const step = readyQueue.shift()!;
            tasksInProgress.push({
                completionTime: part2 + (step.id.charCodeAt(0) - 4),
                step
            });
        }
    }
    return part2;
}

function calculatePart1(input: string) {
    const stepMap = buildStepMap(input);
    // TODO: sort ready queue, and pop used steps
    const readyQueue: SortedQueue<Step> = new SortedQueue<Step>((a, b) => a.id.localeCompare(b.id));
    let part1: string = '';
    for (const step of stepMap.values()) {
        if (step.before.length === 0) {
            readyQueue.push(step);
        }
    }
    while (readyQueue.length) {
        const nextStep = readyQueue.shift()!;
        part1 += nextStep.id;
        for (const step of nextStep.after) {
            step.before = step.before.filter(b => b.id !== nextStep.id);
            if (step.before.length === 0) {
                readyQueue.push(step);
            }
        }
    }
    return part1;
}

function buildStepMap(input: string) {
    const stepMap = new Map<string, Step>();
    input
        .split('\n')
        .forEach(line => {
            const [, beforeId, afterId] = /Step (\w) must be finished before step (\w) can begin\./.exec(line)!;
            setStepDependency(beforeId, afterId);
        });
    return stepMap;
    function setStepDependency(beforeId: string, afterId: string) {
        let before = getStep(beforeId);
        let after = getStep(afterId);
        before.after.push(after);
        after.before.push(before);
    }
    function getStep(id: string): Step {
        const step = stepMap.get(id)
            || {
                id,
                before: [],
                after: []
            };
        stepMap.set(id, step);
        return step;
    }
}

