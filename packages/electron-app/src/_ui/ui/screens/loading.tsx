import { useEffect } from "react";
import { CompactAppLayout } from "../layout/CompactAppLayout";
import { Footer } from "../layout/Footer";
import { LoadingProgressBar } from "../containers/common/LoadingProgressBar";
import { css } from "@emotion/react";

function LoadingScreen() {
	useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);
	return (
		<CompactAppLayout css={containerCss} showHeader={true} footer={<Footer />}>
			<LoadingProgressBar />
		</CompactAppLayout>
	);
}
const containerCss = css`
	background: #080808;
`;
export { LoadingScreen };
