import { Circle, NoteLetter, NotesCircle, Tone } from './notes'

class GuitarString {
    openTone: NoteLetter
    tones: Circle<Tone>

    constructor(open: NoteLetter) {
        this.openTone = open
        this.tones = new NotesCircle(new Tone(this.openTone))
    }
}

export class Tunning {
    public tunning: Array<GuitarString>
    constructor(private strings: Array<NoteLetter>) {
        this.tunning = this.strings.reduce<Array<GuitarString>>(
            (acc, openNote) => {
                acc.push(new GuitarString(openNote))

                return acc
            },
            []
        )
    }

    get tune() {
        return this.tunning.reduce<Record<`${number}`, Tone>>(
            (acc, note, index, { length }) => {
                const stringNum: `${number}` = `${length - index + 1}`
                acc[stringNum] = new Tone(note.openTone)

                return acc
            },
            {}
        )
    }
}

export const tunning: { [key: string]: NoteLetter[] } = {
    'E standart': ['E', 'A', 'D', 'G', 'B', 'E'],
    'Drop D': ['D', 'A', 'D', 'G', 'B', 'E'],
    'D standart': ['D', 'G', 'C', 'F', 'A', 'D'],
    'Drop C': ['C', 'G', 'C', 'F', 'A', 'D'],
    'Drop B': ['B', 'F#', 'B', 'E', 'G#', 'C'],
}
