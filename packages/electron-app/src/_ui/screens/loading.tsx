import React from "react";
import { CompactAppLayout } from "../layout/CompactAppLayout";
import { Footer } from "../layout/Footer";
import { LoadingProgressBar } from "../components/LoadingProgressBar";

function LoadingScreen() {
	React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);

	return (
		<CompactAppLayout showHeader={true} footer={<Footer />}>
			<LoadingProgressBar />
		</CompactAppLayout>
	);
}


export { LoadingScreen };
