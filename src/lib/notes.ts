export type NoteLetter = "A" | "A#" | "B" | "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#";

export interface Note {
    note: NoteLetter;
}

export const sequence = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"] as const;

export class Tone implements Note {
    note: NoteLetter;
    next!: Tone;

    constructor(startNote: NoteLetter) {
        this.note = startNote;
    }
}

export interface Circle<T extends Tone> {
    root: T;
    find(note: NoteLetter): T | null;
    map<R>(iteratee: (tone: Tone, index: number) => R, count: number): R[];
}

export class NotesCircle<T extends Tone> implements Circle<T> {
    root: T;

    constructor(root: T, private toneCtor = root.constructor) {
        this.root = root;
        this.build();
    }

    protected build() {
        let step = 0;

        let cursor = this.root;
        let sequenceIndex = sequence.indexOf(cursor.note);

        while (step < sequence.length - 1) {
            let nextNote = sequence[sequenceIndex + 1];

            if (!nextNote) {
                nextNote = sequence[0];
                sequenceIndex = 0;
            } else {
                sequenceIndex += 1;
            }

            // @ts-ignore
            (cursor.next as Tone) = new this.toneCtor(nextNote);
            cursor = cursor.next as T;
            step += 1;
        }

        cursor.next = this.root;
    }

    public find(note: NoteLetter): T | null {
        let source = this.root;

        while (source) {
            if (source.note === note) {
                return source;
            }

            source = this.root.next as T;
        }
        return null;
    }

    public map<R>(iteratee: (tone: Tone, i: number) => R, count: number): R[] {
        let i = 0;
        let current: Tone = this.root;
        const results: R[] = []; 

        while (i <= count) {
            results[i] = iteratee(current, i)
            current = current.next;
            i+= 1;
        }

        return results;
    }
}
