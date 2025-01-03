import { NoteLetter, NotesCircle, Tone } from './notes'

export class ScaleNote extends Tone {
    root = false

    constructor(note: NoteLetter, root: boolean) {
        super(note)
        this.root = root
    }
}

interface IScale {
    circle: NotesCircle<ScaleNote>
    scale: ScaleNote[]
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

export class Scale implements IScale {
    circle: NotesCircle<ScaleNote>
    steps: Array<number>
    private calculatedScale: ScaleNote[] | void = void 0

    constructor(root: NoteLetter, interval: Array<number>) {
        this.circle = new NotesCircle(new ScaleNote(root, true))
        this.steps = interval
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
}
