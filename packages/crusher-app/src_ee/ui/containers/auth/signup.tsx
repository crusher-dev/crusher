import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React from "react";

import { useAtom } from "jotai";

import { Text } from "dyson/src/components/atoms/text/Text";

import { inviteCodeUserKeyAtom } from "@store/atoms/global/inviteCode";
import { getGithubLoginURL } from "@utils/core/external";

import BaseContainer from "./components/BaseContainer";
import { Line, NewButton, purpleButton } from "./login";

export const GithubSVG = function (props) {
	return (
		<svg width={16} height={16} viewBox={"0 0 16 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M8 0a8 8 0 0 0-2.529 15.591c.4.074.529-.174.529-.384v-1.49c-2.225.484-2.689-.944-2.689-.944-.364-.924-.888-1.17-.888-1.17-.726-.497.055-.486.055-.486.803.056 1.226.824 1.226.824.713 1.223 1.871.87 2.328.665.071-.517.279-.87.508-1.07-1.777-.203-3.645-.889-3.645-3.953 0-.874.313-1.588.824-2.148-.082-.202-.356-1.016.078-2.117 0 0 .672-.215 2.201.82A7.673 7.673 0 0 1 8 3.868c.68.004 1.365.093 2.004.27 1.527-1.035 2.198-.82 2.198-.82.435 1.102.161 1.916.079 2.117.513.56.823 1.274.823 2.148 0 3.072-1.871 3.749-3.653 3.947.287.248.549.735.549 1.481v2.196c0 .212.128.462.534.384A8.002 8.002 0 0 0 8 0Z"
				fill="#fff"
			/>
		</svg>
	);
};

export default function SignupInitial({ loginWithEmailHandler }) {
	const router = useRouter();
	const { query } = router;
	const [sessionInviteCode, setSessionInviteCode] = useAtom(inviteCodeUserKeyAtom);
	const handleGithub = () => {
		if (!sessionInviteCode) {
			alert("Invite code needed to signup");
			return;
		}
		window.location.href = getGithubLoginURL(query?.inviteType?.toString(), query?.inviteCode?.toString(), sessionInviteCode);
	};
	return (
		<BaseContainer>
			<div css={overlayContainer} className={"mt-56 pb-60"}>
				<div className={"mb-42"}>
					<NewButton onClick={handleGithub} css={purpleButton} svg={<GithubSVG className="mr-12" />} text={"Continue with Github"} />
					<Line />
					<NewButton svg={null} text={"Signup with email"} className={"mt-0"} onClick={loginWithEmailHandler} />
				</div>
				<div className="flex w-full justify-center">
					<Text css={[underLineonHover, helpCSS]} fontSize={14}>
						Need help?
					</Text>
				</div>
			</div>
			<div onClick={() => router.push("/login")} className="flex w-full justify-center mt-40">
				<Text
					color={"#565657"}
					fontSize={14}
					css={css`
						font-size: 14.5rem;
						:hover {
							text-decoration: underline;
						}
					`}
				>
					Or{" "}
					<span
						css={css`
							color: #855aff;
						`}
					>
						Login
					</span>
				</Text>
			</div>
		</BaseContainer>
	);
}

const helpCSS = css`
	color: #565657;
`;

const overlayContainer = css(`
	width: 368rem;
`);

const underLineonHover = css`
	:hover {
		text-decoration: underline;
	}
`;
