import { css } from "@emotion/react";
import React from "react";

import { useAtom } from "jotai";

import { Button, Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";

import { getTestListAPI } from "@constants/api";
import { addHttpToURLIfNotThere, checkValidURL } from "@crusher-shared/utils/url";
import { useProjectDetails } from "@hooks/common";
import { usePageTitle } from "@hooks/seo";
import { appStateAtom } from "@store/atoms/global/appState";
import { onboardingStepAtom, OnboardingStepEnum } from "@store/atoms/pages/onboarding";
import { LoadingSVG } from "@svg/dashboard";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI } from "@utils/common/url";

const URLOnboarding = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const { currentProject: project } = useProjectDetails();
	const [, setCommnads] = React.useState(["", ""]);
	const [websiteUrl, setWebsiteUrl] = React.useState(null);
	const [isCreatingTest, setIsCreatingTest] = React.useState(false);
	const [urlError, setUrlError] = React.useState(null);
	const [{ selectedProjectId }] = useAtom(appStateAtom);

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

	const handleUrlSubmit = () => {
		if (!websiteUrl) {
			setUrlError("Please enter a valid URL");
			return;
		}
		const finalWebsiteUrl = addHttpToURLIfNotThere(websiteUrl);
		if (!checkValidURL(finalWebsiteUrl)) {
			setUrlError("Please enter a valid URL");
			return;
		}
		setIsCreatingTest(true);

		backendRequest(`/projects/${selectedProjectId}/actions/generate.tests`, {
			method: RequestMethod.POST,
			payload: { url: finalWebsiteUrl },
		})
			.then((data) => {
				if (data && data.status === "Successful") {
					setIsCreatingTest(false);
					setOnboardingStep(OnboardingStepEnum.SUPPORT_CRUSHER);
				}
			})
			.catch((err) => {
				setIsCreatingTest(false);
				console.error("Error is", err);
				alert("Some error occured while generating tests");
			});
	};

	usePageTitle("Create & Run your first test");

	return (
		<>
			<div
				css={css`
					width: 632rem;
					color: #dcdcdc;
					margin-top: 60rem;
				`}
			>
				<div>
					<div
						className="text-14 leading-none mb-36 font-400 font-cera"
						css={css`
							letter-spacing: 0.2px;
						`}
					>
						Create a test
					</div>
				</div>

				<div
					className="text-20 font-700"
					css={css`
						color: #fff;
					`}
				>
					Enter the URL of the website
				</div>

				<div
					className={"text-13 mt-12"}
					css={css`
						letter-spacing: 0.4px;
					`}
				>
					We'll create a test to checks page is loading perfectly
				</div>

				<div
					className={"flex mt-32 items-center"}
					css={css`
						position: relative;
					`}
				>
					<Input
						size={"large"}
						placeholder={"Enter the URL of the website"}
						css={css`
							width: 360rem;
							background: transparent;
						`}
						isError={!!urlError}
						onChange={(e) => {
							setWebsiteUrl(e.target.value);
						}}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								handleUrlSubmit();
							}
						}}
						onKeyDown={() => {
							setUrlError(null);
						}}
					/>
					<span
						css={css`
							position: absolute;
							bottom: -28rem;
							color: #ff4583;
						`}
					>
						{urlError}
					</span>
					<Button
						className={"ml-16"}
						size={"large"}
						css={css`
							min-width: 152rem;
						`}
						onClick={handleUrlSubmit}
					>
						<span>
							<Conditional showIf={!isCreatingTest}> Go </Conditional>
							<Conditional showIf={isCreatingTest}>
								<span
									css={css`
										display: flex;
										align-items: center;
									`}
								>
									<LoadingSVG
										css={css`
											width: 18rem;
											circle {
												stroke: #fff;
											}
											height: 18rem;
										`}
									/>
									<div
										css={css`
											text-align: center;
											flex: 1;
										`}
									>
										Running
									</div>
								</span>
							</Conditional>
						</span>
					</Button>
				</div>

				<div className={"text-16 mt-108"}>
					<div className={"font-700 mb-16"}>Or run</div>
					<div>
						<span
							css={css`
								color: #afd97b;
							`}
						>
							npx crusher-cli test:create
						</span>{" "}
						in your repo
					</div>
				</div>
			</div>
		</>
	);
};

export { URLOnboarding };
