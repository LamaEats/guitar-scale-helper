import { useOutsideClick } from '@src/hooks/useOutsideClick'
import { nullable, nullableClassName } from '@src/utils/nullable'
import cn from 'classnames'
import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

import styles from './Dropdown.module.css'

interface DropdownCtx {
    value?: string
    opened: boolean
    onChange: (value: string) => void
    toggle: () => void
}

const ctx = createContext<DropdownCtx>({
    value: undefined,
    opened: false,
    onChange() {},
    toggle() {},
})

const useCtx = () => {
    const inner = useContext(ctx)

    if (!inner) {
        throw Error('no ctx')
    }

    return inner
}

const Label: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ctx.Consumer>
            {({ opened }) => (
                <div
                    className={cn(styles.Label, {
                        [styles.Active]: opened,
                    })}
                >
                    {children}
                </div>
            )}
        </ctx.Consumer>
    )
}

const Panel: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ctx.Consumer>
            {({ opened }) =>
                nullable(opened, () => (
                    <div className={cn(styles.Panel)}>{children}</div>
                ))
            }
        </ctx.Consumer>
    )
}

const Control = () => {
    return (
        <ctx.Consumer>
            {({ value, toggle }) => (
                <div className={cn(styles.Control)} onClick={toggle}>
                    {nullable(
                        value,
                        (v) => (
                            <span>{v}</span>
                        ),
                        <span>No selected</span>
                    )}
                </div>
            )}
        </ctx.Consumer>
    )
}

const Item: React.FC<{ value: string; title?: string }> = ({
    value,
    title,
}) => {
    const { toggle, onChange, value: selectedValue } = useCtx()
    const selected = value === selectedValue
    const handleChange = useCallback(() => {
        onChange(value)
        toggle()
    }, [toggle, onChange, value])
    return (
        <div onClick={handleChange}>
            <div
                className={cn(styles.ItemText, {
                    [styles.Active]: selected,
                })}
            >
                {title || value}
            </div>
        </div>
    )
}

interface DropdownProps {
    onChange: (value: string) => void
    value?: any
}

interface DropdownFC extends React.FC<PropsWithChildren<DropdownProps>> {
    Panel: typeof Panel
    Control: typeof Control
    Item: typeof Item
    Label: typeof Label
}

export const Dropdown: DropdownFC = ({ children, onChange, value }) => {
    const [selected, setSelected] = useState(() => value)
    const [opened, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const toggle = useCallback(() => {
        setOpen((p) => !p)
    }, [])

    useEffect(() => {
        if (selected) {
            onChange(selected)
        }
    }, [selected, onChange])

    useOutsideClick(ref, () => {
        setOpen(false)
    })

    return (
        <ctx.Provider
            value={{ onChange: setSelected, value: selected, opened, toggle }}
        >
            <div
                className={cn(styles.Dropdown, {
                    [styles.isOpen]: opened,
                })}
                ref={ref}
            >
                {children}
            </div>
        </ctx.Provider>
    )
}

Dropdown.Panel = Panel
Dropdown.Control = Control
Dropdown.Item = Item
Dropdown.Label = Label
