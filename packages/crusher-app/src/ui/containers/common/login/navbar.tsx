import { css } from "@emotion/react";
import { Logo } from "dyson/src/components/atoms";
import { ClickableText } from "dyson/src/components/atoms/clickacbleLink/Text";
import React from "react";

export const LoginNavBar = () => {
	return (
		<div className="flex justify-between items-center" css={topBar}>
			<Logo height={24} />

			<div css={linkSection} className="flex">
				<a className="text-14" href="https://docs.crusher.dev" target="_blank">
					{" "}
					<ClickableText paddingY={4}>Docs</ClickableText>
				</a>
				<a className="text-14" href="https://github.com/crusherdev/crusher" target="_blank">
					{" "}
					<ClickableText paddingY={4}>Github</ClickableText>
				</a>
			</div>
		</div>
	);
};

const topBar = css`
	margin: 0 auto;
	width: 1400px;
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
