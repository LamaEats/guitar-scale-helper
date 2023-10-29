import { useOutsideClick } from "@src/hooks/useOutsideClick";
import { nullable, nullableClassName } from "@src/utils/nullable";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface DropdownCtx {
    value?: string;
    opened: boolean;
    onChange: (value: string) => void;
    toggle: () => void;
}

const ctx = createContext<DropdownCtx>({
    value: undefined,
    opened: false,
    onChange() {},
    toggle() {},
});

const useCtx = () => {
    const inner = useContext(ctx);

    if (!inner) {
        throw Error("no ctx");
    }

    return inner;
};

const Label: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ctx.Consumer>
            {({ opened }) => (
                <div className={`dropdown__label${opened ? ' active' : ''}`}>{children}</div>
            )}
        </ctx.Consumer>
    )
}

const Panel: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ctx.Consumer>
            {({ opened }) =>
                nullable(opened, () => (
                    <div className="dropdown__panel">{children}</div>
                ))
            }
        </ctx.Consumer>
    );
};
const Control = () => {
    return (
        <ctx.Consumer>
            {({ value, toggle }) => (
                <div className="dropdown__control" onClick={toggle}>
                    {nullable(
                        value,
                        (v) => (
                            <span className="dropdown__control-text">{v}</span>
                        ),
                        <span className="dropdown__control-text muted">No seleceted</span>
                    )}
                </div>
            )}
        </ctx.Consumer>
    );
};

const Item: React.FC<{ value: string }> = ({ value }) => {
    const { toggle, onChange, value: selectedValue } = useCtx();
    const selected = value === selectedValue;
    const handleChange = useCallback(() => {
        onChange(value);
        toggle();
    }, [toggle, onChange, value]);
    return (
        <div className="dropdown__item" onClick={handleChange}>
            <div className={`dropdown__item-text${nullableClassName(selected, " active")}`}>{value}</div>
        </div>
    );
};

interface DropdownProps {
    onChange: (value: string) => void;
    value?: any;
}

interface DropdownFC extends React.FC<PropsWithChildren<DropdownProps>> {
    Panel: typeof Panel;
    Control: typeof Control;
    Item: typeof Item;
    Label: typeof Label
}

export const Dropdown: DropdownFC = ({ children, onChange, value }) => {
    const [selected, setSelected] = useState(() => value);
    const [opened, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => {
        setOpen((p) => !p);
    }, []);

    useEffect(() => {
        if (selected) {
            onChange(selected);
        }
    }, [selected, onChange]);

    useOutsideClick(ref, () => {
        setOpen(false);
    })

    return (
        <ctx.Provider value={{ onChange: setSelected, value: selected, opened, toggle }}>
            <div className="dropdown" ref={ref}>{children}</div>
        </ctx.Provider>
    );
};

Dropdown.Panel = Panel;
Dropdown.Control = Control;
Dropdown.Item = Item;
Dropdown.Label = Label;
