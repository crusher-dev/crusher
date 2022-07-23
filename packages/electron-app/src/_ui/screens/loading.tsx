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
			<LoadingProgressBar />
		</CompactAppLayout>
	);
}


export { LoadingScreen };
