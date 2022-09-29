import React from "react";
import { css } from "@emotion/react";
import { PointerIcon } from "../../constants/icons";
import { Conditional } from "@dyson/components/layouts";

interface IProps {
    className?: any;
    children?: any;
    showExternalIcon?: boolean;
    onClick?: any;
}
const LinkPointer = ({ children, showExternalIcon = true, className, ...props }: IProps) => {
    const { onClick } = props;
    return (
        <div className={`${className}`} onClick={onClick} css={containerCss}>
            {children}
            <Conditional showIf={showExternalIcon}>
                <PointerIcon css={pointerIconCss} />
            </Conditional>
        </div>
    )
};

const containerCss = css`
    display: flex;
    align-items: center;
    padding: 6rem 6rem;
    :hover  {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), #131314;
        border-radius: 6px;
    }
`;
const pointerIconCss = css`
    width: 7.3rem;
    height: 7.1rem;
    margin-left: 5.25px;
`;

export { LinkPointer };