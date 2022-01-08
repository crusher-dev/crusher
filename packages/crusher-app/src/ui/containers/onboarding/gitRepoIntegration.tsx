import { css } from "@emotion/react";
import { usePageTitle } from "@hooks/seo";
import { onboardingStepAtom } from "@store/atoms/pages/onboarding";
import { GitSVG } from "@svg/onboarding";
import { Input } from "dyson/src/components/atoms";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";
import { useAtom } from "jotai";
import React from "react";

const projects = ["Github", "Crusher", "Test", "Github", "Crusher", "Test", "Github", "Crusher", "Test"];

const GitRepoIntegration = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);

  usePageTitle("Select github repo");

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
					{/* <Button bgColor={"tertiary-dark"}>Create Project</Button> */}
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

const selectProjectBox = css`
	background: #0c0d0f;
	border: 1px solid #21252f;
	border-radius: 6px;
	overflow: hidden;
`;

export { GitRepoIntegration };