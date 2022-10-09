import { css } from "@emotion/react";
import React from "react";

const NoDeveloperInput = () => {
	const mainRef = React.useRef(null);

	return (
		<div ref={mainRef} css={[contentCss]}>
			<div css={mainContainerCss}>
				<div css={titleContainerCss}>
					<div css={headingCss}>download binary</div>
					<div css={titleTaglineCss}>with recorder you can create and run test</div>
				</div>

				<div css={downloadButtonContainerCss}>
					<a href="https://docs.crusher.dev/getting-started/create-your-first-test#or-install-recorder" target="_blank">
						<div css={downloadButtonCss}>
							download
							<DownloadIcon />
						</div>
					</a>
				</div>
			</div>

			<div css={waitinContainerCss}>
				<div css={waitingLeftContainerCss}>
					<ClockIcon css={clockIconCss} />
					<div>Waiting for a test to be created.</div>
				</div>

				<div css={howToDoItTextCss}>How to do it?</div>
			</div>
		</div>
	);
};

const downloadButtonCss = css`
	background: linear-gradient(0deg, #9651ef, #9651ef), linear-gradient(0deg, #8c45e8, #8c45e8), #cd60ff;
	border: 0.5px solid rgba(169, 84, 255, 0.4);
	border-radius: 8px;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;
	text-align: center;

	color: #ffffff;
	display: flex;
	gap: 10rem;
	padding: 8rem 10rem;
	:hover {
		opacity: 0.8;
	}
`;
const DownloadIcon = (props) => (
	<svg width={15} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.564.186C3.172.046 3.896 0 4.734 0h1.212C6.7 0 7.401.39 7.818 1.039l.61.948c.139.216.373.346.623.346h3.791c1.198 0 2.17.981 2.158 2.244-.014 1.505-.002 3.01-.002 4.514 0 .868-.044 1.619-.18 2.25-.136.639-.377 1.2-.801 1.641-.425.44-.967.69-1.584.832-.607.14-1.331.186-2.169.186h-5.53c-.838 0-1.562-.046-2.17-.186-.616-.142-1.158-.391-1.583-.832-.425-.44-.665-1.002-.802-1.642C.044 10.71 0 9.96 0 9.09V4.91c0-.869.044-1.62.179-2.25.137-.64.377-1.202.802-1.642.425-.44.967-.69 1.583-.832ZM8.25 6.222a.764.764 0 0 0-.75-.778.764.764 0 0 0-.75.778v2.4l-.595-.616a.731.731 0 0 0-1.06 0 .798.798 0 0 0 0 1.1L6.922 11a.94.94 0 0 0 .024.025.736.736 0 0 0 .553.252.736.736 0 0 0 .552-.252.94.94 0 0 0 .025-.025l1.828-1.895a.798.798 0 0 0 0-1.1.731.731 0 0 0-1.06 0l-.595.616v-2.4Z"
			fill="#fff"
		/>
	</svg>
);

const mainContainerCss = css`
	display: flex;
	align-items: center;
`;
const downloadButtonContainerCss = css`
	margin-left: auto;
`;
const titleContainerCss = css`
	display: flex;
	flex-direction: column;
`;

const titleTaglineCss = css`
	margin-top: 6rem;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 12rem;
	letter-spacing: 0.03em;

	color: rgba(255, 255, 255, 0.35);
`;

const clockIconCss = css`
	width: 16rem;
`;
const waitinContainerCss = css`
	display: flex;
	align-items: center;
	margin-top: 100rem;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	letter-spacing: 0.01em;

	color: rgba(255, 255, 255, 0.62);
`;
const waitingLeftContainerCss = css`
	display: flex;
	align-items: center;
	gap: 8rem;
`;
const howToDoItTextCss = css`
	margin-left: auto;
`;
const ClockIcon = (props: any) => (
	<svg viewBox={"0 0 16 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm.8 4a.8.8 0 1 0-1.6 0v4a.8.8 0 1 0 1.6 0V4ZM14.195.195a.667.667 0 0 0 0 .943l.667.667a.667.667 0 1 0 .943-.943l-.667-.667a.667.667 0 0 0-.943 0Z"
			fill="#D0D0D0"
		/>
	</svg>
);

const headingCss = css`
	font-family: "Cera Pro";
	font-style: normal;
	font-weight: 800;
	font-size: 18rem;
	/* identical to box height */
	color: #ffffff;
`;
const contentCss = css`
	margin-top: 20px;
	width: 100%;
	padding-top: 34px;
	transition: height 0.3s;
	overflow: hidden;
`;

export { NoDeveloperInput };
