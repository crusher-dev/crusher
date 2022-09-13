import { css } from "@emotion/react";
import { Logo } from "dyson/src/components/atoms";
import { ClickableText } from "dyson/src/components/atoms/clickacbleLink/Text";
import { Conditional } from "dyson/src/components/layouts";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function ExternalLink(props: any) {
	return (
		<svg width={9} height={9} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.651 1.001c.24.216.259.585.043.824L2 8c-.215.24-.76.216-1 0-.239-.216-.215-.76 0-1l5.827-5.956a.583.583 0 01.824-.043z"
				fill="#3C3C3D"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M.853 1.77a.583.583 0 01.552-.613L7.23.852a.583.583 0 01.613.552l.305 5.826a.583.583 0 11-1.165.06L6.71 2.049l-5.243.275a.583.583 0 01-.613-.552z"
				fill="#3C3C3D"
			/>
		</svg>
	);
}

export const LoginNavBar = () => {
	const { route } = useRouter();
	const loginPage = route === "/login";
	return (
		<div className="flex justify-between items-center" css={topBar}>
			<a href="https://crusher.dev" css={logoCSS}>
				<Logo height={20} />
			</a>

			<div css={linkSection} className="flex">
				<a className="text-14" href="https://docs.crusher.dev" target="_blank">
					<ClickableText paddingY={4} className="flex items-center text-14">
						<span className="mr-4">Docs</span> <ExternalLink />{" "}
					</ClickableText>
				</a>
				<Conditional showIf={loginPage}>
					<Link className="text-14" href="/signup">
						<ClickableText paddingY={4} className="text-14">
							Signup
						</ClickableText>
					</Link>
				</Conditional>

				<Conditional showIf={!loginPage}>
					<Link className="text-14" href="/login">
						<ClickableText paddingY={4} className="text-14">
							Login
						</ClickableText>
					</Link>
				</Conditional>
			</div>
		</div>
	);
};

const logoCSS = css`
	:hover {
		filter: brightness(0.75);
	}
`;

const topBar = css`
	margin: 0 auto;
	width: 980rem;
	padding: 0 30px;
	max-width: 100%;
`;

const linkSection = css`
	a:hover {
		color: #c5c5c5;
		text-decoration: underline;
	}
	a {
		color: #c5c5c5;
		font-size: 14px;
	}
`;
