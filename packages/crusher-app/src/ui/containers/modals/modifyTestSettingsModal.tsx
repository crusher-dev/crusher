import { Modal } from "@ui/containers/modals/modal";
import { useState } from "react";
import React from "react";
import { css } from "@emotion/core";
import { ModalButton } from "@ui/components/modal/button";
import { MultiSelect } from "@ui/components/modal/multiSelect";
import { ModalCheckbox } from "@ui/components/modal/checkbox";

interface iProps {
	onClose: any;
	onSubmit: any;
}

const ModifyTestSettingsModal = (props: iProps) => {
	const { onClose, onSubmit } = props;
	const [selectedBrowsers, setSelectedBrowsers] = useState([
		{ label: "Chrome", value: "CHROME" },
	]);
	const [selectedResolutions, setSelectedResolutions] = useState([]);
	const [shouldSaveTestSettingsForFuture, setShouldSaveTestSettingsForFuture] = useState(false);

	const handleSubmit = () => {

	};

	const handleBrowserChange = (values: any) => {
		setSelectedBrowsers(values);
	};

	const handleResolutionChange = (values: any) => {
		setSelectedResolutions(values);
	};

	const browserOptions = [
		{ label: "Chrome", value: "CHROME" },
		{ label: "Firefox", value: "FIREFOX" },
		{ label: "Safari", value: "SAFARI" },
	];

	const resolutionOptions = [
		{ label: "1920x1080", value: "1920x1080"},
		{ label: "720x480", value: "720x480"}
	];

	const selectedBrowsersInText = selectedBrowsers.map((browserOption) => {
		return browserOption.label;
	}).join(",");

	const selectedResolutionsInText = selectedResolutions.map((resolutionOption) => {
		return resolutionOption.label;
	}).join(",");

	const onCheckboxToggle = () => {
		setShouldSaveTestSettingsForFuture(!shouldSaveTestSettingsForFuture);
	};

	return (
		<Modal
			heading={"Save test settings"}
			subHeading={"Experience power of no-code testing"}
			illustration={"/assets/img/illustration/women_running.png"}
			onClose={onClose}
			headingCss={modalHeadingCss}
			descCss={modalDescCss}
			topAreaCSS={topAreaCSS}
		>
			<div css={bodyContainerCss}>
				<MultiSelect
					title={"Browser"}
					values={selectedBrowsers}
					options={browserOptions}
					name={"Browser"}
					onChange={handleBrowserChange}
					style={{ marginTop: "1rem" }}
				/>
				{selectedBrowsers.length ? (
					<div css={inputInfoContainerCss}>
						<div>Current</div>
						<div css={inputInfoValueCss}>{selectedBrowsersInText}</div>
					</div>
				) : null}
				<MultiSelect
					title={"Resolutions"}
					values={selectedResolutions}
					options={resolutionOptions}
					name={"Resolution"}
					onChange={handleResolutionChange}
					style={{ marginTop: "1rem" }}
				/>
				{selectedResolutions.length ? (
					<div css={inputInfoContainerCss}>
						<div>Current</div>
						<div css={inputInfoValueCss}>{selectedResolutionsInText}</div>
					</div>
				) : null}
				<ModalCheckbox containerCss={checkboxContainerCss} title={"Save this for every test going forwards"} enabled={shouldSaveTestSettingsForFuture} onToggle={onCheckboxToggle}/>
				<ModalButton
					containerCss={buttonCss}
					title={"Save for test"}
					onClick={handleSubmit}
				/>
			</div>
		</Modal>
	);
};

const checkboxContainerCss = css`
	margin-top: 2.43rem;
`;
const inputInfoContainerCss = css`
	margin-top: 0.8125rem;
	font-family: Cera Pro;
	font-size: 0.875rem;
	color: #000000;
	font-weight: 500;
	margin-bottom: 0.2rem;
`;

const inputInfoValueCss = css`
	font-size: 0.75rem;
	font-weight: normal;
	margin-top: 0.5rem;
`;

const playContainerCss = css`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 1.06rem;
	color: #1e1d1d;
	font-size: 1rem;
	font-family: Gilroy;
	text-decoration-line: underline;
	cursor: pointer;
`;

const flagContainerCss = css`
	margin-right: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const modalNoteCss = css`
	color: #7e7e7e;
	font-family: Gilroy;
	font-size: 0.8rem;
	margin-top: 2.562rem;
	display: flex;
	flex-direction: row;
`;

const topAreaCSS = css`
	background: #edf8ff;
	border-bottom: 2px solid #0a1215;
`;

const modalHeadingCss = css`
	color: #261f18;
`;

const modalDescCss = css`
	color: #2e2e2e;
	font-size: 1rem !important;
`;

const modalMoto = css`
	font-size: 1rem;
	margin-bottom: 1.25rem;
`;

const bodyContainerCss = css`
	display: flex;
	flex-direction: column;
	padding-top: 0.75rem;
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2b2b39;
		font-size: 1rem;
	}
	min-height: 21rem;
`;

const membersInputCss = css`
	margin-top: 2rem;
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2b2b39;
		font-size: 1rem;
		line-height: 1.1rem;
	}
`;

const membersDescCss = css`
	font-size: 0.95rem;
	margin-top: 0.675rem;
`;

const buttonCss = css`
	margin-top: auto;
	background: #5B76F7;
	margin-top: 1.125rem;
	font-size: 1rem;
`;

export { ModifyTestSettingsModal };
