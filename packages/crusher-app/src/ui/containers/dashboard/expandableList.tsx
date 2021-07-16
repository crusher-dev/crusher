import React from "react";
import {css} from "@emotion/core"
import { Conditional } from "dyson/src/components/layouts";
import { CompleteStatusIconSVG } from "@svg/dashboard";

interface IExpandableListItemProps {
    index?: number;
    title: string;
    children: React.ReactNode;
    completed: boolean;
    changeSelected?: any;
    isActive?: boolean;
};

const ExpandableListItem = (props: IExpandableListItemProps) => { 
    const {index, title, isActive, children, completed, changeSelected} = props;
    
    return (
        <div css={itemContainerStyle(!!isActive)} onClick={changeSelected.bind(null, index)}>
            <div className={"flex flex-row items-center"} css={itemHeadingStyle}>
                <span css={itemIndexStyle}>{index! + 1}.)</span>
                <span className={"font-cera"}>{title}</span>
                <div className={"ml-auto"}>
                    <CompleteStatusIconSVG isCompleted={completed} />
                </div>
            </div>
            <Conditional showIf={!!isActive}>
                <>{children}</>
            </Conditional>
        </div>
    );
}

const itemContainerStyle = (isActive: boolean) => css`
    background: ${isActive ? "#101215" : "#0A0B0E"};
    border: 1px solid ${isActive? "inherit": "#171C24"};
    padding: 24rem 26rem;
`;
const itemHeadingStyle = css`
    color: #fff !important;
    font-size: 15.5rem;
`;
const itemIndexStyle = css`
    color: #D0D0D0 !important;
    font-size: 12rem;
    margin-right: 23rem;
`;

interface IExpandableListProps {
    currentSelected: number;
    children: Array<React.ReactElement<IExpandableListItemProps>>;
    changeSelected?: any;
    css?: any;
}

function ExpandableList(props: IExpandableListProps) {
    const {children, currentSelected, changeSelected} = props;

    const childrenArr = children.map((child, index) => React.cloneElement(child, {changeSelected: changeSelected, completed: index < currentSelected, index, isActive: currentSelected === index}));

    return (
        <div {...props} css={listContainerStyle}>
            {childrenArr}
        </div>
    )
}

const listContainerStyle = css`

`;

export {ExpandableList, ExpandableListItem}