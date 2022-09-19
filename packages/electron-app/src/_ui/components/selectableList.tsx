import React from "react";
import { useStore } from "react-redux";
import { css } from "@emotion/core";
import { useSelectableList } from "../hooks/list";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";

interface IProps {
    className?: string;
    items?: Array<{content: any}>;
}
const ListBox = ({className, items, ...props}: IProps) => {
    const {selectedList, isItemSelected, resetSelected, toggleSelectAll, toggleSelectItem} = useSelectableList();
    const listItems = React.useMemo(() => {
        if(!items) return null;
        return items.map((item, index) => {
            return (
                <ListItem onClick={toggleSelectItem.bind(this, index)} isActive={isItemSelected(index)} key={index}>
                    {item.content}
                </ListItem>
            )
        });
    }, [selectedList, toggleSelectItem, items]);

    const handleOutSideClick = React.useCallback(() => {
        resetSelected();
    }, [resetSelected]);
    return (
        <OnOutsideClick onOutsideClick={handleOutSideClick}>
            <div css={testsCountCss}>{items.length} tests</div>
            <ul css={listCss}>
                { listItems }
            </ul>
        </OnOutsideClick>
	);
};

const testsCountCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.67);
    padding: 0px 46px;
    border-bottom: 1px solid rgba(153, 153, 153, 0.09);
    padding-bottom: 6rem;
`;
const listCss = css`
    height: 100%;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.03em;

    color: #ffffff;
    height: 38rem;

    li {
        padding: 6px 46px;
        padding-right: 40px;
        position: relative;
        display: flex;
        align-items: center;
    }
`;
const ListItem = ({ isActive, children, onClick, ...props }) => {    
    const itemStyle = React.useMemo(() => itemCss(isActive), [isActive]);
    const handleOnClick = React.useCallback((e) => {
        onClick(e);
    }, [onClick]);
    return (
        <li css={itemStyle} onClick={handleOnClick}>
            {children}
        </li>
    )
};

const itemCss = (isActive) => css`
    position: relative;
    background: ${isActive ? "rgba(199, 81, 255, 0.14)": "none"};
    color: ${isActive ? "#fff" : "#A6A6A6"};
    border-bottom: 1px solid rgba(153, 153, 153, 0.09);

    :hover {
        background: ${isActive ? `rgba(199, 81, 255, 0.14)` : `linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03)), rgba(54, 54, 54, 0.2)`} !important;
    }
`;
export { ListBox };