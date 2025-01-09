import cn from 'classnames'

import { Tone } from '@src/lib/notes'
import { nullable } from '@src/utils/nullable'
import { useContext, useMemo } from 'react'
import { Note } from '../Note/Note'

import styles from './Fret.module.css'
import { HighlightContext } from '../Highlight/Highlight'

interface FretProps {
    size: number
    empty?: boolean
    tones?: Array<Tone | null>
    rootTone: Tone
    accent?: boolean
    doubleAccent?: boolean
    number: number
    onClick?: () => void
}

export const Fret: React.FC<FretProps> = ({
    size,
    tones,
    rootTone,
    accent,
    doubleAccent,
    number,
    onClick,
}) => {
    const style = useMemo(
        () => ({ '--fret-width': `${size}px` }) as React.CSSProperties,
        [size]
    )

    const { notesToHighlight } = useContext(HighlightContext)

    return (
        <span
            className={cn(styles.Fret, {
                [styles.Accent]: accent,
                [styles.DoubleAccent]: doubleAccent,
            })}
            onClick={onClick}
            style={style}
        >
            {nullable(tones, (t) =>
                t.map((toneOrNullish, index) => {
                    if (toneOrNullish != null) {
                        const isHighlighted =
                            notesToHighlight[index]?.[number]?.note ===
                            toneOrNullish.note
                        return (
                            <Note
                                note={toneOrNullish.note}
                                isRoot={toneOrNullish.note === rootTone.note}
                                key={`Note.${index}`}
                                inverse={number === 0}
                                highlight={isHighlighted}
                            />
                        )
                    }

                    return <Note.Blank key={`Note.${index}`} />
                })
            )}
        </span>
    )
}
