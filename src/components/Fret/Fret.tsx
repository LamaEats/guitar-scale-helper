import cn from 'classnames'

import { Tone } from '@src/lib/notes'
import { nullable } from '@src/utils/nullable'
import { useMemo } from 'react'
import { Note } from '../Note/Note'

import styles from './Fret.module.css'

interface FretProps {
    size: number
    empty?: boolean
    tones?: Array<Tone | null>
    rootTone: Tone
    accent?: boolean
    doubleAccent?: boolean
    number: number
}

export const Fret: React.FC<FretProps> = ({
    size,
    tones,
    rootTone,
    accent,
    doubleAccent,
    number,
}) => {
    const style = useMemo(
        () =>
            ({
                '--fret-width': `${size}px`,
            }) as React.CSSProperties,
        [size]
    )

    return (
        <span
            className={cn(styles.Fret, {
                [styles.Accent]: accent,
                [styles.DoubleAccent]: doubleAccent,
            })}
            style={style}
        >
            {nullable(tones, (t) =>
                t.map((toneOrNullish, index) => {
                    if (toneOrNullish != null) {
                        return (
                            <Note
                                note={toneOrNullish.note}
                                isRoot={toneOrNullish.note === rootTone.note}
                                key={`Note.${index}`}
                                inverse={number === 0}
                            />
                        )
                    }

                    return <Note.Blank key={`Note.${index}`} />
                })
            )}
        </span>
    )
}
