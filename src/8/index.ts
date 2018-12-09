import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';

interface Node {
    children: Node[];
    metadata: number[];
    size: number;
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const data: number[] = input.split(/\s+/).map(i => parseInt(i));

    const root = parseNode(data);

    const part1 = sumPart1(root);
    const part2 = sumPart2(root);

    function sumPart1({children, metadata}: Node): number {
        return [...metadata, ...children.map(sumPart1)]
            .reduce((total, i) => total + i, 0);
    }

    function sumPart2({children, metadata}: Node): number {
        if (children.length === 0) {
            return metadata
                .reduce((total, i) => total + i, 0);
        } else {
            return metadata
            .reduce((total, i) => {
                let referencedChild = children[i - 1];
                if (!referencedChild) {
                    return total;
                } else {
                    return total + sumPart2(referencedChild);
                }
            }, 0);
        }
    }

    function parseNode(data: number[], offset: number = 0): Node {
        const numChildren = data[offset++];
        const numMetadata = data[offset++];
        const children: Node[] = [];
        for (let i = 0; i < numChildren; i++) {
            let child = parseNode(data, offset);
            offset += child.size;
            children.push(child);
        }

        const size: number = 2 + numMetadata + children.reduce((s, n) => s + n.size, 0);
        const metadata = data.slice(offset, offset + numMetadata);
        return { children, metadata, size };
    }

    return {
        part1,
        part2,
    };
}