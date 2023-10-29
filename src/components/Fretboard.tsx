import { Tone } from "@src/lib/notes";
import { FretSegment } from "./FretSegment";
import { scaleType } from "@src/lib/scale";

type NumericString = `${number}`;

type InstrumentalString<T extends NumericString = NumericString> = Record<T, Tone>;

interface FretboardProps {
    strings: InstrumentalString;
    frets: number;
    root: Tone;
    type: keyof typeof scaleType;
}

export const Fretboard: React.FC<FretboardProps> = ({ strings, frets, root, type }) => {
    return (
        <>
            <div className="fretboard">
                {(Object.keys(strings) as (keyof InstrumentalString)[]).map((key) => (
                    <FretSegment
                        key={`${key}:${strings[key].note}`}
                        root={root}
                        frets={frets}
                        open={strings[key]}
                        scaleSteps={scaleType[type]}
                    />
                ))}
            </div>
        </>
    );
};
