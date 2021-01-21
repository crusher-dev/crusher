import { css } from "@emotion/core";

export default function TypeOfProject(props: any) {
	const { title, cards, onSelect, selectedID } = props;

	function handleOnClick(e: any) {
		const { id } = e.target;
		onSelect(id);
	}

	return (
		<div css={sectionCSS}>
			<p css={titleCSS}>{title}</p>
			<div css={cardContainerCSS}>
				{cards.map((card: any) => returnCard({ ...card }, selectedID))}
			</div>
		</div>
	);

	function returnCard(
		{ cardIllustration, cardName, cardDescription, cardID },
		selectedID,
	) {
		return (
			<div
				css={[cardCSS, cardID === selectedID ? selectedProjectTypeCSS : null]}
				id={cardID}
				onClick={(e) => handleOnClick(e)}
			>
				<img src={cardIllustration} css={imageCSS} id={cardID} />
				<div css={cardTextCSS} id={cardID}>
					<strong id={cardID}>{cardName}</strong>
					<p id={cardID}>{cardDescription}</p>
				</div>
			</div>
		);
	}
}

const sectionCSS = css`
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;
`;

const cardContainerCSS = css`
	display: flex;
	flex-wrap: wrap;
	max-width: 75%;
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
	z-index: 11;
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
	&:hover {
		cursor: pointer;
	}
`;

const selectedProjectTypeCSS = css`
	background: rgba(101, 131, 254, 0.1);
	border: 2px solid rgba(101, 131, 254, 0.9);
	border-radius: 4px;
`;
