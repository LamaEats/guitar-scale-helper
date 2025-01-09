import classNames from 'classnames'
import { useMemo, useRef } from 'react'

import { NotesCircle, Tone } from '../../lib/notes'
import { Scale, scaleType } from '../../lib/scale'
import { calcFretsSize } from '../../lib/calcFretsSize'
import { Fret } from '../Fret/Fret'
import { Box } from '../Box/Box'
import { Highlight, HighlightContext } from '../Highlight/Highlight'

import classes from './Fretboard.module.css'

type NumericString = `${number}`

type InstrumentalString<T extends NumericString = NumericString> = Record<
    T,
    Tone
>

interface FretboardProps {
    strings: InstrumentalString
    frets: number
    root: Tone
    type: keyof typeof scaleType
}

const accentFretsIndex = [3, 5, 7, 9, 15, 17, 19, 21]
const doubleFretsIndex = [12, 24]

export const Fretboard: React.FC<FretboardProps> = ({
    strings,
    frets,
    root,
    type,
}) => {
    const sizes = calcFretsSize(frets)
    const scale = useMemo(() => new Scale(root.note, type), [root, type])
    const notesPerString = useMemo(
        () => Object.values(strings).map((tone) => new NotesCircle(tone)),
        [strings]
    )

    return (
        <Box className={classNames(classes.FretboardWrapper)}>
            <div className={classNames(classes.Fretboard)}>
                <div className={classNames(classes.FretboardInner)}>
                    <Highlight strings={notesPerString} scale={scale}>
                        <HighlightContext.Consumer>
                            {({ setFret }) =>
                                Array.from({ length: frets + 1 }).map(
                                    (_, i) => (
                                        <Fret
                                            onClick={() => {
                                                setFret(i)
                                            }}
                                            rootTone={root}
                                            number={i}
                                            size={sizes[i]}
                                            key={`fret.${i}`}
                                            accent={accentFretsIndex.includes(i)}
                                            doubleAccent={doubleFretsIndex.includes(i)}
                                            tones={notesPerString.map((circle) => {
                                                const currentNote = circle.skip(i)

                                                return scale.includes(currentNote)
                                                    ? currentNote
                                                    : null
                                            })}
                                        />
                                    )
                                )
                            }
                        </HighlightContext.Consumer>
                    </Highlight>
                </div>
            </div>
        </Box>
    )
}
