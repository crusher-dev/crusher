import React from "react";
import ResetPasswordContainer from "@ui/containers/auth/reset";
import { usePageTitle } from "../src/hooks/seo";

function ResetPassPage() {
	usePageTitle("Change your Password");
	return (
		<div>
			<ResetPasswordContainer />
		</div>
	);
}

export default ResetPassPage;
