import React from "react";
import { css } from "@emotion/react";

interface IProps {
	className?: string;
}

const CustomCodeBanner = ({ className }: IProps) => {
	return (
		<div css={containerCss} className={String(className)}>
			<div>
				<div css={mainTextCss}>Coding mode enabled</div>
				<div css={descriptionCss}>No manual actions are allowed.</div>
			</div>
		</div>
	);
};

const containerCss = css`
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 30rem 24rem;
`;
const mainTextCss = css`
	font-weight: 700;
	font-size: 15rem;
`;
const descriptionCss = css`
	font-weight: 400;
	font-size: 12rem;
	margin-top: 4rem;
	color: rgba(255, 255, 255, 0.9);
`;

export { CustomCodeBanner };
