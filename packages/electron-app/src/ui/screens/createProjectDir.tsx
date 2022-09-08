import { css } from "@emotion/react";
import React from "react";

import Checkbox from "@dyson/components/atoms/checkbox/checkbox";
import { Text } from "@dyson/components/atoms/text/Text";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "../components/create-first-test";
import { GithubIconV2 } from "../icons";
import { ModelContainerLayout } from "../layouts/modalContainer";

function CreateProjectDirScreen() {
	const navigate = useNavigate();
	const [dontShowAgain, setDontShowAgain] = React.useState(false);

	const handleGoBack = () => {
		navigate("/select-project");
	};

	const handleNo = React.useCallback(() => {
		alert("No go away!");
	}, []);

	const handleYes = React.useCallback(() => {
		alert("Yes create");
	}, [])

	const handleCheckboxCallback = React.useCallback((selected) => {
		setDontShowAgain(!dontShowAgain);
	}, [dontShowAgain]);

	React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);
	return (
		<ModelContainerLayout title={<div css={titleStyle}>Home</div>}>
			<div css={containerStyle}>
                <div css={css`display: flex; align-items: center; justify-content: cetner;`}>
                    <GithubIconV2 css={css`width: 27rem;`}/>
                </div>
				<div css={contentHeadingStyle}>Should we create a project (docsv2) for this dir?</div>
				<div css={contentDescriptionStyle}>We detected git repo. Should be create new project.</div>
				<div css={actionBarStyle}>
					<ActionButton title={"No"} onClick={handleNo} css={noButtonStyle} />
					<ActionButton title={"Yes"} onClick={handleYes} css={yesButtonStyle} />
				</div>
				<div css={checkboxContainerStyle}>
					<Checkbox isSelected={dontShowAgain} callback={handleCheckboxCallback} />
					<Text css={checkBoxTextStyle} onClick={handleCheckboxCallback}>Don’t show this prompt again</Text>
				</div>
			</div>
		</ModelContainerLayout>
	);
}

const checkboxContainerStyle = css`
	display: flex;
	justif-content: center;
	gap: 8rem;
	margin-top: 36rem;
	align-items: center;
`;
const checkBoxTextStyle = css`
font-family: Gilroy;
font-style: normal;
font-weight: 400;
font-size: 13rem;
color: #FFFFFF;
position: relative;
top: 1rem;
`;
const actionBarStyle  =css`display: flex; margin-top: 26rem; justify-content: center; gap: 14rem;`;

const noButtonStyle = css`background: #494949 !important; :hover {border-color:  #494949 !important;}`;
const yesButtonStyle = css``;

const containerStyle = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	padding-bottom: 120rem;
`;

const titleStyle = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;
`;

const contentHeadingStyle = css`
	margin-top: 28rem;
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 900;
	font-size: 18rem;
	text-align: center;
	letter-spacing: 0.1px;
    margin-top: 22rem;
	color: #ffffff;
`;
const contentDescriptionStyle = css`
	margin-top: 10rem;

	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	text-align: center;
	letter-spacing: 0.2px;
	color: rgba(255, 255, 255, 0.64);
`;

const testItemStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	letter-spacing: 0.03em;

	color: #ffffff;

	li {
		padding: 14px 24px;
		position: relative;
		.action-buttons {
			display: none;
		}
		:hover {
			background: rgba(217, 217, 217, 0.04);
			color: #9f87ff;
			.action-buttons {
				display: block;
			}
		}
	}
`;

export default React.memo(CreateProjectDirScreen);
