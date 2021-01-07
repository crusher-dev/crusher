import Richie from "../../../../public/assets/img/illustration/richie.png";
import { css } from "@emotion/core";

function CreditPopup() {
	return (
		<div css={popupCSS}>
			<div
				css={css`
					width: 50%;
				`}
			>
				<h1 css={headingCSS}>Get 300$ credits</h1>
				<p css={headingCSS}>Enjoying Crusher?</p>
				<p css={paraCSS}>
					You get 300$ when someone you invite signs up to the pro plan
				</p>
				<button css={buttonCSS}>Invite</button>
			</div>
			<img src={Richie} />
		</div>
	);
}

const popupCSS = css`
	display: flex;
	width: 30rem;
	height: 15rem;
	justify-content: center;
	align-items: center;
	background: #ffffff;
	border: 2px solid #d5d5d5;
	box-sizing: border-box;
	padding: 5px;
	margin: 0;
	border-radius: 1.125rem;
`;

const buttonCSS = css`
	width: 10rem;
	height: 2rem;
	background: linear-gradient(180deg, #ff6262 0%, #ff55a7 100%);
	border: 1.5px solid #ff7e7f;
	box-sizing: border-box;
	border-radius: 4px;
	text-align: center;
	color: white;
`;

const headingCSS = css`
	font-family: Gilroy;
	font-size: 1.125rem;
	line-height: 1.2rem;
	font-weight: bold;
	color: #222d37;
`;

const paraCSS = css`
	font-family: Gilroy;
	font-size: 1rem;
	line-height: 1.125rem;
`;

export default CreditPopup;