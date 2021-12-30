import { css } from "@emotion/react";

export const Card = ({ css, children, ...props }) => (
	<div css={[card, css]} {...props}>
		{children}
	</div>
);
const card = css`
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;
	border-radius: 8rem;
	padding: 20rem 24rem;
	color: rgba(255, 255, 255, 0.6);

	:hover {
		background: rgba(16, 18, 21, 1);
	}
	&:not(:first-child) {
		margin-top: 24rem;
	}
`;
