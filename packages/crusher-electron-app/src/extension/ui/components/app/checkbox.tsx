import React, {useState} from "react";

interface ICheckboxProps {
    labelText: string;
    id: string;
};

const Checkbox = (props: ICheckboxProps) => {
    const {labelText, id} = props;

    return (
        <div>
            <input type="checkbox" id={id}/>
            <label htmlFor={id} style={checkBoxLabelStyle}>{labelText}</label>
        </div>
    )
}

const checkBoxLabelStyle = {
    marginLeft: 12,
    fontSize: 15,
};

export {Checkbox};