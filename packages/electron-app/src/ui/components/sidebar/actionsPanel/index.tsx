import { Conditional } from "@dyson/components/layouts";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import React from "react";
import { SearchIcon } from "electron-app/src/extension/assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedElement, isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { PageActions } from "./pageActions";
import { TemplateActions } from "./templatesActions";
import { ElementActions } from "./elementActions";
import { InspectModeAction } from "./inspectModeAction";

const ActionsPanel = ({className, ...props}: {className?: any}) => {
    const selected = useSelector(isInspectModeOn);
	const selectedElement = !useSelector(getSelectedElement);

    return (
        <div className={`${className}`} css={containerStyle}>
				<div css={headerContainerStyle}>
					<Text css={headerText}>Actions</Text>
					<SearchIcon css={hoverEffectStyle} />
				</div>
				<div className="custom-scroll" css={actionScrollContainer}>
					<Conditional showIf={selected}>
						<div css={selectActionContainer}>
							<Text css={selectActionHeading}>Action required element selection</Text>
							<Text css={selectActionText}>Select an element on left side</Text>
							<Text onClick={() => {}} css={[selectActionCancel, hoverEffectStyle]}>
								Cancel action
							</Text>
						</div>
					</Conditional>

					<Conditional showIf={!selected}>
						<Conditional showIf={!selectedElement}>
							{/* Non-Element Actions */}
                            <InspectModeAction/>
                            <PageActions/>
                            <TemplateActions/>
						</Conditional>
						<Conditional showIf={!!selectedElement}>
							{/* Element Actions */}
                            <ElementActions/>
						</Conditional>
					</Conditional>
				</div>

        </div>
    )
}

const hoverEffectStyle = css`
	:hover { opacity: 0.8 }
`;
const containerStyle = css`
    flex: 1;
    display: grid;
    overflow: hidden;
    grid-template-rows: 62rem;
`;

const headerContainerStyle = css`
	display: flex;
	padding: 18rem 26rem;
	justify-content: space-between;
`;

const headerText = css`
	font-family: Cera Pro;
	font-size: 15rem;
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