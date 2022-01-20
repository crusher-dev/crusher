import { usePageTitle } from "@hooks/seo";
import { onboardingStepAtom } from "@store/atoms/pages/onboarding";
import { addScript } from "@utils/common/scriptUtils";
import { useAtom } from "jotai";
import React from "react";
import { Button, Text } from "dyson/src/components/atoms";
import { GithubSVG } from "@svg/social";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { DiscordSVG } from "@svg/onboarding";
import { css } from "@emotion/react";
import { updateMeta } from "@store/mutators/metaData";
import { USER_META_KEYS } from "@constants/USER";
import Link from "next/link";

const SupportCrusher = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const [, updateOnboarding] = useAtom(updateMeta);

	usePageTitle("Support crusher");

	React.useEffect(() => {
		addScript("github-start", {
			src: "https://buttons.github.io/buttons.js",
		});
	}, []);

	const handleOpenApp = () => {
		updateOnboarding({
			type: "user",
			key: USER_META_KEYS.INITIAL_ONBOARDING,
			value: true,
		});
	};

	const openDiscord = () => {
		window.open("https://discord.gg/QWZqZWq", "_blank");
	};

	return (
		<>
			<div className={"w-full"}>
				<div className={"flex justify-between item-center"}>
					<div>
						<div className="text-18 leading-none mb-16 font-700 font-cera">Crusher is open for all</div>
						<div className={"text-13"}>Join community to learn from devs on how to use crusher.</div>
					</div>
				</div>

				<div className={"flex mt-80"}>
					<div className={"px-32 py-24"} css={githubCSS}>
						<div className={"flex justify-between "}>
							<Text fontSize={16} weight={700} color={"#ff6ef4"}>
								Star Crusher on Github
							</Text>
							<GithubSVG />
						</div>

						<TextBlock className={"mt-20 mb-64"} fontSize={13}>
							We need love and support to make testing next-gen.
						</TextBlock>

						<a
							className="github-button"
							href="https://github.com/crusherdev/crusher"
							data-size="large"
							data-show-count="true"
							aria-label="Star crusherdev/crusher on GitHub"
						>
							Star
						</a>
					</div>
					<div className={"px-32 py-24"} css={discordCSS}>
						<div className={"flex justify-between"}>
							<Text fontSize={16} weight={700} color={"#5865F2"}>
								Join discord
							</Text>
							<DiscordSVG />
						</div>

						{/*<div className={"mt-14"}>*/}
						{/*	<div*/}
						{/*		css={css`*/}
						{/*			background: #1b1d20;*/}
						{/*			border-radius: 6px;*/}
						{/*			min-height: 28rem;*/}
						{/*			width: 28rem;*/}
						{/*		`}*/}
						{/*	></div>*/}
						{/*</div>*/}
						<TextBlock showLineHeight={true} className={"mt-8 mb-40"} fontSize={13}>
							Join community of builders who ship everyday
						</TextBlock>

						<Button
							className={"mt-20 px-26"}
							css={css`
								border-width: 0;
								background: #5865f2;
								color: #fff;

								padding-left: 20rem;
								padding-right: 20rem;
								:hover {
									background: #4c59dc;
									border-width: 0;
								}
							`}
							onClick={openDiscord}
						>
							Join discord
						</Button>
					</div>
				</div>

				<div className={"flex justify-center mt-52"}>
					<Link href={"/app/tests"}>
						<Button
							size={"medium"}
							css={css`
								width: 160rem;
							`}
							onClick={handleOpenApp.bind(this)}
						>
							Open app
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
};

const githubCSS = css`
	background: #0c0d0f;
	border-top-left-radius: 6px;
	border-bottom-left-radius: 6px;
	border: 1px solid #21252f;
	width: 50%;
	height: 220px;
`;

const discordCSS = css`
	background: #0c0d0f;
	border-top-right-radius: 6px;
	border-bottom-right-radius: 6px;
	border: 1px solid #21252f;
	border-left-width: 0;
	width: 50%;
	height: 220px;
`;

export { SupportCrusher };
