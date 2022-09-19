import React from "react";
import { useStore } from "react-redux";
import { css } from "@emotion/core";
import { useSelectableList } from "../hooks/list";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { RightClickMenu } from "@dyson/components/molecules/RightClick/RightClick";

interface IProps {
    className?: string;
    selectedHeaderActions: any;
    items?: Array<{ content: any; id: any; }>;
    contextMenu?: {callback?: any; menuItems?: any};
}
const ListBox = ({ className, contextMenu, selectedHeaderActions: SelectedHeaderActions, items, ...props }: IProps) => {
    const { selectedList, selectItem, isItemSelected, resetSelected, toggleSelectAll, toggleSelectItem } = useSelectableList();
    const listItems = React.useMemo(() => {
        if (!items) return null;
        return items.map((item, index) => {
            return (
                <ListItem key={item.id} onContextMenu={selectItem.bind(this, item.id)} onClick={toggleSelectItem.bind(this, item.id)} isActive={isItemSelected(item.id)}>
                    {item.content(isItemSelected)}
                </ListItem>
            )
        });
    }, [selectedList, isItemSelected, toggleSelectItem, selectItem, items]);

    const handleOutSideClick = React.useCallback(() => {
        // @Note: setTimeOut is here as an hack, to
        // allow selectedList to be sent to contextMenu onClick
        setTimeout(() => {
            resetSelected();
        }, 100);
    }, [resetSelected]);

    const menuItemsComponent = React.useMemo(() => {
        if(!contextMenu?.menuItems) return null;
        return contextMenu.menuItems.map((item) => {
            return {
                type: "menuItem",
                value: item.label,
                rightItem: item.shortcut,
                onClick: contextMenu.callback.bind(this, item.id, selectedList)
            }
        });
    }, [selectedList, contextMenu.callback, contextMenu.menuItems]);

    return (
        <OnOutsideClick onOutsideClick={handleOutSideClick}>
            <div css={headerCss}>
                <div css={testsCountCss}>{items.length} tests</div>
                <SelectedHeaderActions toggleSelectAll={toggleSelectAll} items={items} selectedList={selectedList} />
            </div>

            <RightClickMenu menuItems={menuItemsComponent}>
                <ul css={listCss}>
                    {listItems}
                </ul>
            </RightClickMenu>
        </OnOutsideClick>

    );
};

const headerCss = css`
    display: flex;
    padding-right: 41px;
    border-bottom: 1px solid rgba(153, 153, 153, 0.09);
    padding-bottom: 12rem;
    height: 30px;
`;
const testsCountCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.67);
    padding: 0px 46px;
`;
const listCss = css`
user-select: none;
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
        <li css={itemStyle} onClick={handleOnClick} {...props}>
            {children}
        </li>
    )
};

const itemCss = (isActive) => css`
    position: relative;
    background: ${isActive ? "rgba(199, 81, 255, 0.14)" : "none"};
    color: ${isActive ? "#fff" : "#A6A6A6"};
    border-bottom: 1px solid rgba(153, 153, 153, 0.09);

    :hover {
        background: ${isActive ? `rgba(199, 81, 255, 0.14)` : `linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03)), rgba(54, 54, 54, 0.2)`} !important;
    }
`;
export { ListBox };