import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { atom, useAtom } from "jotai";

import { Button, GithubSocialBtn, Input } from "dyson/src/components/atoms";
import { VideoComponent } from "dyson/src/components/atoms/video/video";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";

import { USER_META_KEYS } from "@constants/USER";
import { EditionTypeEnum } from "@crusher-shared/types/common/general";
import { ModuleCard } from "@ui/containers/onboarding/ModuleCard";
import { getBoolean } from "@utils/common";
import { sendSnackBarEvent } from "@utils/common/notify";
import { isTempTestPending } from "@utils/user";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";

import { usePageTitle } from "../../../hooks/seo";
import { systemConfigAtom } from "../../../store/atoms/global/systemConfig";
import { userAtom } from "../../../store/atoms/global/user";
import { updateMeta } from "../../../store/mutators/metaData";
import { getEdition } from "../../../utils/helpers";
import { backendRequest } from "@utils/common/backendRequest";
import { setupOSS, USER_SYSTEM_API } from "@constants/api";
import { selectInitialProjectMutator, updateInitialDataMutator } from "@store/mutators/user";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";
import { Text } from "dyson/src/components/atoms/text/Text";
import { GithubSVG } from "@svg/social";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { addScript } from "@utils/common/scriptUtils";

enum ONBOARDING_STEP {
	SETUP,
	TUTORIAL,
	SUPPORT,
}

const onboardingStepAtom = atom<ONBOARDING_STEP>(getEdition() === EditionTypeEnum.EE ? ONBOARDING_STEP.TUTORIAL : ONBOARDING_STEP.SETUP);

const setupOSSFn = () => {
	return backendRequest(setupOSS);
};

const DiscordSVG = (props) => (
	<svg width={26} height={27} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<g clipPath="url(#a)">
			<path
				d="M22.01 5.776a21.697 21.697 0 0 0-5.292-1.615.08.08 0 0 0-.085.04c-.229.4-.482.92-.66 1.331a20.114 20.114 0 0 0-5.943 0A13.38 13.38 0 0 0 9.36 4.2a.084.084 0 0 0-.084-.04 21.636 21.636 0 0 0-5.293 1.616.075.075 0 0 0-.034.03C.578 10.76-.346 15.592.107 20.365a.087.087 0 0 0 .034.06 21.698 21.698 0 0 0 6.493 3.23c.033.01.07-.002.09-.03.5-.672.947-1.38 1.329-2.126a.08.08 0 0 0-.045-.112 14.302 14.302 0 0 1-2.028-.951.081.081 0 0 1-.008-.137c.136-.1.272-.204.402-.31a.082.082 0 0 1 .084-.011c4.255 1.911 8.862 1.911 13.067 0a.082.082 0 0 1 .085.01c.13.105.267.211.404.311a.081.081 0 0 1-.007.137c-.648.372-1.321.687-2.03.95a.081.081 0 0 0-.044.113c.39.745.837 1.453 1.328 2.125.02.029.057.04.09.03a21.627 21.627 0 0 0 6.503-3.229.082.082 0 0 0 .034-.058c.542-5.519-.908-10.312-3.844-14.562a.066.066 0 0 0-.034-.03ZM8.688 17.46c-1.28 0-2.336-1.157-2.336-2.578 0-1.422 1.035-2.579 2.336-2.579 1.312 0 2.357 1.167 2.337 2.579 0 1.42-1.035 2.578-2.337 2.578Zm8.64 0c-1.281 0-2.337-1.157-2.337-2.578 0-1.422 1.035-2.579 2.337-2.579 1.311 0 2.357 1.167 2.336 2.579 0 1.42-1.025 2.578-2.336 2.578Z"
				fill="#2D2E30"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" transform="translate(0 .91)" d="M0 0h26v26H0z" />
			</clipPath>
		</defs>
	</svg>
);

