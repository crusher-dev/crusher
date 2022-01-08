import { Card } from "@components/common/card";
import { css } from "@emotion/react";
import { usePageTitle } from "@hooks/seo";
import { onboardingStepAtom } from "@store/atoms/pages/onboarding";
import { CopyIconSVG } from "@svg/onboarding";
import { sendSnackBarEvent } from "@utils/common/notify";
import { Button, Input, Text } from "dyson/src/components/atoms";
import { useAtom } from "jotai";
import React from "react";

const CopyCommandInput = ({ command }: {command: string}) => {
	return (
		<Input
			css={css`width: 240rem; user-select: none; height: 40rem; input { cursor: default; background: rgba(0, 0, 0, 0.49); height: 40rem; user-select: none; } :hover { input { background: rgba(255, 255, 255, 0.03); } svg { opacity: 1; } }`}
      initialValue={command}
      //@ts-ignore
			readOnly={true}
			rightIcon={<CopyIconSVG css={css`opacity: 0.42`} />}
			onClick={(event) => {
				(event.target as HTMLInputElement).select();
				document.execCommand("copy");
				sendSnackBarEvent({ type: "normal", message: "Copied to clipboard!" });
			}}
		/>
	);
};

const CliRepoIntegration = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);

	usePageTitle("Create & Run your first test");

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
							<CopyCommandInput command={"npx crusher create:test"}/>
						</div>
						<div className={"flex items-center justify-between mt-16"}>
							<CopyCommandInput command={"npx crusher run:test"}/>
							<span
								className={"text-13"}
								css={css`
									color: #af7eff;
								`}
							>
							</span>
						</div>
					</div>
        </Card>
        <Card type={"normal"} className={"mt-32 py-16"}>
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
        </Card>
				<div className={"flex justify-end mt-28"}>
					<Text fontSize={13}>Skip setup and show me the dashboard</Text>
				</div>
			</div>
		</>
	);
};


export { CliRepoIntegration }