import { css } from "@emotion/react";
import React from "react";

const QuestionPrompt = ({ className, defaultValue, callback, ...props }: { className?: any; defaultValue?: any; callback: any }) => {
	const [isYes, setIsYes] = React.useState(defaultValue || null);

	const handleSelect = React.useCallback((value) => {
		setIsYes(value);
		callback(value);
	}, []);

	return (
		<div css={[developerQuestionCss]} className={String(className)}>
			<div css={titleContainerCss}>
				<div css={headingCss}>Are you a developer</div>
				<div css={titleTaglineCss}>run commands in terminal</div>
			</div>
			<div css={yesNoButtonContainerCss} {...props}>
				<div css={[yesNoButtonCss, isYes ? selectedButtonCss : undefined]} onClick={handleSelect.bind(this, true)}>
					{isYes ? <SelectedIcon css={selectedIconCss} /> : ""}
					<span>Yes</span>
				</div>
				<div css={[yesNoButtonCss, !isYes ? selectedButtonCss : undefined]} onClick={handleSelect.bind(this, false)}>
					{!isYes ? <SelectedIcon css={selectedIconCss} /> : ""}
					<span>No</span>
				</div>
			</div>
		</div>
	);
};

const titleContainerCss = css`
	display: flex;
	flex-direction: column;
`;

const titleTaglineCss = css`
	margin-top: 6rem;
`;

const developerQuestionCss = css`
	border-bottom-color: rgba(255, 255, 255, 0.04);
	border-bottom-style: solid;
	border-bottom-width: 1px;
	padding-bottom: 22px;
	width: 100%;
	transition: transform 0.3s;
	display: flex;
	align-items: center;
`;

const headingCss = css`
	font-family: "Cera Pro";
	font-style: normal;
	font-weight: 800;
	font-size: 18rem;
	/* identical to box height */
	color: #ffffff;
`;

const selectedIconCss = css`
	width: 12px;
	height: 12px;
	position: relative;
	top: 1.4px;
`;

const yesNoButtonContainerCss = css`
	display: flex;
	gap: 12px;
	margin-left: auto;
`;

const yesNoButtonCss = css`
	border: 0.5px solid #212121;
	border-radius: 23423px;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	text-align: center;

	color: #ffffff;
	padding: 6px 4px;
	width: 116px;
	display: flex;
	justify-content: center;

	:hover {
		opacity: 0.8;
	}
`;

const SelectedIcon = (props) => (
	<svg viewBox={"0 0 12 12"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 6a6 6 0 1 1 12 0A6 6 0 0 1 0 6Zm8.224-1.624a.6.6 0 0 1 0 .848l-2.21 2.21a.87.87 0 0 1-1.229 0l-1.01-1.01a.6.6 0 1 1 .85-.848l.775.775 1.976-1.975a.6.6 0 0 1 .848 0Z"
			fill="#fff"
		/>
	</svg>
);

const selectedButtonCss = css`
	background: linear-gradient(0deg, #9651ef, #9651ef), linear-gradient(0deg, #8c45e8, #8c45e8), #cd60ff;
	border: 1px solid rgba(169, 84, 255, 0.4);
	gap: 8px;
	:hover {
		opacity: 1;
	}
`;

export { QuestionPrompt };
