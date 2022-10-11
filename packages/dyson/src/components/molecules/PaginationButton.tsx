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
		border-top-left-radius: 10rem;
		border-bottom-left-radius: 10rem;
	}
	#right-button {
		border-top-right-radius: 10rem;
		border-bottom-right-radius: 10rem;
		border-left-width: 0;
	}
`;

const button = css`
	background-color: rgba(255,255,255,0.04);
	
	border: .5rem solid rgba(255,255,255,0.10);
	height: 36rem;
	width: 100rem;
	font-size: 13rem;
	display: flex;
	color: #c2c2c2;
	font-weight: 600;
	align-items: center;
	padding-top: 2rem;
	justify-content: center;
	:hover {
		background-color: rgba(255,255,255,0.07);
		border: .5rem solid rgba(255,255,255,0.10);
	}
	transition: background 150ms ease-out, border 150ms ease-out, transform 150ms ease-out;
`;
const disabled = css`
	color: #c2c2c2;
	border: .5rem solid rgba(255,255,255,0.10);
	cursor: not-allowed;
`;

const rightButton = css`
	border-left-width: 0 !important;
`;
