import { useState } from "react";
import React from "react";
import { ModalInput } from "@ui/components/modal/input";
import { css } from "@emotion/core";
import { ModalButton } from "@ui/components/modal/button";
import Flag from "../../../../public/svg/modals/flag.svg";
import Play from "../../../../public/svg/modals/play.svg";
import Select from "react-select";
import { Label } from "@ui/components/modal/label";
import { PIXEL_REM_RATIO } from "@constants/other";
import { DEVICE_TYPES } from "@crusher-shared/types/deviceTypes";
import { BaseModal } from "@ui/containers/modals/baseModal";
import CrossIcon from "../../../../public/svg/modals/cross.svg";
import { getChromeExtensionId } from "@utils/extension";
import {
	generateCrusherExtensionUrl,
	getDefaultDeviceFromDeviceType,
} from "@crusher-shared/utils/extension";

interface iCreateTestModalProps {
	isOpen: boolean;
	onClose: any;
}

const deviceTypes = [
	{ label: "Desktop", value: DEVICE_TYPES.DESKTOP },
	{ label: "Mobile", value: DEVICE_TYPES.MOBILE },
];

const CreateTestModal = (props: iCreateTestModalProps) => {
	const { isOpen, onClose } = props;
	const [url, setURL] = useState("");
	const [selectedDeviceType, setSelectedDeviceType] = useState({
		label: "Desktop",
		value: DEVICE_TYPES.DESKTOP,
	});

	const handleSubmit = () => {
		if (url && url.length > 0 && selectedDeviceType) {
			const device = getDefaultDeviceFromDeviceType(selectedDeviceType.value);

			if (device) {
				window.open(
					generateCrusherExtensionUrl(
						`chrome-extension://${getChromeExtensionId()}`,
						url,
						device.id,
					),
				);
			}
			onClose();
		} else {
			alert("Invalid inputs");
		}
	};

	const handleURLChange = (event: any) => {
		setURL(event.target.value);
	};

	const handleDeviceChange = (values: any) => {
		setSelectedDeviceType(values);
	};

	return (
		<BaseModal
			heading={"Create a test"}
			subHeading={"Experience power of no-code testing"}
			illustration={"/assets/img/illustration/women_running.png"}
			onClose={onClose}
			closeIcon={CrossIcon}
			isOpen={isOpen}
			css={{
				heading: modalHeadingCSS,
				desc: modalDescCSS,
				topArea: topAreaCSS,
			}}
		>
			<div css={bodyContainerCSS}>
				<Label>Enter url</Label>

				<ModalInput
					customCSS={inputLabelMarginCSS}
					id={"url"}
					title={"Enter url"}
					placeholder={"Enter host url"}
					value={url}
					onChange={handleURLChange}
				/>

				<Label customCSS={inputItemMarginTopCSS}>On Device</Label>
				<Select
					value={selectedDeviceType}
					onChange={handleDeviceChange}
					options={deviceTypes}
					css={inputLabelMarginCSS}
				/>
				<div css={modalNoteCSS}>
					<div css={flagContainerCSS}>
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
					containerCss={buttonCSS}
					title={"Start Recording"}
					onClick={handleSubmit}
				/>
				<a
					css={playContainerCSS}
					href={"https://www.loom.com/share/5f1392d00274403083d151c0183620cb"}
				>
					<Play />{" "}
					<span style={{ marginLeft: "0.75rem" }}>Watch how to record test</span>
				</a>
			</div>
		</BaseModal>
	);
};

const inputItemMarginTopCSS = css`
	margin-top: ${21 / PIXEL_REM_RATIO}rem;
`;
const inputLabelMarginCSS = css`
	margin-top: ${16 / PIXEL_REM_RATIO}rem;
`;
const playContainerCSS = css`
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

const flagContainerCSS = css`
	margin-right: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const modalNoteCSS = css`
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

const modalHeadingCSS = css`
	color: #261f18;
`;

const modalDescCSS = css`
	color: #2e2e2e;
	font-size: 1rem !important;
`;

const bodyContainerCSS = css`
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

const buttonCSS = css`
	background: #3c59cf;
	margin-top: 2.5rem;
	font-size: 1rem;
`;

export { CreateTestModal };
