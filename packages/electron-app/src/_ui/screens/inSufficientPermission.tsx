import React from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { CompactAppLayout } from "../layout/CompactAppLayout";
import { DocsGoBackActionBar } from "electron-app/src/app/containers/components/create-first-test";

export function InsufficientPermissionScreen() {
	const navigate = useNavigate();
	const handleGoBack = React.useCallback(() => {
		navigate("/select-project");
	}, []);

	return (
		<CompactAppLayout title={<div css={titleCss}>Home</div>}>
			<div css={containerCss}>
				<div css={contentHeadingCss}>Insufficient permission</div>
				<div css={contentDescriptionCss}>Not part of the team. Request access from admin of this project.</div>
				<DocsGoBackActionBar buttonTitle={"Go back"} buttonCallback={handleGoBack} />
			</div>
		</CompactAppLayout>
	);
}

const containerCss = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	padding-bottom: 120rem;
`;

const titleCss = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;
`;

const contentHeadingCss = css`
	margin-top: 28rem;
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 900;
	font-size: 18rem;
	text-align: center;
	letter-spacing: 0.1px;
	color: #ffffff;
`;
const contentDescriptionCss = css`
	margin-top: 10rem;

	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	text-align: center;
	letter-spacing: 0.2px;
	color: rgba(255, 255, 255, 0.64);
`;


