import { Tone } from "@src/lib/notes";
import { nullable } from "@src/utils/nullable";
import { useMemo } from "react";
import { Note } from "./Note";

interface FretProps {
    size: number;
    empty?: boolean;
    tone?: Tone;
    isRoot?: boolean;
}

export const Fret: React.FC<FretProps> = ({ size, tone, isRoot }) => {
    const styles = useMemo(
        () => ({
            width: `${size}px`,
        }),
        [size]
    );
    return (
        <span className="fret" style={styles}>
            {nullable(tone, (t) => <Note note={t.note} isRoot={isRoot} />)}
        </span>
    );
};
