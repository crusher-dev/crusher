import React, { useEffect, useState } from "react";

import { Toast } from "dyson/src/components/atoms/toast/Toast";
import { css } from "@emotion/react";
import mitt from "mitt";
import { shell } from "electron";
import { resolveToBackendPath, resolveToFrontEndPath } from "@shared/utils/url";
import { getAppSettings } from "electron-app/src/store/selectors/app";
import { useStore } from "react-redux";

export const snackBarEmitter = mitt();

export type SnackbarEvent = {
	message: string;
	type?: "normal" | "success" | "info" | "error" | "test_report";
	meta?: any;
};

export const sendSnackBarEvent = (event: SnackbarEvent) => {
	snackBarEmitter.emit("snackbar-notify", event);
};

const TestReportToast = ({ meta }) => {
	const store = useStore();

	const handleViewReport = React.useCallback(() => {
		const appSettings = getAppSettings(store.getState() as any);
		shell.openExternal(resolveToFrontEndPath("/app/build/" + (window as any).localBuildReportId, appSettings.frontendEndPoint))
	}, []);

	return (
		<div css={reportToastContainerStyle}>
			<div css={reportToastSectionContainerStyle}>
				<div
					css={css`
						font-weight: bold;
					`}
				>
					Tests passed
				</div>
				<div>{meta.totalCount} test</div>
			</div>
			<div
				css={[
					reportToastSectionContainerStyle,
					css`
						border-top-color: rgba(255, 255, 255, 0.03);
						border-top-width: 1px;
						border-top-style: solid;
					`,
				]}
				onClick={handleViewReport}
			>
				<div css={css`:hover { opacity: 0.8; cursor: default; }`}>View report</div>
			</div>
		</div>
	);
};

const reportToastContainerStyle = css`
	color: #fff;
	font-size: 13px;
	position: fixed;
	left: 50%;
	top: 41px;
	z-index: 999999;
	background: #151516;
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-shadow: 0px 4px 15px rgb(16 15 15 / 40%);
	transform: translateX(-50%);
	border-radius: 8px;
	width: 330px;
	font-family: Cera Pro;
`;

const reportToastSectionContainerStyle = css`
	padding: 10px 20px;
	display: flex;
	justify-content: space-between;

`;
export const ToastSnackbar = () => {
	const [event, setEvent] = useState<SnackbarEvent | null>(null);
	useEffect(() => {
		snackBarEmitter.on("snackbar-notify", (e) => {
			setEvent(e as SnackbarEvent);

			setTimeout(() => {
				setEvent(null);
			}, 7000);
		});
	}, []);

	if (event === null) return null;
	if (event.type === "test_report") return <TestReportToast meta={event.meta} />;

	return (
		<Toast type={event.type} onClose={setEvent.bind(this, null)}>
			{event.message}
		</Toast>
	);
};
