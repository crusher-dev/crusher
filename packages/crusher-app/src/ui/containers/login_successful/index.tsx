import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React from "react";

const LoginSuccessfulContainer = () => {
	const router = useRouter();

	const handleGoBack = () => {
		router.push("/");
	};

	return (
		<div css={containerCss}>
			<div css={contentCss}>
				<div css={modalCss}>
					<ProfileIcon css={profileIconCss} />
					<div css={loginSuccessfulTextCss}>Login Successful!</div>
					<div css={returnTextCss}>you can return to your flow</div>
				</div>
				<div css={goBackLinkCSS} onClick={handleGoBack}>Go back</div>
			</div>
		</div>
	);
};

const goBackLinkCSS = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	text-align: center;
	letter-spacing: 0.03em;

	color: rgba(255, 255, 255, 0.62);
	margin-top: 24rem;
	:hover {
		opacity: 0.8;
	}
	text-align: center;
`;
const profileIconCss = css`
	width: 26rem;
	height: 26rem;
`;
const loginSuccessfulTextCss = css`
	font-family: "Cera Pro";
	font-style: normal;
	font-weight: 900;
	font-size: 20rem;
	margin-top: 28rem;
	text-align: center;

	color: #ffffff;
`;
const returnTextCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	text-align: center;
	letter-spacing: 0.03em;
	margin-top: 12rem;
	color: rgba(255, 255, 255, 0.62);
`;
const containerCss = css`
	padding-top: 208rem;
	background: rgb(10, 11, 13, 1);
	height: 100vh;
`;
const contentCss = css`
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	width: 480rem;
`;
const modalCss = css`
	background: rgba(217, 217, 217, 0.03);
	border: 0.5px solid rgb(255 236 236 / 6%);
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 55rem 0rem;
`;

const ProfileIcon = (props: any) => (
	<svg viewBox={"0 0 29 29"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			opacity={0.1}
			fillRule="evenodd"
			clipRule="evenodd"
			d="M1.188 14.114C1.188 3.314 3.538 1 14.5 1c10.963 0 13.313 2.315 13.313 13.114 0 6.28-.795 9.692-3.617 11.446l-.467-1.424c-.496-1.76-1.4-2.929-2.925-3.635-1.492-.691-3.546-.923-6.304-.923-2.76 0-4.815.25-6.308.961-1.523.725-2.425 1.91-2.92 3.668l-.46 1.358C1.984 23.812 1.187 20.4 1.187 14.114ZM9.693 11.2c0-2.616 2.152-4.736 4.807-4.736 2.655 0 4.807 2.12 4.807 4.736 0 2.615-2.152 4.735-4.807 4.735-2.655 0-4.807-2.12-4.807-4.735Z"
			fill="#121418"
		/>
		<path
			d="M1.188 14.114C1.188 3.314 3.538 1 14.5 1c10.963 0 13.313 2.315 13.313 13.114 0 10.799-2.35 13.114-13.313 13.114-10.963 0-13.313-2.315-13.313-13.114Z"
			fill="#121418"
			stroke="#AE80F9"
			strokeWidth={2}
		/>
		<path
			d="M18.938 11.2c0 2.414-1.987 4.37-4.438 4.37-2.45 0-4.438-1.956-4.438-4.37 0-2.415 1.987-4.372 4.438-4.372 2.45 0 4.438 1.957 4.438 4.371Z"
			fill="#121418"
			stroke="#AE80F9"
			strokeWidth={2}
		/>
		<path d="M5.625 24.314c.944-3.362 3.372-4.372 8.875-4.372s7.931.937 8.875 4.298" fill="#121418" />
		<path d="M5.625 24.314c.944-3.362 3.372-4.372 8.875-4.372s7.931.937 8.875 4.298" stroke="#AE80F9" strokeWidth={2} strokeLinecap="round" />
	</svg>
);

export { LoginSuccessfulContainer };
