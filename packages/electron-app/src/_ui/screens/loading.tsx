import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../layout/CompactAppLayout";
import { Footer } from "../layout/Footer";
import { LoadingProgressBar } from "../components/LoadingProgressBar";

function LoadingScreen() {
	React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);

	return (
		<CompactAppLayout footer={<Footer />}>
			<div css={containerCss}>
				<div css={contentCss}>
					<LoadingProgressBar />
				</div>
			</div>
		</CompactAppLayout>
	);
}

const contentCss = css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;
`;
const containerCss = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	background: #161617;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;


export { LoadingScreen };
