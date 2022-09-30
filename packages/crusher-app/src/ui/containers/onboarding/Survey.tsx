import { css } from "@emotion/react";
import React, { useState } from "react";

import { useAtom } from "jotai";

import { Button, Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";

import { USER_META_KEYS } from "@constants/USER";
import { usePageTitle } from "@hooks/seo";
import { onboardingStepAtom, OnboardingStepEnum } from "@store/atoms/pages/onboarding";
import { updateMeta } from "@store/mutators/metaData";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI } from "@utils/common/url";

const SurveyContainer = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const [, setCommnads] = React.useState(["", ""]);

	const [profileType, setProfileType] = useState(null);
	const [otherProfile, setOtherProfile] = useState(false);
	const [, updateMetaData] = useAtom(updateMeta);

	React.useEffect(() => {
		backendRequest(resolvePathToBackendURI("/integrations/cli/commands"), {
			method: RequestMethod.GET,
		}).then((res) => {
			if (res) {
				setCommnads(res);
			}
		});
	}, []);

	usePageTitle("Create & Run your first test");

	const handleNext = () => {
		updateMetaData({
			type: "user",
			key: USER_META_KEYS.SURVEY,
			value: profileType,
		});
		setOnboardingStep(OnboardingStepEnum.URL_ONBOARDING);
	};

	const handleRoleInputChange = (value) => {
		setProfileType(value);
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
						placeholder={"What's your role?"}
						onKeyDown={(e) => {
							handleRoleInputChange(e.target.value);
							if (e.keyCode === 13) {
								handleNext();
							}
						}}
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
					onClick={handleNext}
					disabled={!profileType}
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

export { SurveyContainer };
