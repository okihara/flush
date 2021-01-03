export class Line {
    type: String;
    from: String;
    to: String;

    constructor(value: any) {
        this.type = value.type;
        this.from = value.from;
        this.to = value.to;
    }

    keyId(): String {
        return [this.from, this.to].sort().join('-')
    }
}

export interface Position {
    x: Number;
    y: Number;
}

export class Node {
    type: String;
    pos: Position;

    constructor(value: any) {
        this.type = value.type;
        this.pos = value.pos;
    }
}
