import React from "react";
import { css } from "@emotion/react";
import { Button } from "@dyson/components/atoms/button/Button";

export const ActionButton = ({ title, className, onClick } :any) => {
	return (
        (<Button
			id={"verify-save-test"}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(e);
			}}
			className={String(className)}
			bgColor="tertiary-outline"
			css={saveButtonStyle}
		>
            <span>{title}</span>
        </Button>)
    );
};

const saveButtonStyle = css`
	width: 92rem;
	height: 30rem;
	background: #a966ff;
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
	}
`;
