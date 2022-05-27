import { Card } from "@components/common/card";
import { getTestListAPI } from "@constants/api";
import { USER_META_KEYS } from "@constants/USER";
import { css } from "@emotion/react";
import { usePageTitle } from "@hooks/seo";
import { currentProject } from "@store/atoms/global/project";
import { onboardingStepAtom, OnboardingStepEnum } from "@store/atoms/pages/onboarding";
import { updateMeta } from "@store/mutators/metaData";
import { LoadingSVG } from "@svg/dashboard";
import { CopyIconSVG } from "@svg/onboarding";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";
import { resolvePathToBackendURI } from "@utils/common/url";
import { Button, Input, Text } from "dyson/src/components/atoms";
import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";

const CopyCommandInput = ({ command }: { command: string }) => {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const copyToClipbaord = React.useCallback(() => {
		inputRef.current.select();
		document.execCommand("copy");
		sendSnackBarEvent({ type: "normal", message: "Copied to clipboard!" });
	}, []);
	return (
		<Input
			css={css`
				width: 240rem;
				user-select: none;
				height: 40rem;
				input {
					cursor: default;
					background: rgba(0, 0, 0, 0.49);
					height: 40rem;
					user-select: none;
				}
				:hover {
					input {
						background: rgba(255, 255, 255, 0.03);
					}
					svg {
						opacity: 1;
					}
				}
			`}
			initialValue={command}
			//@ts-ignore
			readOnly={true}
			rightIcon={
				<CopyIconSVG
					onClick={copyToClipbaord}
					css={css`
						opacity: 0.42;
					`}
				/>
			}
			ref={inputRef}
			onClick={copyToClipbaord}
		/>
	);
};

const CliRepoIntegration = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const [project] = useAtom(currentProject);
	const [commands, setCommnads] = React.useState(["", ""]);
	const [, updateOnboarding] = useAtom(updateMeta);

	React.useEffect(() => {
		backendRequest(resolvePathToBackendURI("/integrations/cli/commands"), {
			method: RequestMethod.GET,
		}).then((res) => {
			if (res) {
				setCommnads(res);
			}
		});

		const testCreatedPoll = setInterval(async () => {
			const res = await backendRequest(getTestListAPI(project.id), { method: RequestMethod.GET });
			if (res.list.length) {
				setOnboardingStep(OnboardingStepEnum.SUPPORT_CRUSHER);
				clearInterval(testCreatedPoll);
			}
		}, 1000);
	}, []);

	usePageTitle("Create & Run your first test");

	const handleSkipOnboarding = () => {
		updateOnboarding({
			type: "user",
			key: USER_META_KEYS.INITIAL_ONBOARDING,
			value: true,
		});
	};

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

				<Card type="focus" className={"mt-56 py-24 pb-40"}>
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
							<CopyCommandInput command={commands[0]} />
						</div>
						<div className={"flex items-center justify-between mt-16"}>
							<CopyCommandInput command={commands[1]} />
							<span
								className={"text-13"}
								css={css`
									color: #af7eff;
								`}
							></span>
						</div>
					</div>
				</Card>
				<Card type={"normal"} className={"mt-32 py-16"}>
					<div className={" px-16 flex items-center justify-between"}>
						<div
							className={"flex"}
							css={css`
								align-items: center;
							`}
						>
							<span
								className={"text-11 font-700"}
								css={css`
									color: rgba(255, 255, 255, 0.23);
								`}
							>
								2.)
							</span>
							<span className={"text-16 font-cera font-700 ml-16"}>Push changes to origin</span>
							<LoadingSVG
								className={"ml-8"}
								css={css`
									width: 16rem;
									height: 16rem;
								`}
							/>
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
				</Card>
				<div className={"flex justify-end mt-28"}>
					<Link href={"/app/dashboard"}>
						<Text
							onClick={handleSkipOnboarding}
							css={css`
								:hover {
									opacity: 0.9;
								}
							`}
							fontSize={13}
						>
							Skip setup and show me the dashboard
						</Text>
					</Link>
				</div>
			</div>
		</>
	);
};

export { CliRepoIntegration };
