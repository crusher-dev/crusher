import React from "react";
import { css } from "@emotion/react";
import { ConnectivityWarningIcon } from "../../../ui/icons";
import { performGoToUrl } from "../../../ui/commands/perform";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { Footer } from "../../layout/Footer";
import { NormalButton } from "../../components/buttons/NormalButton"; 

const NetworkErrorContainer = () => {
	const handleRetry = React.useCallback(() => {
		performGoToUrl("/");
	}, []);

	return (
		<CompactAppLayout title={null} footer={<Footer/>} css={css`z-index: 999;`}>
			<div css={containerStyle}>
				<div css={contentContainerStyle}>
					<ConnectivityWarningIcon css={iconStyle} />
					<div css={headingStyle}>
						<span css={highlightStyle}></span>Facing issues with network connectivity! 
					</div>
					<div css={descriptionStyle}>
						Please check your internet connection and try again.<br/>
						<NormalButton onClick={handleRetry} css={retryButtonCss}>Retry</NormalButton>
					</div>
				</div>
			</div>
		</CompactAppLayout>
	);
};

const retryButtonCss =  css`
	margin-top: 16rem;
	width: 52rem;
`;

const contentContainerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: -80px;
`;
const headingStyle = css`
	margin-top: 24rem;
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 900;
	font-size: 18rem;
	text-align: center;
	letter-spacing: -0.1px;
	color: #ffffff;
`;
const highlightStyle = css`
	color: #ffec87;
`;
const descriptionStyle = css`
	margin-top: 12rem;

	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	text-align: center;
	letter-spacing: 0.2px;
	color: rgba(255, 255, 255, 0.64);
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const containerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
	justify-content: center;

`;
const iconStyle = css`
	width: 43rem;
	height: 35rem;
`;
export { NetworkErrorContainer };
