import Head from "next/head";
import { css } from "@emotion/core";

import WithSession from "@hoc/withSession";
import { EMAIL_NOT_VERIFIED } from "@utils/constants";
import { redirectToBackendURI } from "@utils/router";
import { AuthenticationDarkTemplate } from "../src/ui/template/authenticationDark";

function EmailVerification() {
	function resendEmail() {}

	function goBack() {
		redirectToBackendURI("user/logout");
	}

	return (
		<div>
			<Head>
				<title>Login | Crusher</title>
			</Head>

			<AuthenticationDarkTemplate>
				<div css={styles.form}>
					<div css={styles.headingContainer}>
						<div css={styles.formHeading}>Verify your email</div>
					</div>
					<div css={styles.verificationMessage}>
						<div>We have sent verification link on your account.</div>
						<div>Also, check your spam folder if it's mussing </div>
					</div>
					<div css={styles.requestButton}>Request email again</div>
					<div css={styles.goBack} onClick={goBack}>
						🔙 Go back
					</div>
				</div>
			</AuthenticationDarkTemplate>
		</div>
	);
}

const styles = {
	form: css`
		width: 26rem;
		padding: 1.5rem 1.5rem;
		background: #ffffff;
		border: 1px solid #d6ddff;
		box-sizing: border-box;
		border-radius: 12px;

		margin-bottom: 2rem;
	`,
	headingContainer: css`
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	`,
	formHeading: css`
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.6;
		color: #513879;
	`,
	forgotPassword: css`
		font-weight: normal;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #2b2b39;
		:hover {
			text-decoration: underline;
			cursor: pointer;
		}
	`,
	emailPassContainer: css`
		margin-bottom: 1.65rem;
	`,
	emailInput: css`
		width: 100%;
	`,
	inputElement: css`
		border: 1px solid #d6ddff;
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.9rem 1.5rem;
		&:not(:first-child) {
			margin-top: 1.55rem;
		}
		::placeholder {
			font-size: 1rem;
			line-height: 1rem;
			color: #afb2bb;
		}
	`,
	requestButton: css`
		padding: 1.05rem;
		background: #5b76f7;
		border: 1px solid #5b76f7;
		box-sizing: border-box;
		border-radius: 5px;
		color: #fff;

		display: flex;
		justify-content: center;

		font-weight: 500;
		font-size: 1.057rem;
		line-height: 1.3rem;

		cursor: pointer;

		margin-top: 2rem;
		margin-bottom: 1rem;
	`,
	googleLoginButton: css`
		display: flex;
		align-item: center;
		justify-content: space-between;

		border: 1px solid #e1e1e1;
		box-sizing: border-box;
		border-radius: 5px;
		width: 100%;
		padding: 1rem 1.75rem;
		margin-bottom: 1rem;

		font-size: 1rem;
		line-height: 1.375rem;
		font-weight: 500;
		color: #513879;

		cursor: pointer;
	`,
	accountCreationContainer: css`
		width: 26rem;
		padding: 0 1.5rem;
		display: flex;
		align-items: center;
		flex-direction: column;
	`,
	LoginButton: css`
		display: flex;

		font-size: 1.05rem;
		line-height: 1.05rem;

		margin-bottom: 2rem;
		color: #ffffff;
		line-height: 1.6rem;
		&:hover {
			color: #fff !important;
		}
	`,
	registerButton: css`
		display: flex;
		justify-content: center;
		width: 100%;
		background: #5b76f7;
		border-radius: 5px;
		font-size: 1.06rem;
		padding: 1.13rem;
		color: #fff;
		cursor: pointer;
	`,
	passwordInput: css`
		width: 100%;
	`,
	verificationMessage: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 1rem;
		line-height: 26px;
		color: #2b2b39;
	`,
	goBack: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 0.875rem;
		line-height: 18px;
		text-align: center;
		color: #2b2b39;
		cursor: pointer;
	`,
};

EmailVerification.getInitialProps = async () => {
	return {};
};

export default WithSession(EmailVerification, EMAIL_NOT_VERIFIED);
