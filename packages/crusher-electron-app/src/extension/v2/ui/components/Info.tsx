import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Button } from "@dyson/components/atoms/button/Button";
import { css } from "@emotion/react";
import { BackIcon, NavigateBackIcon, NavigateRefreshIcon } from "crusher-electron-app/src/extension/assets/icons";

const heading = css`
	font-size: 17rem;
	font-family: Cera Pro;
	padding-bottom: 9rem;
`;

const InfoBox = (): JSX.Element => {
	return (
		<div css={containerStyle}>
			<div css={heading}>New to crusher?</div>
			<TextBlock
				css={css`
					margin-bottom: 26rem;
				`}
			>
				<Text
					CSS={css`
						font-family: Cera Pro;
						font-style: normal;
						font-weight: normal;
						font-size: 14rem;
						line-height: 18rem;
						margin-right: 23rem;
						color: #ffffff;
					`}
				>
					Get a 2 min tutorial on how it works?
				</Text>
				<Text
					css={css`
						font-family: Cera Pro;
						font-size: 12rem;
						color: #ffffff;
					`}
				>
					Know more
				</Text>
			</TextBlock>
			<TextBlock
				css={css`
					display: flex;
					align-items: center;
				`}
			>
				<Button
					bgColor="tertiary-outline"
					CSS={css`
						width: 154px;
						border: 1px solid #303235;
						box-sizing: border-box;
						border-radius: 6px;
						font-family: Gilroy;
						font-size: 15px;
						text-align: center;
						color: rgba(255, 255, 255, 0.83);
						margin-right: 20rem;
					`}
				>
					Show me around
				</Button>
				<Text
					CSS={css`
						font-family: Gilroy;
						font-style: normal;
						font-weight: normal;
						font-size: 13px;
						line-height: 15px;

						color: #ffffff;
					`}
				>
					{"Don't show again"}
				</Text>
			</TextBlock>
		</div>
	);
};

const containerStyle = css``;

export default InfoBox;
