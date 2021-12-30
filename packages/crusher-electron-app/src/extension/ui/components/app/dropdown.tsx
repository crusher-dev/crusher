import React, {useRef} from "react";

interface IDropDownProps {
    items: Array<{id: string; label: string;}>;
    onSelect: (id: string) => void;
    onOutSideClick: () => void;
    style?: any;
};

const Dropdown = (props: IDropDownProps) => {
    const ref = useRef(null);
    // Call onOutSideClick when clicked outside this component
    const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
            props.onOutSideClick();
        } 
    };
    // Attach onClickOutside event listener
    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    let {onSelect, style} = props;
    // If style is not defined, set it to empty object
    style = style || {};

    const items = props.items.map(item => {
        // Call the onSelect function when the below li item is clicked
        const onClick = () => onSelect(item.id);

        return (
            <li key={item.id}  className="hoverHighlightEffect" style={dropDownItemStyle} onClick={onClick}>
                {item.label}
            </li>
        );
    });

    return (
        <ul ref={ref} style={{...containerStyle, ...style}}>
            {items}
        </ul>
    );
}

const containerStyle = {
    background: "linear-gradient(0deg, rgba(255, 221, 221, 0.04), rgba(255, 221, 221, 0.04)), #111213",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    padding: "4px 0px",
    color: "#fff",
};

// Create `dropDownItemStyle` object with padding 8px 8px
const dropDownItemStyle = {
    padding: "8px 8px",
    fontSize: 13.5,
    cursor: "default",
};

export {
    Dropdown
};