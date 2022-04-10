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
			forwardRef={inputRef}
			onClick={copyToClipbaord}
		/>
	);
};

const URLOnboarding = () => {
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
					color: #DCDCDC; margin-top: 60rem;
				`}
			>
				<div>
						<div className="text-14 leading-none mb-36 font-400 font-cera" css={css`letter-spacing: 0.2px;`}>Create a test</div>
				</div>

				<div  className="text-20 font-700" css={css`color: #fff;`} >
					Enter the URL of the website
				</div>

				<div className={"text-13 mt-12"} css={css`letter-spacing: 0.4px;`}>
					We'll create a test to checks page is loading perfectly
				</div>

				<div className={"flex mt-32 items-center"}>

					<Input  size={"large"} placeholder={"Enter the URL of the website"} css={css`width: 360rem; background: transparent;`}/>
					<Button className={"ml-16"} size={"large"} css={css`min-width: 152rem;`}> Go </Button>
				</div>

				<div className={"text-16 mt-108"}>
					<div className={"font-700 mb-16"}>Or run</div>
					<div><span css={css`color:#AFD97B;`}>npx crusher-cli test:create</span> in your repo</div>
				</div>
			</div>
		</>
	);
};

export { URLOnboarding };
