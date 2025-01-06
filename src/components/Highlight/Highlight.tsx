import { NotesCircle, Tone } from '@src/lib/notes'
import { Scale } from '@src/lib/scale'
import React, { useMemo, useState } from 'react'

export interface Highlight {
    setFret(n: number): void
    selectedFretIndex: number
    notesToHighlight: Array<{ [key: number]: Tone }>
}

interface HighlightProps {
    strings: NotesCircle<Tone>[]
    scaleNotesPerString?: number
    scale: Scale
}

export const HighlightContext = React.createContext<Highlight>({
    selectedFretIndex: -1,
    notesToHighlight: [],
    setFret: () => {},
})

export const Highlight: React.FC<React.PropsWithChildren<HighlightProps>> = (
    props
) => {
    const { strings, scale, scaleNotesPerString = 3 } = props
    const [selectedFretIndex, setSelectedFretIndex] = useState(-1)
    const notesToHighlight = useMemo(() => {
        if (selectedFretIndex === -1) {
            return []
        }

        const startTone = strings.at(-1)!.skip(selectedFretIndex)

        if (!scale.includes(startTone)) {
            return []
        }

        const res: Array<{ [key: number]: Tone }> = []
        let tone = scale.toneFromScale(startTone)

        if (tone == null) {
            return []
        }

        for (let i = strings.length - 1; i >= 0; i -= 1) {
            for (let f = 0; f < scaleNotesPerString; f += 1) {
                let fretIndex = strings[i].findIndex(tone!)

                if (fretIndex % 12 < selectedFretIndex - 1) {
                    fretIndex = fretIndex + 12
                }

                res[i] = {
                    ...res[i],
                    [fretIndex + 1]: tone!, // real fret number
                }

                tone = scale.next(tone!)
            }
        }

        return res
    }, [selectedFretIndex, strings, scale, scaleNotesPerString])

    const ctxValue = useMemo(
        () => ({
            notesToHighlight,
            selectedFretIndex,
            setFret: (n: number) => {
                setSelectedFretIndex((prev) => {
                    if (prev == n) {
                        return -1
                    }

                    return n
                })
            },
        }),
        [notesToHighlight, selectedFretIndex]
    )

    return (
        <HighlightContext.Provider value={ctxValue}>
            {props.children}
        </HighlightContext.Provider>
    )
}
