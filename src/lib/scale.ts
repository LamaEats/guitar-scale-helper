import { NoteLetter, NotesCircle, Tone } from './notes'

export class ScaleNote extends Tone {
    root = false

    constructor(note: NoteLetter, root: boolean) {
        super(note)
        this.root = root
    }
}

export const scaleType = {
    major: [2, 2, 1, 2, 2, 2],
    lydian: [2, 2, 2, 1, 2, 2],
    mixolydian: [2, 2, 1, 2, 2, 1],
    dorian: [2, 1, 2, 2, 2, 1],
    frygian: [1, 2, 2, 2, 1, 2],
    lokrian: [1, 2, 2, 1, 2, 2],
    minor: [2, 1, 2, 2, 1, 2],
    minorPentatonic: [3, 2, 2, 3],
}

interface IScale {
    circle: NotesCircle<ScaleNote>
    scale: ScaleNote[];
    includes(tone: Tone): boolean;
    isRootNote(tone: Tone): boolean;
}

export class Scale implements IScale {
    circle: NotesCircle<ScaleNote>
    private steps: Array<number>;
    private calculatedScale: ScaleNote[] | void = void 0

    constructor(root: NoteLetter, type: keyof typeof scaleType) {
        this.circle = new NotesCircle(new ScaleNote(root, true))
        this.steps = scaleType[type];
    }

    get scale() {
        if (this.calculatedScale) {
            return this.calculatedScale
        }

        this.calculatedScale = [this.circle.root]
        for (const step of this.steps) {
            let current = step
            let target = this.calculatedScale[this.calculatedScale.length - 1]

            while (current--) {
                if (target.next) {
                    target = target.next as ScaleNote
                }
            }

            this.calculatedScale.push(target)
        }

        return this.calculatedScale
    }

    includes(tone: Tone): boolean {
        return this.scale.findIndex((t) => t.note === tone.note) > -1
    }

    isRootNote(tone: Tone) {
        return this.circle.root.note === tone.note
    }

    interval(tone: Tone, circle: NotesCircle<Tone>): number {
        const currentToneIndex = circle.findIndex(tone);
        const stopToneIndex = circle.findIndex(tone.next);

        return stopToneIndex - currentToneIndex;
    };

    next(tone: Tone): Tone | null {
        if (!this.includes(tone)) return null;

        let from = this.scale.findIndex((t) => t.note === tone.note);

        if (from === this.scale.length - 1) {
            from = -1;
        }

        return this.scale[from + 1];
    }

    toneFromScale (tone: Tone): Tone | null {
        if (!this.includes(tone)) return null;

        return this.scale.find((t) => t.note === tone.note) as Tone;
    }
}
