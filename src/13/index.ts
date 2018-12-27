import { Solution } from "../common/SolutionFile";
import path from 'path';
import fs from 'mz/fs';
import { blue } from "ansi-colors";

type Track = '|' | '-' | '+' | '/' | '\\' | ' ';
type TrackMap = ReadonlyArray<ReadonlyArray<Track>>;
type CartMapSource = (Track | '^' | 'v' | '<' | '>')[][];

const enum NextTurn {
    Left = -1,
    Straight = 0,
    Right = 1,
}

const enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3,
}

interface Point {
    x: number;
    y: number;
}

class CartMap {
    private carts: Cart[];
    private map: TrackMap;

    constructor(source: string[][]) {
        this.carts = [];
        this.map = source
            .map((line, y) => {
                return line
                    .map((cell, x) => {
                        switch (cell) {
                            case '<':
                                this.carts.push(new Cart({ x, y }, Direction.Left, this));
                                return '-';
                            case '>':
                                this.carts.push(new Cart({ x, y }, Direction.Right, this));
                                return '-';
                            case '^':
                                this.carts.push(new Cart({ x, y }, Direction.Up, this));
                                return '|';
                            case 'v':
                                this.carts.push(new Cart({ x, y }, Direction.Down, this));
                                return '|';
                            case '/':
                            case '\\':
                            case '+':
                            case '-':
                            case '|':
                            case ' ':
                                return cell;
                            default:
                                console.error(`Parsing error at ${x},${y}: "${cell.charCodeAt(0)}"`);
                                process.exit();
                        }
                    });
            }) as any as Track[][];

    }

    get trackMap(): TrackMap { return this.map; }

    private getCartsInMovePriority() {
        const sorted = this.carts
            .sort(({ position: a }, { position: b }) => (a.y - b.y) || (a.x - b.x));
        // process.stdout.write('s');
        return sorted;
    }

    private executeRound(continueOnCrash: boolean) {
        for (const cart of this.getCartsInMovePriority()) {
            cart.move();
            for (const otherCart of this.carts) {
                if (cart.isCollidingWith(otherCart)) {
                    if (continueOnCrash) {
                        this.carts = this.carts.filter(c => c !== cart && c !== otherCart);
                    } else {
                        throw cart.position;
                    }
                }
            }
        }
    }

    runPart1() {
        while (true) {
            this.executeRound(false);
        }
    }

    runPart2() {
        while (this.carts.length > 1) {
            this.executeRound(true);
        }
        return this.carts[0].position;
    }

    toString() {
        return this.map
            .map((line, y) => line
                .map((cell, x) => {
                    let cart: Cart | undefined = this.carts.find(({position: {x: cx, y: cy}}) => x === cx && y == cy);

                    if (cart) {
                        return cart.toString();
                    } else {
                        return cell;
                    }
                }).join('')
            ).join('\n');
    }
}

let cartCounter = 0;

class Cart {
    private nextIntersection: NextTurn = NextTurn.Left;
    id: number;

    constructor(private pos: Point, private direction: Direction, private map: CartMap) {
        this.id = cartCounter++;
    }

    get position(): Readonly<Point> {
        return this.pos;
    }

    move() {
        switch (this.direction) {
            case Direction.Up:
                this.pos.y--;
                break;
            case Direction.Down:
                this.pos.y++;
                break;
            case Direction.Left:
                this.pos.x--;
                break;
            case Direction.Right:
                this.pos.x++;
                break;
        }

        const newCell = this.map.trackMap[this.pos.y][this.pos.x];

        switch (newCell) {
            case '/':
                switch (this.direction) {
                    case Direction.Up:
                        this.direction = Direction.Right;
                        break;
                    case Direction.Right:
                        this.direction = Direction.Up;
                        break;
                    case Direction.Down:
                        this.direction = Direction.Left;
                        break;
                    case Direction.Left:
                        this.direction = Direction.Down;
                        break;
                }
                break;
            case '\\':
                switch (this.direction) {
                    case Direction.Up:
                        this.direction = Direction.Left;
                        break;
                    case Direction.Right:
                        this.direction = Direction.Down;
                        break;
                    case Direction.Down:
                        this.direction = Direction.Right;
                        break;
                    case Direction.Left:
                        this.direction = Direction.Up;
                        break;
                }
                break;
            case '+':
                this.direction = (this.direction + this.nextIntersection + 4) % 4;
                switch (this.nextIntersection) {
                    case NextTurn.Left:
                        this.nextIntersection = NextTurn.Straight;
                        break;
                    case NextTurn.Straight:
                        this.nextIntersection = NextTurn.Right;
                        break;
                    case NextTurn.Right:
                        this.nextIntersection = NextTurn.Left;
                        break;
                }
                break;
            case '-':
            case '|':
                break;
            default:
                console.error(`Cart at invalid cell: ${this.pos}`);
                process.exit(1);
        }
        // process.stdout.write('m');
    }

    isCollidingWith(other: Cart) {
        const { x, y } = other.position;
        return this !== other && this.pos.x === x && this.pos.y === y;
    }

    toString() {
        switch(this.direction) {
            case Direction.Up: return blue('^');
            case Direction.Down: return blue('v');
            case Direction.Left: return blue('<');
            case Direction.Right: return blue('>');
        }
    }
}

export default async function (): Promise<Solution> {
    const input = await fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8');

    const cartMap1 = new CartMap(input.split('\n').map(line => line.split('').filter(c => c !== '\r')) as CartMapSource);

    let part1: string = '';
    try {
        cartMap1.runPart1()
    } catch ({ x, y }) {
        part1 = `${x},${y}`;
    }

    const cartMap2 = new CartMap(input.split('\n').map(line => line.split('').filter(c => c !== '\r')) as CartMapSource);
    const {x,y} = cartMap2.runPart2();
    const part2 = `${x},${y}`;

    return {
        part1,
        part2,
    };
}