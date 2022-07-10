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
			values: [
				{
					key: USER_META_KEYS.SUPPORT_CRUSHER,
					value: true,
				},
				{
					key: USER_META_KEYS.INITIAL_ONBOARDING,
					value: true,
				},
			],
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

				<div className={"flex mt-56"}>
					<div className={"px-32 py-24"} css={githubCSS}>
						<div className={"flex justify-between "}>
							<Text fontSize={16} weight={700} color={"#ce79ea"}>
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
	background: #0c0d0e;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	border: 1px solid #131516;
	width: 50%;
	height: 220px;
`;

const discordCSS = css`
	background: #0c0d0e;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	border: 1px solid #131516;
	border-left-width: 0;
	width: 50%;
	height: 220px;
`;

export { SupportCrusher };
