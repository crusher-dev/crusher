import { css } from "@emotion/react";

type TPagination = {
	isPreviousActive: boolean;
	isNextActive: boolean;
	onPreviousClick: Function;
	onNextClick: Function;
} & React.DetailedHTMLProps<any, any>;

export const PaginationButton = ({ isPreviousActive = true, isNextActive = true, onPreviousClick, onNextClick }: TPagination) => {
	return (
		<div className={"flex"} css={pagination}>
			<div
				css={[button, !isPreviousActive && disabled]}
				onClick={() => {
					if (!isPreviousActive) return;
					onPreviousClick();
				}}
				id={"left-button"}
			>
				Previous
			</div>
			<div
				css={[button, rightButton, !isNextActive && disabled]}
				onClick={() => {
					if (!isNextActive) return;
					onNextClick();
				}}
				id={"right-button"}
			>
				Next
			</div>
		</div>
	);
};

export const pagination = css`
	#left-button {
		border-top-left-radius: 4rem;
		border-bottom-left-radius: 4rem;
	}
	#right-button {
		border-top-right-radius: 4rem;
		border-bottom-right-radius: 4rem;
		border-left-width: 0;
	}
`;

const button = css`
	background-color: #1e242c;
	border: 1rem solid #2e3744;
	height: 32rem;
	width: 112rem;
	font-size: 13rem;
	display: flex;
	color: #7086ff;
	font-weight: 600;
	align-items: center;
	padding-top: 2rem;
	justify-content: center;
	:hover {
		background-color: #1b1d1f;
		border: 1rem solid #2a2e38;
	}
`;
const disabled = css`
	color: #424c86;
	background-color: #0a0b0e !important;
	border: 1rem solid #2e3744;
	cursor: not-allowed;
`;

const rightButton = css`
	border-left-width: 0 !important;
`;
