import { css } from "@emotion/react";

export const Card = ({ css, children, ...props }) => {

	return (
		<div css={[card, css]} {...props}>
			{children}
		</div>
	);
};
const card = css`
	background: #ffffff05 !important;
	border: .5px solid #ffffff15 ;
	border-radius: 16rem;
	padding: 20rem 24rem;
	color: rgba(255, 255, 255, 0.6);

	:hover {
		background: #ffffff05;
	}
	&:not(:first-child) {
		margin-top: 24rem;
	}
`;
