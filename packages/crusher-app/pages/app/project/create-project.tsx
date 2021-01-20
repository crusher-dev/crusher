import { css } from "@emotion/core";
import GoBack from "../../../public/assets/img/general/goback.png";
import TypeOfProject from "@ui/components/project/TypeOfProject";
import GrayPlaceholder from "../../../public/assets/img/general/grayPlaceholder.png";
// import Input from "@ui/components/form/Input";

function CreateProject() {
	const testingObject = {
		title: "Testing",
		cards: [
			{
				cardIllustration: GrayPlaceholder,
				cardName: "APP Testing",
				cardDescription: "Android/iOS App",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Web Testing",
				cardDescription: "Android/iOS App",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "API Testing",
				cardDescription: "Android/iOS App",
			},
		],
	};

	const monitoringObject = {
		title: "Monitoring",
		cards: [
			{
				cardIllustration: GrayPlaceholder,
				cardName: "External Monitoring",
				cardDescription: "Android/iOS App",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "APM",
				cardDescription: "Android/iOS App",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Infra",
				cardDescription: "Android/iOS App",
			},
		],
	};

	const otherObject = {
		title: "Other",
		cards: [
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Workflow Automation",
				cardDescription: "Android/iOS App",
			},
			{
				cardIllustration: GrayPlaceholder,
				cardName: "Testing",
				cardDescription: "Android/iOS App",
            },
		],
	};

	return (
		<div css={containerCSS}>
			<div css={goBackCSS}>
				<img
					src={GoBack}
					css={css`
						height: 1rem;
						padding-right: 0.5rem;
					`}
				/>
				<span>Go Back</span>
			</div>
			<div css={titleCSS}>
				<p>What is the name of the project?</p>
				<input css={textFieldCSS} type="text" />{" "}
				{/* Should I use Input Component in @ui/componentes/form/Input? */}
			</div>
			<div css={titleCSS}>Select type of project</div>
			<TypeOfProject {...testingObject} />
			<TypeOfProject {...monitoringObject} />
            <TypeOfProject {...otherObject} />
            <button css={buttonCSS}>Create Project</button>
		</div>
	);
}

const buttonCSS = css`
    width: 16rem;
    font-size: 1rem;
    line-height: 20px;
    height: 2.5rem;
    background: #DDDDDD;
    border-radius: 0.5rem;
    color: #FFFFFF;
    font-weight: 600;
    position: absolute;
    right: 5rem;
    bottom: 5rem;
`

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
    font-size: 1.5rem;
`;

export default CreateProject;
