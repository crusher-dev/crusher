import React from "react";
import { emitShowModal } from "electron-app/src/_ui/ui/containers/components/modals";
import { ActionsList } from "./actionsList";
import { CodeIcon } from "electron-app/src/_ui/constants/icons";
import { css } from "@emotion/react";
import { ShepherdTourContext } from "react-shepherd";

const actionsData = require("./actions.json");
interface IProps {
	className?: string;
	filteredList: any;
}

const CodeAction = ({ className, filteredList }: IProps) => {
	const tour = React.useContext(ShepherdTourContext);
	const handleCallback = React.useCallback(() => {
		emitShowModal({ type: "CUSTOM_CODE" });
		if(tour.getCurrentStep()?.id === "add-custom-code") {
			setTimeout(() => {
				tour.next();
			}, 150);
		}
	}, []);

	const isCodePresent = filteredList ? filteredList["CODE"] : actionsData["CODE"];
	if (!isCodePresent) return null;

	return (
		<ActionsList id="custom-code-action" onClick={handleCallback} className={String(className)} title={"code"} icon={<CodeIcon css={codeIconCss} />} callback={handleCallback} />
	);
};

const codeIconCss = css`
	width: 10.5rem;
	height: 10.5rem;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	path {
		fill: rgba(255, 255, 255, 0.8);
	}
`;

export { CodeAction };