const SetupCrusher = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const [system] = useAtom(systemConfigAtom);

	const [, updateInitialData] = useAtom(updateInitialDataMutator);
	const [, selectInitialProject] = useAtom(selectInitialProjectMutator);

	useEffect(() => {
		const isWorkingFine = system.MONGO_DB_OPERATIONS && system.MYSQL_OPERATION && system.REDIS_OPERATION && system?.OPEN_SOURCE?.initialized;
		if (isWorkingFine) {
			setOnboardingStep(ONBOARDING_STEP.TUTORIAL);
		}
	}, []);

	const onInitialSetup = useCallback(() => {
		(async () => {
			await setupOSSFn();

			const dataToConsider = await backendRequest(USER_SYSTEM_API, {});
			updateInitialData(dataToConsider);
			selectInitialProject(dataToConsider);

			setOnboardingStep(ONBOARDING_STEP.TUTORIAL);
		})();
	}, []);

	return (
		<>
			<div className="m-8 text-18 leading-none mb-12 font-700">Setup Crusher</div>
			<div className="text-16 flex flex-col items-center mb-48">
				<span className={"mb-20 leading-none text-14"}>Just need to ensure our machines are working</span>
			</div>

			<div>
				<ModuleCard onClick={onInitialSetup.bind(this)} />
			</div>

			<Button
				css={css`
					width: 200rem;
					margin-top: 320rem;
					margin-bottom: 20rem;
					height: 34rem;
				`}
				onClick={onInitialSetup}
			>
				Install & Next
			</Button>
		</>
	);
};

const GitSVG = (props) => (
	<svg width={22} height={22} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M10.83 2c-.299 0-.554.106-.767.32L8.51 3.871l1.957 1.958a1.29 1.29 0 0 1 1.351.309c.178.177.291.386.341.627.05.241.039.482-.032.723L14 9.362c.242-.071.483-.082.724-.032s.454.166.638.35c.255.256.383.565.383.926 0 .362-.128.667-.383.915a1.28 1.28 0 0 1-.925.373 1.3 1.3 0 0 1-.926-.362 1.369 1.369 0 0 1-.351-.68 1.275 1.275 0 0 1 .074-.746L11.467 8.34v4.639a1.26 1.26 0 0 1 .723 1.16c0 .361-.127.67-.382.925a1.26 1.26 0 0 1-.926.383c-.361 0-.666-.128-.915-.383a1.28 1.28 0 0 1-.372-.926c0-.361.128-.67.383-.925a1.3 1.3 0 0 1 .426-.277v-4.68a.967.967 0 0 1-.426-.277 1.197 1.197 0 0 1-.372-.67 1.306 1.306 0 0 1 .074-.756L7.765 4.617 2.66 9.723c-.213.213-.32.472-.32.777 0 .305.107.564.32.777l7.426 7.425c.212.213.471.32.776.32.305 0 .564-.107.777-.32l7.404-7.404c.213-.213.32-.472.32-.777 0-.305-.107-.564-.32-.776l-7.426-7.426A1.07 1.07 0 0 0 10.83 2Z"
			fill="#fff"
		/>
	</svg>
);

