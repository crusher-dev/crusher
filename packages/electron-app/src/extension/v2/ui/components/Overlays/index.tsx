
import React from "react";
import {css} from "@emotion/react";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { useAtom } from "jotai";
import {  appStateItemMutator } from "../../../store/atoms/global/appState";

const Overlay = ({children}) => {
    return (
        <div css={mainContainerStyle}>
            {children}
        </div>
    )
};

const InfoOverLay = ({hideOverlay}) => {
	const [, setAppStateItem] = useAtom(appStateItemMutator);

    const handleDontShowAgain = () => {
        localStorage.setItem("app.showShouldOnboardingOverlay", "false");
        setAppStateItem({key: "showShouldOnboardingOverlay", value: false});
    }

    return (
        <Overlay>
            <div css={{display: "flex", flexDirection: "column", height: "100%", justifyItems: "flex-end"}}>
                <div css={{marginTop: "auto", marginBottom: "150rem", marginLeft: "30rem"}}>
                    <div css={heading}>New to crusher?</div>
                    <TextBlock CSS={blockStyle}>
                        <Text CSS={text1Style}>Get a 2 min tutorial on how it works?</Text>
                        <Text css={knowStyle} onClick={() => 0}>
                            Know more
                        </Text>
                    </TextBlock>
                    <TextBlock CSS={textBlock2}>
                        <Button bgColor="tertiary-outline" CSS={buttonStyle}>
                            Show me around
                        </Button>
                        <Text onClick={handleDontShowAgain} CSS={text2Style}>
                            {"Don't show again"}
                        </Text>
                    </TextBlock>
                </div>
            </div>
        </Overlay>
    )
};

const heading = css`
	font-size: 17rem;
	font-family: Cera Pro;
	padding-bottom: 9rem;
`;

const buttonStyle = css`
	width: 154rem;
	border: 1px solid #303235;
	box-sizing: border-box;
	border-radius: 6rem;
	font-family: Gilroy;
	font-size: 15rem;
	text-align: center;
	color: rgba(255, 255, 255, 0.83);
	margin-right: 20rem;
`;
const text2Style = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 13rem;
	line-height: 15rem;

	color: #ffffff;
`;
const text1Style = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 18rem;
	margin-right: 23rem;
	color: #ffffff;
`;
const knowStyle = css`
	font-family: Cera Pro;
	font-size: 12rem;
	color: #ffffff;
`;
const blockStyle = css`
	margin-bottom: 26rem;
`;
const textBlock2 = css`
	display: flex;
	align-items: center;
`;


const mainContainerStyle = css`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.92);
`;

export {Overlay, InfoOverLay};