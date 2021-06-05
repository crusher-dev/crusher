import React from "react";
import { useState } from "react";
import { css } from "@emotion/core";
import CreateTestPageIllustration from "../../../../public/assets/img/illustration/createTestPageIllustration.png";
import AddIcon from "../../../svg/roundAdd.svg";
import { WatchVideoModal } from "@ui/containers/modals/watchVideoModal";

const EmptyTestListContainer = (props: any) => {
	const { onCreateTest } = props;

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div css={containerCSS}>
			<WatchVideoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

			<img src={CreateTestPageIllustration} css={imageCSS} />
			<p css={fightBugsCSS}>Create a test to fight bugs and downtime</p>
			<p css={easyToCreateTestCSS}>{"It's easy to create a test. It just takes a few seconds!"}</p>

			<div css={buttonsDivCSS}>
				<button
					css={[buttonCSS, watchButtonCSS]}
					onClick={() => {
						setIsOpen(true);
					}}
				>
					Watch Tutorial
				</button>
				<button css={[buttonCSS, createTestButtonCSS]} onClick={onCreateTest}>
					{" "}
					<AddIcon css={createTestImageCSS} />
					Create a Test
				</button>
			</div>
		</div>
	);
};

const containerCSS = css`
	display: flex;
	align-items: center;
	flex-direction: column;
	height: 100%;
	justify-content: center;
`;

const imageCSS = css`
	width: 13.5rem;
	height: 13.5rem;
	margin: 2.5rem;
`;

const createTestImageCSS = css`
	width: 1rem;
	height: 1rem;
	z-index: 10;
`;

const fightBugsCSS = css`
	font-family: Cera Pro;
	font-weight: 900;
	font-size: 1.5rem;
	line-height: 2rem;
	text-align: center;
	margin-bottom: 1rem;
`;

const easyToCreateTestCSS = css`
	font-family: Gilroy;
	font-size: 1rem;
	line-height: 1.25rem;
	margin-bottom: 1.5rem;
`;

const buttonCSS = css`
	color: white;
	border-radius: 5px;
	width: 10.2rem;
	height: 2.5rem;
	font-family: Gilroy;
	font-weight: 500;
	font-size: 1rem;
	line-height: 1.125rem;
	letter-spacing: -0.02rem;
`;

const buttonsDivCSS = css`
	display: flex;
	margin-top: 0.5rem;
	margin-bottom: 4rem;
`;

const watchButtonCSS = css`
	background: #3c3c40;
	border: 1px solid #3c3c40;
	box-sizing: border-box;
	margin-right: 2rem;
`;

const createTestButtonCSS = css`
	background: #5b76f7;
	border: 1px solid #3f60f5;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: space-around;
`;

export { EmptyTestListContainer };
