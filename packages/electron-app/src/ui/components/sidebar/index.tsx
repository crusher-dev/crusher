import React, { memo } from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { getRecorderInfo, getRecorderState } from "../../../store/selectors/recorder";
import { Conditional } from "@dyson/components/layouts";
import { ActionsPanel } from "./actionsPanel";
import { StepsPanel } from "./steps";
import { TemplatesModal } from "./steps/templatesModal";
import { CypressIcon, LinkIcon, PuppeteerIcon, SeleniumIcon } from "../../icons";
import { Button, Input } from "@dyson/components/atoms";
import { ModalManager } from "../modals/";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";

const TEMPlATES = [
	{ text: "Check for broken links in the page", id: 1 },
	{ text: "Check UI of major components", id: 2 },
	{ text: "Check for accessibility issues", id: 3 },
	{ text: "Measure performance of a page", id: 4 },
	{ text: "Verify SEO of a page", id: 5 },
];

const GettingStartedSidebar = () => {
	return (
		<div
			css={css`
				height: 100%;
				width: 100%;
				padding: 28rem;
				display: flex;
				flex-direction: column;
			`}
		>
			<div
				css={css`
					font-size: 16rem;
					font-family: Cera Pro;
					font-weight: 600;
				`}
			>
				Getting Started
			</div>
			<div
				css={css`
					margin-top: 40rem;
				`}
			>
				<div
					css={css`
						font-size: 15rem;
						font-family: Cera Pro;
						font-weight: 600;
					`}
				>
					Import your tests
				</div>
				<div
					css={css`
						margin-top: 10rem;
						font-family: Cera Pro;
						font-size: 12.8rem;
						color: rgba(255, 255, 255, 0.48);
						line-height: 18rem;
					`}
				>
					Schedule a short demo call to migrate your test {"\n"} in few hours
				</div>
				<div
					css={css`
						margin-top: 17rem;
						display: flex;
					`}
				>
					<SeleniumIcon
						css={css`
							width: 18rem;
							:hover {
								opacity: 0.9;
							}
						`}
					/>
					<CypressIcon
						css={css`
							width: 18rem;
							margin-left: 18rem;
							:hover {
								opacity: 0.9;
							}
						`}
					/>
					<PuppeteerIcon
						css={css`
							width: 18rem;
							margin-left: 18rem;
							:hover {
								opacity: 0.9;
							}
						`}
					/>
				</div>
				<div
					css={css`
						margin-top: 30rem;
					`}
				>
					<Button css={buttonStyle} onClick={() => {}}>
						Setup meet with our engineer
					</Button>
				</div>
			</div>
			<div
				css={css`
					margin-top: 70rem;
				`}
			>
				<div
					css={css`
						font-size: 15rem;
						font-family: Cera Pro;
						font-weight: 600;
					`}
				>
					Create quick test with template
				</div>
				<div
					css={css`
						margin-top: 10rem;
						font-family: Cera Pro;
						font-size: 12.8rem;
						color: rgba(255, 255, 255, 0.48);
						line-height: 18rem;
					`}
				>
					Looking for head start? Our recommend quick{"\n"} test will help integrate few tests
				</div>
				<div
					css={css`
						margin-top: 17rem;
					`}
				>
					<Input css={inputStyle} placeholder={"Search for templates"} size={"medium"} onChange={() => {}} />
				</div>
				<div
					css={css`
						margin-top: 50rem;
					`}
				>
					{TEMPlATES.map((item: any, index: number) => {
						return (
							<div
								key={index}
								css={[
									css`
										display: flex;
										align-items: center;
										:hover {
											opacity: 0.9;
										}
									`,
									index !== 0
										? css`
												margin-top: 24rem;
										  `
										: null,
								]}
							>
								<LinkIcon
									css={css`
										width: 12rem;
									`}
								/>
								<span
									css={css`
										margin-left: 18rem;
										color: rgba(255, 255, 255, 0.53);
										font-family: Gilroy;
										font-size: 13.5rem;
									`}
								>
									{item.text}
								</span>
							</div>
						);
					})}
				</div>
			</div>
			<div
				css={css`
					margin-top: auto;
				`}
			>
				<Button css={[buttonStyle, skipButtonStyle]} onClick={() => {}}>
					Skip, I’m already familiar
				</Button>
			</div>
		</div>
	);
};

const Sidebar = ({ className, ...props }: any) => {
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const IS_GETTING_STARTED = false;
	

	return (
		<div css={[containerStyle, IS_GETTING_STARTED ? gettingStartedContainerStyle : null]} className={`${className}`}>
			{/* <GettingStartedSidebar /> */}
			{recorderInfo.device ? (
				<>
					{recorderState.type !== TRecorderState.CUSTOM_CODE_ON ? (<ActionsPanel />): (
						<div css={css`display: flex; flex: 1; flex-direction: column; padding: 30rem 24rem;`}>
							<div>
								<div css={css`font-family: Gilroy;
font-style: normal;
font-weight: 700;
font-size: 15rem;`}>Coding mode enabled</div>
								<div css={css`margin-top: 4rem;font-family: Gilroy;
font-style: normal;
font-weight: 400;
font-size: 12rem;     color: rgba(255,255,255,0.9);` }>No manual actions are allowed.</div>
							</div>
						</div>
					)}
					
					<StepsPanel />
				</>
			): ""}
			<ModalManager />
			<TemplatesModal isOpen={false} handleClose={() => {}} />
		</div>
	);
};
const inputStyle = css`
	outline: none;
	input {
		background: none;
	}
`;
const buttonStyle = css`
	font-size: 13rem;
	border: 1rem solid rgba(196, 196, 196, 0.15);
	box-sizing: border-box;
	border-radius: 4rem;
	height: 34rem;
	padding: 4rem 8rem;
	min-width: 100rem;
	background: transparent;
	width: 100%;
	:hover {
		opacity: 0.9;
		background: transparent;
		border: 1rem solid rgba(196, 196, 196, 0.15);
	}
`;
const skipButtonStyle = css`
	background: rgba(105, 147, 255, 0.06);
	:hover {
		background: rgba(105, 147, 255, 0.06);
	}
`;
const containerStyle = css`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	overflow: hidden;
	position: relative;
	z-index: 1000;
	background-color: #111213;
`;
const gettingStartedContainerStyle = css`
	background-color: #070709;
`;

export { Sidebar };
export default memo(Sidebar);