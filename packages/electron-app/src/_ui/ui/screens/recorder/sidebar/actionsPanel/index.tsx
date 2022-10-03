import React, { useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { useSelector, useStore } from "react-redux";
import { getSelectedElement, isInspectElementSelectorModeOn, isInspectModeOn as _isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { InputFocusHint } from "electron-app/src/_ui/ui/components/inputs/inputFocusHint";
import { InspectModeBanner } from "../inspectModeBanner";
import { ElementActions } from "./elementActions";
import { PageActions } from "./pageActions";
import { CodeAction } from "./codeAction";
import { GoBackIcon, InfoIcon, ResetIcon } from "electron-app/src/_ui/constants/icons";
import { enableJavascriptInDebugger, performVerifyTest } from "electron-app/src/_ui/commands/perform";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { filterActionsItems } from "./helper";
import { debounce, throttle } from "lodash";
import { LinkPointer } from "electron-app/src/_ui/ui/components/LinkPointer";

interface IProps {
	className?: string;
}

const ActionsPanel = ({ className }: IProps) => {
	const [searchFilter, setSearchFilter] = React.useState(null);
	const ref = useRef()

	const isInspectModeOn = useSelector(_isInspectModeOn);
	const isElementSelectorInspectModeOn = useSelector(isInspectElementSelectorModeOn);
	const store = useStore();


	const selectedElement = useSelector(getSelectedElement);
	const turnOffElementMode = React.useCallback(async () => {
		await enableJavascriptInDebugger();
		store.dispatch(setSelectedElement(null));
	}, []);
	const content = React.useMemo(() => {
		const filteredList = searchFilter?.length ? filterActionsItems(searchFilter) : null;

		if (selectedElement) {
			return (
				<>
					<div className={"ml-16 mb-18"} css={elementSelectedInfoCss}>
						<div onClick={turnOffElementMode} className={"flex items-center"}>
							<LinkPointer showExternalIcon={false}>
								<>
									<GoBackIcon css={goBackIconCss} />
									<span className={"ml-7"} css={goBackCss}>
										go back
									</span>
								</>
							</LinkPointer>
						
						</div>
						<div className={"flex items-center mt-7 pl-17"}>
							<span css={elementSelectedTextCss}>Element selected, choose an action</span>
						</div>
					</div>
					<ElementActions filteredList={filteredList} defaultExpanded={true} css={[topBorderCss, focusedListCss]} />
				</>
			);
		}

		return (
			<>
				<PageActions filteredList={filteredList} defaultExpanded={searchFilter || true} css={topBorderCss} />
				<ElementActions filteredList={filteredList} defaultExpanded={searchFilter} />
				<CodeAction filteredList={filteredList} />
			</>
		);
	}, [searchFilter, selectedElement]);

	const handleOnChange = (event) => {
		setSearchFilter(event.target.value);
	};

	useEffect(() => {
		const functionToTrack = debounce(
			(evt) => {
				if (!evt) evt = event;

				const commandKey = evt.metaKey || evt.ctrlKey;
				const key = evt.key.toLocaleLowerCase();
				if (commandKey && key === "f") {
					ref?.current?.focus()
				}
			}, 200
		);

		window.addEventListener('keydown', functionToTrack)

		return () => {
			window.removeEventListener('keydown', functionToTrack)
		}
	}, [])

	return (
		<div className={String(className)} css={containerCss}>
			<div css={headerCss}>
				<InputFocusHint
					ref={ref}
					onChange={handleOnChange} hint={process.platform == "linux" ? "ctrl + f" : `⌘ + f`} placeholder={"search actions"} />
			</div>
			<div css={contentCss} className="custom-scroll">
				{isInspectModeOn || isElementSelectorInspectModeOn ? <InspectModeBanner /> : content}
			</div>
		</div>
	);
};

const goBackCss = css`
	font-size: 12rem;

	letter-spacing: 0.02em;

	color: #adadad;
`;
const goBackIconCss = css`
	width: 10rem;
`;
const elementSelectedTextCss = css`
	font-weight: 500;
	font-size: 14rem;

	color: rgba(255, 255, 255, 0.79);
`;
const infoIconCss = css`
	width: 12.75rem;
	height: 12.75rem;
	:hover {
		opacity: 0.8;
	}
`;
const elementSelectedInfoCss = css``;
const focusedListCss = css`
	.action-item-header {
		background: rgba(214, 98, 255, 0.056);
		border-width: 0.5px 0px;
		border-style: solid;
		border-color: #d662ff;
	}
`;
const topBorderCss = css`
	border-top-width: 0.5px;
	border-top-style: solid;
	border-top-color: #1b1b1b;
`;
const containerCss = css`
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	padding-top: 18rem;
`;
const headerCss = css`
	display: flex;
	align-items: center;
	padding: 0rem 14rem;
	div{
		flex: 1;
	}
`;

const contentCss = css`
	height: 100%;
	padding-top: 16rem;
	overflow-y: auto;
`;

export { ActionsPanel };
