import { css } from "@emotion/core";

export default function TypeOfProject(props: any) {
	const { title, cards } = props;
	return (
		<div css={sectionCSS}>
			<p css={titleCSS}>{title}</p>
			<div
				css={css`
                    display: flex;
                    flex-wrap: wrap;
                    max-width: 75%;
				`}
			>
				{cards.map((card: any) => returnCard({ ...card }))}
			</div>
		</div>
	);
}

function returnCard({ cardIllustration, cardName, cardDescription }) {
	return (
		<div css={cardCSS}>
			<img src={cardIllustration} css={imageCSS} />
			<div css={cardTextCSS}>
				<strong>{cardName}</strong>
				<p>{cardDescription}</p>
			</div>
		</div>
	);
}

const sectionCSS = css`
	display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
`;

const titleCSS = css`
	margin-top: 1rem;
	font-family: Gilroy;
	font-size: 1.125rem;
	line-height: 2rem;
	color: #2b2b39;
	font-weight: 500;
`;

const imageCSS = css`
	height: 2.5rem;
	width: 2.5rem;
	border-radius: 0.13rem;
`;

const cardTextCSS = css`
	display: flex;
	flex-direction: column;
	margin: 1rem;
`;

const cardCSS = css`
	display: flex;
	align-items: center;
	height: 4rem;
    width: 17rem;
	border: 1px solid #c4c4c4;
	box-sizing: border-box;
	border-radius: 4px;
	padding: 1rem;
    margin-top: 0.5rem;
    margin-right: 2.5rem;
`;
