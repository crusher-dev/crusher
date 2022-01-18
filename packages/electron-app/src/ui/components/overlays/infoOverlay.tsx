import React from "react";
import { css } from "@emotion/react";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { useAtom } from "jotai";
import { useDispatch, useSelector } from "react-redux";
import { shouldShowOnboardingOverlay } from "electron-app/src/store/selectors/app";
import { setShowShouldOnboardingOverlay } from "electron-app/src/store/actions/app";
import { useTour } from "@reactour/tour";

const Overlay = ({ children }) => {
	return <div css={mainContainerStyle}>{children}</div>;
};

const InfoOverLay = () => {
	const showOnboardingOverlay = useSelector(shouldShowOnboardingOverlay);
	const dispatch = useDispatch();
	const { isOpen, setIsOpen } = useTour();

	const handleDontShowAgain = () => {
		if (isOpen) {
			setIsOpen(false);
		}
		localStorage.setItem("app.showShouldOnboardingOverlay", "false");
		dispatch(setShowShouldOnboardingOverlay(false));
	};

	React.useEffect(() => {
		if (showOnboardingOverlay) {
			(document.querySelector("#target-site-input") as any).focus();
			setIsOpen(true);
		}
	}, []);

	if (!showOnboardingOverlay) return null;

	return (
		<Overlay>
			<div
				id={"onboarding-overlay"}
				css={{ display: "flex", flexDirection: "column", height: "100%", justifyItems: "flex-end", position: "relative", zIndex: 999999 }}
			>
				<div css={{ marginTop: "auto", marginBottom: "150rem", marginLeft: "30rem" }}>
					<div css={heading}>Let's create your first test with crusher</div>
					<TextBlock css={blockStyle}>
						<Text css={text1Style}>2 min onboarding to get you familiar with crusher</Text>
					</TextBlock>
					<TextBlock css={textBlock2}>
						<Text onClick={handleDontShowAgain} css={text2Style}>
							{"Skip onboarding"}
						</Text>
					</TextBlock>
				</div>
			</div>
		</Overlay>
	);
};

const heading = css`
	font-size: 17rem;
	font-weight: bold;
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

	:hover {
		opacity: 0.9;
	}
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
	background: rgba(0, 0, 0, 0.92);
`;

export { Overlay, InfoOverLay };
