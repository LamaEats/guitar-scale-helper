import React from "react";

import { NotesCircle, Tone } from "@src/lib/notes";
import { Scale, scaleType } from "@src/lib/scale";
import { useMemo } from "react";
import { Fret } from "./Fret";

interface FretSegmentProps {
    root: Tone;
    open: Tone;
    frets: number;
    scaleSteps: number[];
}

const mod = Math.pow(2, 1 / 12) - 1;

const calcFretsSize = (count: number): number[] => {
    let current = 64;

    const sizes: number[] = [16];

    for (let i = 0; i < count; i += 1) {
        sizes.push(current);
        current = current - current * mod;
    }

    return sizes;
}

export const FretSegment: React.FC<FretSegmentProps> = ({ root, frets, open, scaleSteps }) => {
    const circle = useMemo(() => new NotesCircle(open), [open]);
    const scale = useMemo(() => new Scale(root.note, scaleSteps), [root, scaleSteps]);
    const sizes = calcFretsSize(frets);
    return (
        <div className="frets">
            {circle.map((tone, i) => {
                const key = `${root.note}:${i}:${tone.note}`;
                const size = sizes[i];

                if (scale.includes(tone)) {
                    return <Fret key={key} size={size} tone={tone} isRoot={scale.isRootNote(tone)} />
                }

                return <Fret key={key} size={size} />;
            }, frets)}
        </div>
    );
};