const projects = ["Github", "Crusher", "Test", "Github", "Crusher", "Test", "Github", "Crusher", "Test"];
const SelectProject = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);

	usePageTitle("Select Project");
	return (
		<>
			<div
				css={css`
					width: 632rem;
				`}
			>
				<div className={"flex justify-between item-center"}>
					<div>
						<div className="text-18 leading-none mb-16 font-700 font-cera">Select repo</div>
						<div className={"text-14"}>You can create project for testing, deploy and logging.</div>
					</div>
					<Button bgColor={"tertiary-dark"}>Create Project</Button>
				</div>

				<div className={"flex justify-between item-center"} className={"mt-64"}>
					<div className={"text-14 leading-none mb-16 font-500 font-cera"}>Select repo to use</div>
				</div>

				<div css={selectProjectBox}>
					<div className={"flex justify-between items-center"}>
						<div>
							<Input
								placeholder={"search here"}
								css={css`
									input {
										background: transparent;
										border-width: 0 !important;
									}
									width: 500rem;
								`}
							/>
						</div>
						<SelectBox
							values={[{ value: "github", label: "value" }]}
							placeholder={"Select"}
							css={css`
								width: 220rem;
								margin-right: 16rem;

								.selectBox {
									border-width: 0;
									background: transparent;

									:hover {
										border-width: 0;
										background: rgba(255, 255, 255, 0.06);
									}
								}
							`}
						/>
					</div>
					<div
						className={"py-4"}
						css={css`
							border-top: 1px solid #21252f;
							height: 400rem;
							overflow-y: scroll;
						`}
					>
						{projects.map((project) => (
							<div
								className={"flex px-16 py-12 items-center"}
								css={css`
									:hover {
										background: rgba(0, 0, 0, 0.46);
									}
								`}
							>
								<GitSVG /> <span className={"text-14 ml-16 font-600 leading-none"}>{project}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

const Integration = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);

	usePageTitle("Select Project");
	return (
		<>
			<div
				css={css`
					width: 632rem;
				`}
			>
				<div className={"flex justify-between item-center"}>
					<div>
						<div className="text-18 leading-none mb-16 font-700 font-cera">Add crusher in your project in 2 mins</div>
						<div className={"text-13"}>Get ready to feel the change</div>
					</div>
				</div>

				<div css={focusCard} className={"mt-56 py-24 pb-40"}>
					<div className={"pb-8 px-16 "}>
						<span
							className={"text-11 font-700"}
							css={css`
								color: rgba(255, 255, 255, 0.23);
							`}
						>
							1.)
						</span>
						<span className={"text-16 font-cera font-700 ml-16"}>Create and run your first test</span>
					</div>

					<div className={"pl-44 pr-32 text-14 mb-32"}>We’ll also add handy script to run test with each commit.</div>

					<div className={"pl-44 pr-32"}>
						<div className={"flex mt-16"}>
							<Input value={"Google"} disabled={true} />
						</div>
						<div className={"flex items-center justify-between mt-16"}>
							<Input value={"Google"} disabled={true} />{" "}
							<span
								className={"text-13"}
								css={css`
									color: #af7eff;
								`}
							>
								Do it later on
							</span>
						</div>
					</div>
				</div>

				<div css={normalCard} className={"mt-32 py-16"}>
					<div className={" px-16 flex items-center justify-between"}>
						<div>
							<span
								className={"text-11 font-700"}
								css={css`
									color: rgba(255, 255, 255, 0.23);
								`}
							>
								2.)
							</span>
							<span className={"text-16 font-cera font-700 ml-16"}>Push changes to origin</span>
						</div>
						<Button
							size={"small"}
							css={css`
								width: 120rem;
							`}
						>
							Next
						</Button>
					</div>
				</div>

				<div className={"flex justify-end mt-28"}>
					<Text fontSize={13}>Skip setup and show me the dashboard</Text>
				</div>
			</div>
		</>
	);
};

const Support = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);

	usePageTitle("Select Project");

	useEffect(() => {
		addScript("github-start", {
			src: "https://buttons.github.io/buttons.js",
		});
	}, []);
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
							<Text fontSize={16} weight={700} color={"#C5EC72"}>
								Star Crusher on Github
							</Text>
							<GithubSVG />
						</div>

						<TextBlock className={"mt-20 mb-64"} fontSize={13}>
							We need love and support to make testing next-gen.
						</TextBlock>

						<a
							class="github-button"
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
							<Text fontSize={16} weight={700} color={"#71DDFF"}>
								Join discord
							</Text>
							<DiscordSVG />
						</div>

						<div className={"mt-14"}>
							<div
								css={css`
									background: #1b1d20;
									border-radius: 6px;
									min-height: 28rem;
									width: 28rem;
								`}
							></div>
						</div>
						<TextBlock showLineHeight={true} className={"mt-12"} fontSize={13}>
							Join community of builders who ship everyday
						</TextBlock>

						<Button
							className={"mt-20"}
							css={css`
								border-width: 0;
								background: #4fbadc;
								color: #242933;
								:hover {
									color: #242933;
									background: #4fbadc;
									border-width: 0;
								}
							`}
						>
							Join Channel
						</Button>
					</div>
				</div>

				<div className={"flex justify-center mt-40"}>
					<Button
						size={"medium"}
						css={css`
							width: 160rem;
						`}
					>
						Open app
					</Button>
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

