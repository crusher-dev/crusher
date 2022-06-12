import { Conditional } from "@dyson/components/layouts";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import React from "react";
import { NavigateBackIcon, SearchIcon } from "../../../icons";
import { useDispatch, useSelector, useStore } from "react-redux";
import { getSelectedElement, isInspectElementSelectorModeOn, isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { PageActions } from "./pageActions";
import { TemplateActions } from "./templatesActions";
import { ElementActions } from "./elementActions";
import { InspectModeAction } from "./inspectModeAction";
import { enableJavascriptInDebugger, turnOffElementSelectorInspectMode, turnOffInspectMode } from "electron-app/src/ui/commands/perform";
import { useTour } from "@reactour/tour";
import { BrowserButton } from "../../buttons/browser.button";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";

const ActionsPanel = ({ className, ...props }: { className?: any }) => {
	const selected = useSelector(isInspectModeOn);
	const elementSelectorInspectMode = useSelector(isInspectElementSelectorModeOn);
	const selectedElement = useSelector(getSelectedElement);
	const { isOpen, setCurrentStep } = useTour();
	const store = useStore();

	const handleTurnOffInspectMode = () => {
		turnOffInspectMode();
	};

	const turnOffInspectElementSelectorMode = () => {
		turnOffElementSelectorInspectMode();
	}

	React.useEffect(() => {
		if (selectedElement && isOpen) {
			setCurrentStep(3);
		}
	}, [selectedElement]);

	const goBack = async () => {
		await enableJavascriptInDebugger();
		store.dispatch(setSelectedElement(null));
	};

	return (
		<div className={`${className}`} css={containerStyle}>
			<div css={headerContainerStyle}>
				<Conditional showIf={!selected && !!selectedElement}>
					<BrowserButton
						className={"mr-12 go-back-button"}
						css={css`
							background: transparent;
						`}
						onClick={goBack}
					>
						<NavigateBackIcon
							css={css`
								height: 18rem;
							`}
							disabled={false}
						/>
					</BrowserButton>
				</Conditional>
				<Text css={headerText}>Actions</Text>
				{/* <SearchIcon css={[hoverEffectStyle, css`width: 13rem; height: 13rem;`]} /> */}
			</div>
			<div className="custom-scroll" css={actionScrollContainer}>
				<Conditional showIf={selected || elementSelectorInspectMode}>
					<div css={selectActionContainer}>
						<Text css={selectActionHeading}>Action required element selection</Text>
						<Text css={selectActionText}>Select an element on left side</Text>
						<Text onClick={selected ? handleTurnOffInspectMode : turnOffInspectElementSelectorMode} css={[selectActionCancel, hoverEffectStyle]}>
							Cancel action
						</Text>
					</div>
				</Conditional>

				<Conditional showIf={!selected}>
					<Conditional showIf={!selectedElement}>
						{/* Non-Element Actions */}
						<InspectModeAction />
						<PageActions />
						<TemplateActions />
					</Conditional>
					<Conditional showIf={!!selectedElement}>
						{/* Element Actions */}
						<ElementActions />
					</Conditional>
				</Conditional>
			</div>
		</div>
	);
};

const hoverEffectStyle = css`
	:hover {
		opacity: 0.8;
	}
`;
const containerStyle = css`
	flex: 1;
	display: grid;
	overflow: hidden;
	grid-template-rows: 60rem;
`;

const headerContainerStyle = css`
	display: flex;
	align-items: center;
	padding: 18rem 26rem;
	justify-content: space-between;
`;

const headerText = css`
	font-family: Cera Pro;
	font-size: 15rem;
	flex: 1;
`;
const actionScrollContainer = css`
	height: 100%;
	padding: 26rem;
	padding-top: 0rem;
	overflow-y: auto;
`;
const selectActionContainer = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
`;
const selectActionHeading = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 15rem;
	line-height: 19rem;
	margin-bottom: 10rem;
`;
const selectActionText = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 15rem;
	line-height: 17rem;
	margin-bottom: 26rem;
`;
const selectActionCancel = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 13rem;
	line-height: 16rem;
	text-decoration-line: underline;
`;

export { ActionsPanel };
