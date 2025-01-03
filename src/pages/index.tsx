import { Box } from '@src/components/Box/Box'
import { Container } from '@src/components/Container/Container'
import { Dropdown } from '@src/components/Dropdown/Dropdown'
import { Fretboard } from '@src/components/Fretboard/Fretboard'
import { NoteLetter, Tone, sequence } from '@src/lib/notes'
import { scaleType } from '@src/lib/scale'
import { Tunning, tunning } from '@src/lib/tunning'
import { useCallback, useMemo, useState } from 'react'

const scaleKeys = (Object.keys(scaleType) as (keyof typeof scaleType)[]).reduce(
    (acc, k) => {
        acc[k] = k
        return acc
    },
    {} as Record<keyof typeof scaleType, string>
)

const scaleTitle = {
    [scaleKeys.dorian]: 'Dorian',
    [scaleKeys.frygian]: 'Frygian',
    [scaleKeys.lokrian]: 'Lokrian',
    [scaleKeys.lydian]: 'Lydian',
    [scaleKeys.major]: 'Major',
    [scaleKeys.minor]: 'Minor',
    [scaleKeys.mixolydian]: 'Mixolydian',
    [scaleKeys.minorPentatonic]: 'Minor pentatonic',
}

export default function Home() {
    const [rootNote, setRootNote] = useState(() => new Tone(sequence[0]))
    const [type, setType] = useState<keyof typeof scaleType>(() => 'major')
    const [selectedTune, setSelectedTune] = useState<keyof typeof tunning>(
        () => 'E standart'
    )

    const handleChangeRoot = useCallback((value: string) => {
        setRootNote(new Tone(value as NoteLetter))
    }, [])

    const handleTypeChange = useCallback((value: string) => {
        setType(value as keyof typeof scaleType)
    }, [])

    const handleTuneChange = useCallback((value: string) => {
        setSelectedTune(value as keyof typeof tunning)
    }, [])

    const tune = useMemo(() => {
        return new Tunning(tunning[selectedTune])
    }, [selectedTune])

    return (
        <Container>
            <Box className="settings">
                <Dropdown onChange={handleChangeRoot} value={rootNote.note}>
                    <Dropdown.Label>Key</Dropdown.Label>
                    <Dropdown.Control />
                    <Dropdown.Panel>
                        {sequence.map((note) => (
                            <Dropdown.Item value={note} key={note} />
                        ))}
                    </Dropdown.Panel>
                </Dropdown>
                <Dropdown onChange={handleTypeChange} value={type}>
                    <Dropdown.Label>Scale type</Dropdown.Label>
                    <Dropdown.Control />
                    <Dropdown.Panel>
                        {Object.keys(scaleType).map((k) => (
                            <Dropdown.Item
                                title={scaleTitle[k]}
                                value={k}
                                key={k}
                            />
                        ))}
                    </Dropdown.Panel>
                </Dropdown>
                <Dropdown onChange={handleTuneChange} value={selectedTune}>
                    <Dropdown.Label>Tunning</Dropdown.Label>
                    <Dropdown.Control />
                    <Dropdown.Panel>
                        {Object.keys(tunning).map((k) => (
                            <Dropdown.Item value={k} key={k} />
                        ))}
                    </Dropdown.Panel>
                </Dropdown>
            </Box>
            <Fretboard
                frets={24}
                root={rootNote}
                type={type}
                strings={tune.tune}
            />
        </Container>
    )
}
