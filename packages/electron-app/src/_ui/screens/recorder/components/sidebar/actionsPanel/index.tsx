import { Conditional } from "@dyson/components/layouts";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import React from "react";
import { NavigateBackIcon, SearchIcon } from "../../../../../../ui/icons";
import { useDispatch, useSelector, useStore } from "react-redux";
import { getSelectedElement, isInspectElementSelectorModeOn, isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { PageActions } from "./pageActions";
import { TemplateActions } from "./templatesActions";
import { ElementActions } from "./elementActions";
import { InspectModeAction } from "./inspectModeAction";
import { enableJavascriptInDebugger, turnOffElementSelectorInspectMode, turnOffInspectMode } from "electron-app/src/ui/commands/perform";
import { useTour } from "@reactour/tour";
import { BrowserButton } from "../../../../../../ui/components/buttons/browser.button";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import _ from "lodash";
import { Input } from "@dyson/components/atoms";

const ActionsPanel = ({ className, ...props }: { className?: any }) => {
	const selected = useSelector(isInspectModeOn);
	const elementSelectorInspectMode = useSelector(isInspectElementSelectorModeOn);
	const selectedElement = useSelector(getSelectedElement);
	const { isOpen, setCurrentStep } = useTour();
	const actionsSearchRef = React.useRef();

	const store = useStore();

	const handleTurnOffInspectMode = () => {
		turnOffInspectMode();
	};

	const turnOffInspectElementSelectorMode = () => {
		turnOffElementSelectorInspectMode();
	};

	React.useEffect(() => {
		if (selectedElement && isOpen) {
			setCurrentStep(3);
		}
	}, [selectedElement]);

	const goBack = async () => {
		await enableJavascriptInDebugger();
		store.dispatch(setSelectedElement(null));
	};
	const RightIconComponent = React.useMemo(
		() => (
			<div css={css`
			font-family: Gilroy;
			font-style: normal;
			font-weight: 400;
			font-size: 12.7rem;
	
			
			color: #444444;
			margin-right: 12rem;
			`}>
⌘ + k
			</div>
		),
		[],
	);
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
				<div css={css`margin-top: 8rem`}>
					<Input
											placeholder="search actions"
											id={"target-site-input"}
											className={"target-site-input"}
											css={inputStyle}
											onReturn={() => {}}
											initialValue={""}
											ref={actionsSearchRef}
											// leftIcon={LeftIconComponent}
											rightIcon={RightIconComponent}
										/>
										</div>
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
						{/* <InspectModeAction /> */}
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

const inputStyle = css`
	height: 36rem;
	.input__rightIconContainer {
		right: 0px;

		:hover {
			opacity: 0.8;
		}
	}
	.input__leftIconContainer {
		border-radius: 8rem 0px 0px 8rem;
		height: 85%;
		left: 1rem;
		.outsideDiv,
		.showOnClick {
			height: 100%;
		}
		/* To stop border collision */
		margin-left: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;

		.dropdown-box {
			overflow: hidden;
			width: 104rem;
			margin-left: 12rem;
			z-index: 99999;
		}
	}
	& > input {
		width: 247rem;
		/* border: 1px solid #9462ff; */
		outline-color: #9462ff;
		outline-width: 1px;
		box-sizing: border-box;
		border-radius: 8rem 0px 0px 8rem;
		height: 100%;
		padding-left: 18rem;
		padding-right: 110rem;

		background: rgba(77, 77, 77, 0.2);
		border: 0.5px solid rgba(55, 55, 55, 0.4);
		border-radius: 10px;

		font-family: Gilroy;
		font-style: normal;
		font-weight: 400;
		font-size: 13rem;
		letter-spacing: 0.02em;

		color: rgba(255, 255, 255, 0.67);
		::placeholder {
			color: rgba(255, 255, 255, 0.4);
		}
		
	}
	}
	.dropdown-box {
		overflow: hidden;
	}
	.input__rightIconContainer {
		right: 1rem;
		z-index: 9999;
	}
`;
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
	padding: 0rem 14rem;
	justify-content: space-between;
`;

const headerText = css`
	font-family: Cera Pro;
	font-size: 15rem;
	flex: 1;
`;
const actionScrollContainer = css`
	height: 100%;
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
