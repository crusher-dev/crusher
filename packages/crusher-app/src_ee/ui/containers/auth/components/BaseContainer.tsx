import { css } from "@emotion/react";
import React from "react";

import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { Text } from "dyson/src/components/atoms/text/Text";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";

import { LoginNavBar } from "@ui/containers/common/login/navbar";

export default function BaseContainer({ children }) {
	return (
		<div css={containerCSS}>
			<div className="pt-18">
				<LoginNavBar />
			</div>
			<div className={"flex justify-center"}>
				<div
					className={"flex flex-col items-center"}
					css={css`
						margin-top: 95rem;
					`}
				>
					<Heading
						type={1}
						fontSize={24}
						weight={900}
						css={css`
							letter-spacing: 0;
						`}
					>
						Get superpowers to ship{" "}
						<span
							css={css`
								color: #9446dd;
							`}
						>
							fast
						</span>{" "}
						and{" "}
						<span
							css={css`
								color: #9446dd;
								margin-right: 9px;
							`}
						>
							better
						</span>
						<Text fontSize={16}>🚀</Text>
					</Heading>
					<TextBlock fontSize={15} color={"#4D4D4D"} className={"mt-14"} leading={false}>
						Devs use crusher to test website fast, ship fast. Get started in seconds
					</TextBlock>

					{children}
				</div>
			</div>
		</div>
	);
}

const containerCSS = css(`
height: 100vh;
background: linear-gradient(180deg,#080808 0%,#0A0A0A 100%);
width: 100vw;
`);
