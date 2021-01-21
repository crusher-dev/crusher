import { css } from "@emotion/core";
import GoBack from "../../../public/svg/project/goBack.svg";
import TypeOfProject from "@ui/components/project/TypeOfProject";
import GrayPlaceholder from "../../../public/assets/img/general/grayPlaceholder.png";
import { useState } from "react";
// import Input from "@ui/components/form/Input";

function CreateProject() {
	const [isTextFieldSelected, setIsTextFieldSelected] = useState(false);
	const [textFieldData, setTextFieldData] = useState("");
	const [selectedCardID, setSelectedCardID] = useState("");

	const sectionData = {
		cards: [
			{
				cardIllustration: GrayPlaceholder,
				cardName: "APP Testing",
				cardDescription: "Android/iOS App",
				cardID: "appTesting",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Web Testing",
				cardDescription: "Android/iOS App",
				cardID: "webTesting",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "API Testing",
				cardDescription: "Android/iOS App",
				cardID: "apiTesting",
			},
		],
	};

	const monitoringObject = {
		cards: [
			{
				cardIllustration: GrayPlaceholder,
				cardName: "External Monitoring",
				cardDescription: "Android/iOS App",
				cardID: "externalMonitoring",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "APM",
				cardDescription: "Android/iOS App",
				cardID: "apm",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Infra",
				cardDescription: "Android/iOS App",
				cardID: "infra",
			},
		],
	};

	const otherObject = {
		cards: [
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Workflow Automation",
				cardDescription: "Android/iOS App",
				cardID: "workflowAutomation",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Testing",
				cardDescription: "Android/iOS App",
				cardID: "testing",
			},
		],
	};

	function handleCardClick(cardID: any) {
		setSelectedCardID(cardID);
	}

	return (
		<>
			<div
				css={[
					progressBarCSS,
					textFieldData || selectedCardID ? progressBarFirstStepDoneCSS : null,
					selectedCardID && textFieldData ? progressBarSecondStepDoneCSS : null,
				]}
			></div>
			<div css={containerCSS}>
				<div css={goBackCSS}>
					<GoBack css={goBackSVGCSS} />
					<span>Go Back</span>
				</div>
				<div css={titleCSS}>
					<p>What is the name of the project?</p>
					<input
						css={[textFieldCSS, isTextFieldSelected ? selectedTextFieldCSS : null]}
						type="text"
						onFocus={() => {
							setIsTextFieldSelected(true);
						}}
						onChange={(e) => setTextFieldData(e.target.value)}
					/>{" "}
					{/* Should I use Input Component in @ui/componentes/form/Input? */}
				</div>
				<div css={titleCSS}>Select type of project</div>
				<TypeOfProject
					{...sectionData}
					title="Testing"
					onSelect={handleCardClick}
					selectedID={selectedCardID}
				/>
				<TypeOfProject
					{...monitoringObject}
					title="Monitoring"
					onSelect={handleCardClick}
					selectedID={selectedCardID}
				/>
				<TypeOfProject
					{...otherObject}
					title="Other"
					onSelect={handleCardClick}
					selectedID={selectedCardID}
				/>
				<button
					css={[
						buttonCSS,
						textFieldData && selectedCardID ? fulfilledButtonCSS : null,
					]}
				>
					Create Project
				</button>
			</div>
		</>
	);
}

const buttonCSS = css`
	width: 16rem;
	font-size: 1rem;
	line-height: 20px;
	height: 2.5rem;
	background: #dddddd;
	border-radius: 0.5rem;
	color: #ffffff;
	font-weight: 600;
	position: absolute;
	right: 5rem;
	bottom: 5rem;
`;

const fulfilledButtonCSS = css`
	background: #6583fe;
	border: 2px solid #5173fd;
	border-radius: 4px;
`;

const containerCSS = css`
	margin: 1.5rem;
	height: 100vh;
	width: 100vw;
`;

const goBackCSS = css`
	display: flex;
	justify-content: center;
	align-items: center;
	width: max-content;
	font-size: 1rem;
	font-family: Gilroy;
	margin-bottom: 2rem;
`;

const goBackSVGCSS = css`
	height: 0.75rem;
	width: 1rem;
	margin-right: 0.5rem;
`;

const titleCSS = css`
	font-family: Cera Pro;
	font-size: 1.5rem;
	font-weight: bold;
	line-height: 2rem;
`;

const textFieldCSS = css`
	margin-top: 1rem;
	margin-bottom: 2.5rem;
	border: 1px solid #c4c4c4;
	box-sizing: border-box;
	border-radius: 4px;
	padding: 0.5rem;
	padding-left: 0.5rem;
	font-size: 1rem;
	line-height: 1rem;
	width: 20rem;
`;

const selectedTextFieldCSS = css`
	background: #ffffff;
	border: 2px solid #6583fe;
	border-radius: 4px;
`;

const progressBarCSS = css`
	width: 5%;
	background: #6583fe;
	transition: width 1s ease-in-out;
	height: 0.5rem;
`;

const progressBarFirstStepDoneCSS = css`
	width: 50%;
`;

const progressBarSecondStepDoneCSS = css`
	width: 100%;
`;

export default CreateProject;