const normalCard = css`
	border: 1px solid rgba(255, 255, 255, 0.09);
	border-radius: 2px;
`;

const focusCard = css`
	border: 1px solid rgba(104, 164, 255, 0.93);
	border-radius: 2px;
	background: #0a0b0c;
`;

const selectProjectBox = css`
	background: #0c0d0f;
	border: 1px solid #21252f;
	border-radius: 6px;
	overflow: hidden;
`;

const GithubDiscordSection = () => {
	const [githubStars, setGithubStars] = useState(0);

	const openLinkInNewTab = useCallback((url) => {
		window.open(url, "_blank").focus();
	}, []);

	usePageTitle("Support");
	useEffect(() => {
		fetch("https://api.github.com/repos/crusherdev/crusher")
			.then((res) => res.json())
			.then((json) => {
				setGithubStars(json.stargazers_count);
			});
	});

	const [, updateOnboarding] = useAtom(updateMeta);
	return (
		<>
			<div className="mb-56 text-17 text-center font-400">
				"We help devs ship HQ fast. We do this by eliminating chores and removing noise from their workflow."
			</div>
			<div className=" text-16 font-600 flex flex-col items-center mb-56">
				<span className={"mb-20 leading-none"}>If you like crusher, give it a star 🔯</span>
				<div>
					<GithubSocialBtn count={githubStars} onClick={openLinkInNewTab.bind(this, "https://github.com/crusherdev/crusher")} />
				</div>
			</div>

			<Link href={isTempTestPending() ? "/app/tests" : "/app/dashboard"}>
				<Button
					className="mt-100"
					css={css`
						width: 220px;
						height: 34rem;
					`}
					onClick={() => {
						updateOnboarding({
							type: "user",
							key: USER_META_KEYS.INITIAL_ONBOARDING,
							value: true,
						});
					}}
				>
					Open Dashboard
				</Button>
			</Link>
		</>
	);
};

const GetViewByStep = () => {
	const [step] = useAtom(onboardingStepAtom);

	switch (step) {
		case 0:
			return <SetupCrusher />;
		case 1:
			return <Support />;
		case 2:
			return <GithubDiscordSection />;
		default:
			return null;
	}
};

const CrusherOnboarding = () => {
	const router = useRouter();
	const [user] = useAtom(userAtom);

	useEffect(() => {
		// if (isTempTestPending()) {
		// 	sendSnackBarEvent({ message: "Your test will be saved after onboarding" });
		// }
		//
		// if (getBoolean(user?.meta.INITIAL_ONBOARDING)) {
		// 	router.push("/app/dashboard");
		// }
	}, []);

	const steps = ["Choose", "Create and run test", "Last step"];
	return (
		<CrusherBase>
			<div css={contentContainer}>
				<div className={"flex items-center"}>
					{steps.map((name, i) => (
						<div className={"flex items-center"}>
							<div className={"text-13 leading-none "}>{name}</div>
							<Conditional showIf={i < steps.length - 1}>
								<div
									css={css`
										min-height: 2px;
										min-width: 40px;
										background: #515151;
									`}
									className={"mr-20 ml-20"}
								></div>
							</Conditional>
						</div>
					))}
				</div>
				<div className="flex mt-100">
					<GetViewByStep />
				</div>
			</div>
		</CrusherBase>
	);
};

const contentContainer = css`
	width: 890rem;
	margin: 0 auto;
	padding-top: 48rem;
`;
const containerCSS = css`
	max-width: 473rem;
`;

export { CrusherOnboarding };
