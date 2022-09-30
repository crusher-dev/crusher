import React from "react";
import { css } from "@emotion/react";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Text } from "@dyson/components/atoms/text/Text";
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
const blockStyle = css`
	margin-bottom: 26rem;
`;
const textBlock2 = css`
	display: flex;
	align-items: center;
`;

const mainContainerStyle = css`
	position: fixed;
	width: 100%;
	left: 0px;
	bottom: 0px;
	background: rgba(0, 0, 0, 0.92);
	z-index: 99999919239;
`;

export { Overlay, InfoOverLay };
