import React, { ChangeEvent, useCallback, useState } from "react";
import {
	NavigateBackIcon,
	NavigateForwardIcon,
	NavigateRefreshIcon,
	RecordLabelIcon,
} from "../../../assets/icons";
import { ToggleSwitchIndicator } from "../../components/app/toggleSwitchIndicator";
import { FLEX_DIRECTION } from "../../../interfaces/css";
import { AddressBar } from "../../components/app/addressBar";
import { addHttpToURLIfNotThere } from "../../../../../crusher-shared/utils/url";

interface iBrowserToolbarProps {
	initialUrl?: string;
	isInspectModeOn?: boolean;
	goBack: () => void;
	goForward: () => void;
	refreshPage: () => void;
	saveTest: () => void;
	loadNewPage: (newUrl: string) => void;
}
const BrowserToolbar = (props: iBrowserToolbarProps) => {
	const {
		initialUrl,
		isInspectModeOn,
		goBack,
		goForward,
		refreshPage,
		saveTest,
		loadNewPage,
	} = props;

	const [url, setUrl] = useState(initialUrl || "http://google.com");

	const handleAddressBarUrlChange = (event: ChangeEvent) => {
		setUrl((event.target as any).value);
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.keyCode === 13) {
				event.preventDefault();
				const newUrl = addHttpToURLIfNotThere(
					(event.target as any).value as string,
				);
				setUrl(newUrl);
				loadNewPage(newUrl);
			}
		},
		[url],
	);

	return (
		<div style={browserToolbarStyle}>
			<div style={browserMainToolbarStyle} id="top-bar">
				<div style={goBackIconContainerStyle}>
					<NavigateBackIcon onClick={goBack} disabled={false} />
				</div>
				<div style={forwardIconContainerStyle}>
					<NavigateForwardIcon onClick={goForward} disabled={false} />
				</div>
				<div style={refreshIconContainerStyle}>
					<NavigateRefreshIcon onClick={refreshPage} disabled={false} />
				</div>
				<AddressBar
					value={url}
					onKeyDown={handleKeyDown}
					onChange={handleAddressBarUrlChange}
				/>
				<div style={elementToggleIndicatorContainerStyle}>
					<ToggleSwitchIndicator label="Element mode" enabled={!!isInspectModeOn} />
				</div>
				<div style={buttonStyle} onClick={saveTest}>
					<RecordLabelIcon />
					<span style={{ marginLeft: "1.2rem" }}>Save Test</span>
				</div>
			</div>
		</div>
	);
};

const browserToolbarStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
};

const browserMainToolbarStyle = {
	background: "#14181F",
	display: "flex",
	padding: "0.73rem 2rem",
};

const elementToggleIndicatorContainerStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.ROW,
	justifyContent: "center",
	alignItems: "center",
	marginLeft: "auto",
};

const goBackIconContainerStyle = {
	display: "flex",
	alignItems: "center",
	marginLeft: "1.1rem",
};

const forwardIconContainerStyle = {
	marginLeft: "1.3rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
};

const refreshIconContainerStyle = {
	marginLeft: "1.5rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
};

const buttonStyle = {
	background: "#5B76F7",
	borderRadius: 4,
	fontWeight: 500,
	fontSize: "0.825rem",
	color: "#fff",
	fontFamily: "DM Sans",
	padding: "0.5rem 0.95rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
	width: "auto",
	marginLeft: "1.6rem",
};

export { BrowserToolbar };
