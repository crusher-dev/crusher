import { Modal } from "@ui/containers/modals/modal";
import { useState } from "react";
import React from "react";
import { ModalInput } from "@ui/components/modal/input";
import { css } from "@emotion/core";
import { ModalButton } from "@ui/components/modal/button";
import { MultiSelect } from "@ui/components/modal/multiSelect";
import Flag from "../../../../public/svg/modals/flag.svg";
import Play from "../../../../public/svg/modals/play.svg";

interface iProps {
	onClose: any;
	onSubmit: any;
}

const CreateTestModal = (props: iProps) => {
	const { onClose, onSubmit } = props;
	const [url, setURL] = useState("");
	const [selectedBrowsers, setSelectedBrowsers] = useState([
    { label: "Chrome", value: "CHROME" },
  ]);

	const handleSubmit = () => {
		if(url && url.length > 0 && selectedBrowsers.length > 0) {
			if (onSubmit) {
				const browsers = selectedBrowsers.map((browserOption) => {
					return browserOption.value;
				});
				onSubmit(url, browsers);
			}
		} else {
			alert("Invalid inputs");
		}
	};

	const handleURLChange = (event: any) => {
		setURL(event.target.value);
	};

	const handleBrowserChange = (values: any) => {
		setSelectedBrowsers(values);
	};

	const browserOptions = [
		{ label: "Chrome", value: "CHROME" },
		{ label: "Firefox", value: "FIREFOX" },
		{ label: "Safari", value: "SAFARI" },
	];

	return (
		<Modal
			heading={"Create a test"}
			subHeading={"Experience power of no-code testing"}
			illustration={"/assets/img/illustration/women_running.png"}
			onClose={onClose}
			headingCss={modalHeadingCss}
			descCss={modalDescCss}
			topAreaCSS={topAreaCSS}
		>
			<div css={bodyContainerCss}>
				<ModalInput
					id={"url"}
					title={"Enter url"}
					placeholder={"Enter host url"}
					value={url}
					onChange={handleURLChange}
				/>
				{/*<ModalInput*/}
				{/*	id={"url"}*/}
				{/*	title={"Enter url"}*/}
				{/*	placeholder={"Enter host url"}*/}
				{/*	value={url}*/}
				{/*	onChange={handleURLChange}*/}
				{/*/>*/}
				<MultiSelect
					title={"Browser"}
					values={selectedBrowsers}
					options={browserOptions}
					name={"Browser"}
					onChange={handleBrowserChange}
					style={{ marginTop: "1rem" }}
				/>
				<div css={modalNoteCss}>
					<div css={flagContainerCss}>
						<Flag />
					</div>
					<div style={{ flex: "1" }}>
						<div>
							If your app shows different version for different device, country, etc.
            </div>
						<div>Create different version or fork a test</div>
					</div>
				</div>
				<ModalButton
					containerCss={buttonCss}
					title={"Start Recording"}
					onClick={handleSubmit}
				/>
				<a css={playContainerCss} href={"https://www.loom.com/share/5f1392d00274403083d151c0183620cb"}>
					<Play />{" "}
          <span style={{ marginLeft: "0.75rem" }}>Watch how to record test</span>
				</a>
			</div>
		</Modal>
	);
};

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
	background: #3c59cf;
	margin-top: 2.5rem;
	font-size: 1rem;
`;

export { CreateTestModal };
