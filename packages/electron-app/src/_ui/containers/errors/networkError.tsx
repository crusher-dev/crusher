import React from "react";
import { css } from "@emotion/react";
import { ConnectivityWarningIcon, LoadingIconV2, PlayV2Icon } from "../../../ui/icons";
import { Link } from "../../../ui/layouts/modalContainer";
import { Button } from "@dyson/components/atoms/button/Button";
import { shell } from "electron";
import { performGoToUrl, performRunDraftTest, performRunTests, turnOnProxy } from "../../../ui/commands/perform";
import { getCurrentSelectedProjct, getProxyState } from "electron-app/src/store/selectors/app";
import { useSelector, useStore } from "react-redux";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { Footer } from "../../layout/Footer";
import { NormalButton } from "../../components/buttons/NormalButton";

const ReadDocsButton = ({ title, className, onClick }) => {
	return (
		<Button
			id={"verify-save-test"}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(e);
			}}
			className={`${className}`}
			bgColor="tertiary-outline"
			size="x-small"
			css={saveButtonStyle}
		>
			<span>{title}</span>
		</Button>
	);
};

const saveButtonStyle = css`
	width: 100rem;
	background: transparent;
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 13.6rem;
	border: 0.5px solid #ffffff;
	color: #ffffff;
	:hover {
		background: transparent;
		border: 0.6px solid #ffffff;
	}
`;

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
const skipLinkStyle = css`
	margin-left: 20rem;
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
const actionsBarContainerStyle = css`
	display: flex;
	align-items: center;
	margin-top: 20rem;
`;
const waitingTextStyle = css`
	margin-top: 40rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	text-align: center;
	letter-spacing: 0.01em;

	color: #ffffff;
`;
const watch = css`
	font-size: 14rem;
	display: flex;
	align-items: center;

	column-gap: 8rem;
	align-self: center !important;
	justify-self: end;

	margin-top: 100rem;

	:hover {
		color: #a966ff;
		text-decoration: underline;
		cursor: pointer;
	}
`;
export { NetworkErrorContainer };
