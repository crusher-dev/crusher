import React, {useState} from "react";
import { css } from "@emotion/react";
import { CustomCodeModal } from "../containers/components/modals/page/customCodeModal";
import { useStore } from "react-redux";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";

function UnDockCodeScreen() {
	const [show, setShow] = React.useState(false);
	const [stepIndex, setStepIndex] = useState(null);
	const store = useStore();
	React.useEffect(() => {
		const searchString = window.location.href.split("?");
		const parsedSearchString = new URLSearchParams(searchString[1]);
		const stepIndex = parsedSearchString.get("stepIndex");

		if(stepIndex) {
			// alert(JSON.stringify({
			// 	state: store.getState()
			// }));
			setStepIndex(parseInt(stepIndex));
		}
		setShow(true);
	}, []);
	const handleClose = () => {
		window.close();
	};


	const stepAction = React.useMemo(( )=> {
		const savedSteps = getSavedSteps(store.getState() as any);
		// alert(JSON.stringify({
		// 	step: savedSteps[stepIndex]
		// }));
		return savedSteps[stepIndex];
	}, [stepIndex]);

	if(!show) return null;
	return (
		<div
			css={css`
				height: 100vh;
			`}
		>
			{process.platform === "darwin" ? <div css={dragStyle} className={"drag"}></div> : ""}
			<CustomCodeModal stepIndex={stepIndex} stepAction={stepAction} isOpen={true} handleClose={handleClose} />
		</div>
	);
}

const dragStyle = css`
	height: 18px;
	width: 100%;
	background: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
`;

export { UnDockCodeScreen };
export default React.memo(UnDockCodeScreen);
