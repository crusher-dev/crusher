import React, { ChangeEvent, useCallback, useState } from "react";
import {
	NavigateBackIcon,
	NavigateForwardIcon,
	NavigateRefreshIcon,
	RecordLabelIcon,
} from "../../../assets/icons";
import { FLEX_DIRECTION } from "../../../interfaces/css";
import { AddressBar } from "../../components/app/addressBar";
import { addHttpToURLIfNotThere } from "../../../../../crusher-shared/utils/url";
import { Button } from "../../components/app/button";

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
				<Button title={"Save test"} icon={RecordLabelIcon} onClick={saveTest} />
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

export { BrowserToolbar };
