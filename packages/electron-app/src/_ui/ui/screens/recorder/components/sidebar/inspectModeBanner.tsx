import React from "react";
import { css } from "@emotion/react";
import { Text } from "@dyson/components/atoms/text/Text";
import { useSelector } from "react-redux";
import {isInspectModeOn as _isInspectModeOn} from "electron-app/src/store/selectors/recorder";
import { turnOffElementSelectorInspectMode, turnOffInspectMode } from "electron-app/src/_ui/commands/perform";

const InspectModeBanner = () => {
    const isInspectModeOn = useSelector(_isInspectModeOn);

    const handleCancelAction = React.useCallback(() => {
        if(isInspectModeOn) {
            turnOffInspectMode();
        } else {
            // must be elemment selector inspect mode
            turnOffElementSelectorInspectMode();
        }
    }, [isInspectModeOn]);
    
    return ( 
        <div css={containerCss}>
            <Text css={headingCss}>Action required element selection</Text>
            <Text css={mainTextCss}>Select an element on left side</Text>
            <Text onClick={handleCancelAction} css={cancelCss}>
                Cancel action
            </Text>
        </div>
    );
};

const containerCss = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
`;
const headingCss = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 15rem;
	line-height: 19rem;
	margin-bottom: 10rem;
`;
const mainTextCss = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 15rem;
	line-height: 17rem;
	margin-bottom: 26rem;
`;
const cancelCss = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 13rem;
	line-height: 16rem;
	text-decoration-line: underline;
    :hover {
		opacity: 0.8;
	}
`;

export { InspectModeBanner };