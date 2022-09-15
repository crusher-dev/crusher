import React from "react";

import Container from "@ui/containers/auth/forget";

import { usePageTitle } from "../src/hooks/seo";

function ForgotPassword() {
	usePageTitle("Forgot Password");

	return <Container />;
}

export default ForgotPassword;
