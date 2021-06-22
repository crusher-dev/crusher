import Head from "next/head";
import { useContext, useState } from "react";
// import Checkbox from "@material-ui/core/Checkbox";
import withoutSession from "@hoc/withoutSession";
import { AuthenticationTemplate } from "@ui/template/authenticationDark";
import { css } from "@emotion/core";

import { COLORS, ThemeContext } from "@constants/style";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

const SelectBox = css`
	border: 2px solid #5f5f5f;
	box-sizing: border-box;
	border-radius: 5px;
	display: flex;
	padding: 0.55rem 0.5rem 0.75rem 0.75rem;
	.MuiCheckbox-colorPrimary.Mui-checked {
		color: #323232 !important;
	}
	div > span {
		padding: 0;
		padding-right: 0.5rem;
		padding-top: 0.1rem;
	}
`;

const headingStyle = css`
	font-weight: 700;
	color: #302b2b;
	font-size: 0.92rem;
`;

const bookDescription = css`
	color: #5f5f5f;
	font-size: 0.82rem;
`;

function CrusherSelectBox({ checked, setChecked, text, description }) {
	const handleChange = (event) => {
		setChecked(event.target.checked);
	};

	return (
		<div css={SelectBox}>
			<div>
				{/*<Checkbox defaultChecked color="primary" checked={checked} onChange={handleChange} inputProps={{ "aria-label": "secondary checkbox" }} />*/}
			</div>
			<div>
				<div css={headingStyle}>{text}</div>
				<div css={bookDescription}>{description}</div>
			</div>
		</div>
	);
}

function PhoneInputElement({ phone, setPhoneNumber }) {
	return <PhoneInput country={"us"} value={phone} enableSearch={true} onChange={(phone) => setPhoneNumber(phone)} />;
}

function GetStartedScreem() {
	const theme = useContext(ThemeContext);
	const [phone, setPhoneNumber] = useState("");
	const [checked, setChecked] = React.useState(true);
	const handleNext = () => {
		alert("Handle next event here. Probably airtable");
	};

	function BookMeetingScreen() {
		return (
			<div>
				<Head>
					<title>Schedule meeting | Crusher</title>
				</Head>

				<AuthenticationTemplate>
					<div css={styles.form(theme)}>
						<div css={styles.headingContainer}>
							<div css={styles.formHeading(theme)}>Your account has been created</div>
						</div>

						<CrusherSelectBox
							checked={checked}
							setChecked={setChecked}
							text={"Connect with a Crusher team member"}
							description={"Tell us about your use case and we’ll show you what's possible."}
						/>

						<form>
							<div css={styles.inputContainer}>{checked && <PhoneInputElement phone={phone} setPhoneNumber={setPhoneNumber} />}</div>
						</form>
						<div css={styles.requestButton} onClick={handleNext} className={"button"}>
							Next
						</div>
					</div>
				</AuthenticationTemplate>
			</div>
		);
	}

	return BookMeetingScreen();
}

GetStartedScreem.getInitialProps = (ctx) => {
	return {};
};

const styles = {
	form: (theme) => css`
		width: 26rem;
		padding: 1.5rem 1.5rem;

		// border: 1px solid ${theme === "dark" ? "#2E3139" : "#d6ddff"};
		// box-sizing: border-box;
		border-radius: 12px;

		margin-bottom: 2rem;
	`,
	headingContainer: css`
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	`,
	formHeading: (theme) => css`
		font-weight: 700;
		font-size: 1.15rem;
		line-height: 1.6;
		color: ${theme === "dark" ? "#fff" : COLORS.dark1};
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
	inputContainer: css`
		margin-bottom: 2.5rem;
		margin-top: 1.75rem;
	`,
	phoneInput: css`
		margin-top: 1.25rem;
		margin-bottom: 2rem;
		width: 100%;
	`,
	inputElement: (theme) => css`
		border: 1px solid ${theme === "dark" ? "#15181E" : "#d6ddff"};
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.9rem 1.5rem;

		background: ${theme === "dark" ? "#15181E" : "#fff"};
		color: ${theme === "dark" ? "#B0B2BB" : "#15181E"};
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
		padding: 0.9rem;
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

		margin-bottom: 2.75rem;
	`,
	accountCreationContainer: css`
		width: 26rem;
		padding: 0 1.5rem;
		display: flex;
		align-items: center;
		flex-direction: column;
		color: #fff;
		text-decoration: underline;
	`,
	LoginButton: (theme) => css`
		display: flex;

		font-size: 1.05rem;
		line-height: 1.05rem;

		margin-bottom: 2rem;
		color: ${theme === "dark" ? "#FFF" : COLORS.dark1};
		line-height: 1.6rem;
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
};

export default withoutSession(GetStartedScreem);
