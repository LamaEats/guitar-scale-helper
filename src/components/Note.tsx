import { NoteLetter } from "@src/lib/notes"
import { nullableClassName } from "@src/utils/nullable"

interface NoteProps {
    note: NoteLetter;
    isRoot?: boolean;
}


export const Note: React.FC<NoteProps> = ({ note, isRoot }) => {
    return <span className={`note${nullableClassName(isRoot, ' root', '')}`}>{note}</span>
}