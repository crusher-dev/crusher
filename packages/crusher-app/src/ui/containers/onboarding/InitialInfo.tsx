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
import React, { useState } from "react";
import { Conditional } from "dyson/src/components/layouts";

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
			forwardRef={inputRef}
			onClick={copyToClipbaord}
		/>
	);
};

const InitialInfo = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const [project] = useAtom(currentProject);
	const [commands, setCommnads] = React.useState(["", ""]);
	const [, updateOnboarding] = useAtom(updateMeta);

	const [profileType, setProfileType] = useState(null);
	const [otherProfile, setOtherProfile] = useState(false);

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
					color: #dcdcdc;
					margin-top: 60rem;
				`}
			>
				<div
					className="text-20 mt-28 font-700"
					css={css`
						color: #fff;
					`}
				>
					What's your role?
				</div>

				<div
					className={"text-13 mt-12"}
					css={css`
						letter-spacing: 0.45px;
					`}
				>
					We'll curate experience based on this
				</div>

				{/*<div className={"flex mt-32 items-center"}>*/}

				{/*	<Input  size={"large"} placeholder={"Enter the URL of the website"} css={css`width: 360rem; background: transparent;`}/>*/}
				{/*	<Button className={"ml-16"} size={"large"} css={css`min-width: 152rem;`}> Go </Button>*/}
				{/*</div>*/}

				<Conditional showIf={!otherProfile}>
					<div className={"flex mt-28"}>
						{["Developer", "Product", "QA"].map((profile) => {
							return (
								<div css={[buttonCSS, profile === profileType && selected]} key={profile} onClick={setProfileType.bind(this, profile)}>
									{profile}
								</div>
							);
						})}
					</div>
					<div className={"underline mt-20 text-14 font-500"} onClick={setOtherProfile.bind(this, true)} css={link}>
						Other Profile
					</div>
				</Conditional>

				<Conditional showIf={otherProfile}>
					<Input
						className={"flex mt-28"}
						size={"big-medium"}
						placeholder={"What's your role"}
						css={css`
							width: 360rem;
							input {
								background: transparent;
							}
						`}
					/>

					<div className={"underline mt-22 text-14 font-500"} onClick={setOtherProfile.bind(this, false)} css={link}>
						Go back
					</div>
				</Conditional>

				<Button
					className={"mt-56"}
					size={"big-medium"}
					css={css`
						min-width: 152rem;
					`}
				>
					{" "}
					Next{" "}
				</Button>
			</div>
		</>
	);
};

const link = css`
	:hover {
		color: #a488e4;
	}
`;

const buttonCSS = css`
	border-radius: 6px;
	border: 1px solid #454545;
	height: 44rem;
	width: 188rem;
	font-size: 16rem;
	display: flex;
	line-height: 1;
	justify-content: center;
	align-items: center;
	margin-right: 20rem;
	font-weight: 500;
	:hover {
		border-color: #814eef;
		background: rgba(129, 78, 239, 0.05);
	}
`;

const selected = css`
	border-color: #814eef;
	background: rgba(129, 78, 239, 0.05);
`;

export { InitialInfo };
