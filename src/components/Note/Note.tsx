import { NoteLetter } from '@src/lib/notes'
import cn from 'classnames'

import styles from './Note.module.css'

interface NoteProps {
    note: NoteLetter
    isRoot?: boolean
    inverse?: boolean;
    highlight?: boolean;
}

interface NoteComponent extends React.FC<NoteProps> {
    Blank: React.FC
}

const Note: NoteComponent = ({ note, isRoot, inverse, highlight }) => {
    return (
        <span
            className={cn(styles.Note, {
                [styles.Note_isRoot]: isRoot,
                [styles.Note_inverse]: inverse,
                [styles.Note_highlight]: highlight,
            })}
        >
            <code>{note}</code>
        </span>
    )
}

const Blank = () => <span className={cn(styles.Note, styles.Note_isBlank)} />

Note.Blank = Blank

export { Note }
