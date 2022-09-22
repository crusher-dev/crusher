import React from "react";
import { css } from "@emotion/react";
import Checkbox from "@dyson/components/atoms/checkbox/checkbox";


interface IProps {
    className?: string;
    onClick?: any;
    items?: Array<{ content: any; id: any; }>;
    selectAllCallback?: any;
    hideCheckBoxTop?: boolean;
}
const NormalList = ({ className, hideCheckBoxTop = false, selectAllCallback, onClick, items, ...props }: IProps) => {
    const [shouldSelectAll, setShouldSelectAll] = React.useState(false);

    const listItems = React.useMemo(() => {
        if (!items) return null;
        return items.map((item, index) => {
            return (
                <ListItem key={item.id} onClick={onClick.bind(this, item.id)}>
                    {item.content}
                </ListItem>
            )
        });
    }, [onClick, items]);

    const handleSelectAll = React.useCallback((shouldSelect) => {
        setShouldSelectAll(shouldSelect);
        selectAllCallback(shouldSelect);
    }, [selectAllCallback]);

    return (<>
        <div css={headerCss}>
            <Checkbox css={[checkboxCss, hideCheckBoxTop && hideCheckbox]} callback={handleSelectAll} isSelectAllType={false} isSelected={shouldSelectAll} />
            <div css={testsCountCss}>{items.length} projects</div>
        </div>
        <ul className={`${className}`} css={listCss} {...props}>
            {listItems}
        </ul>
    </>
    );
};

const hideCheckbox = css`
	visibility: hidden;
`

const checkboxCss = css`
.checkbox-container {
    border-radius: 6rem;
}
`;

const headerCss = css`
    display: flex;
    padding-right: 41px;
    padding-left: 18px;
    border-bottom: 1px solid rgba(153, 153, 153, 0.09);
    padding-bottom: 12rem;
    height: 30px;
    align-items: center;
`;
const testsCountCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.67);
    padding: 0px 13px;
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
        position: relative;
        display: flex;
        align-items: center;
    }
`;
const ListItem = ({ isActive, children, onClick, ...props }) => {
    const itemStyle = React.useMemo(() => itemCss(isActive), [isActive]);

    return (
        <li css={itemStyle} onClick={onClick} {...props}>
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
export { NormalList };