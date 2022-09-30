import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";

import { useAtom } from "jotai";

import { Button } from "dyson/src/components/atoms/button/Button";
import { Conditional } from "dyson/src/components/layouts";

import { FullScreenSVG } from "@svg/dashboard";
import { PlaySVG } from "@svg/dashboard";
import { DownloadButton } from "@ui/containers/dashboard/Download";
import { getOnboardingStepIndex } from "@utils/core/dashboard/onboardingUtils";

import { userAtom } from "../../../store/atoms/global/user";
import { currentProjectSelector } from "../../../store/selectors/getCurrentProject";
import { ExpandableList, ExpandableListItem } from "./expandableList";

interface TTestIntegrationListProps {
	className?: string;
}
const Download = dynamic(() => import("@ui/containers/dashboard/Download"));

export const DownloadRecorderStepContent = () => {
	const [showCreateTest, setShowCreateTest] = useState(false);
	return (
		<div className="mt-40 pl-32 pb-16">
			<table css={downloadGridContainerStyle}>
				<tbody>
					<tr>
						<td
							css={css`
								vertical-align: baseline;
							`}
						>
							<span className={"label text-14"}>Download</span>
						</td>
						<td>
							<div className={"ml-40 "}>
								<DownloadButton
									css={css`
										align-items: flex-start;
									`}
								/>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<span className={"label text-14"}>& Then</span>
						</td>
						<td>
							<div className={"ml-40"}>
								<Button
									bgColor={"tertiary"}
									size="medium"
									css={css`
										width: 164rem;
									`}
									onClick={setShowCreateTest.bind(this, true)}
								>
									<div className={"flex items-center justify-center"}>
										<PlaySVG className={"mr-12"} />
										<span className={"mt-2"}>Create a test</span>
									</div>
								</Button>

								<Conditional showIf={showCreateTest}>
									<Download onClose={setShowCreateTest.bind(this, false)} />
								</Conditional>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export const RunTestDesc = () => {
	return (
		<div className="mt-16 pl-36 mb-0">
			<div className={"text-14"}>Run test by clicking to bar.</div>
		</div>
	);
};

export const ViewReportDesc = () => {
	return (
		<div className="mt-16 pl-36 mb-0">
			<div className={"text-14"}>View report by switching to builds tab.</div>
		</div>
	);
};

export const IntegrateDesc = () => {
	return (
		<div className="mt-12 pl-36 mb-0" css={integrateCSS}>
			<div
				className={"text-14"}
				css={css`
					line-height: 28rem;
				`}
			>
				Add <a href={"google.com"}>monitoring</a> or <a href={"google.com"}>Integrate CI</a>.
				<br />
				You can also <a href={"google.com"}>add alerting</a> to slack when test fails.
			</div>
		</div>
	);
};

const integrateCSS = css`
	a {
		color: #98a7ff;
		text-decoration: underline;
		cursor: pointer;
	}
`;

function OnboardingSteps(props: TTestIntegrationListProps) {
	const [project] = useAtom(currentProjectSelector);
	const [user] = useAtom(userAtom);

	const onboardingIndex = useMemo(() => {
		return getOnboardingStepIndex(project, user);
	}, [project, user]);

	const handleChangeItem = () => {};

	return (
		<div {...props}>
			<ExpandableList css={listStyle} currentSelected={onboardingIndex} changeSelected={handleChangeItem}>
				<ExpandableListItem title="Download recorder & create test" completed={false} isActive={true}>
					<DownloadRecorderStepContent />
				</ExpandableListItem>
				<ExpandableListItem title="Run tests" completed={false}>
					<RunTestDesc></RunTestDesc>
				</ExpandableListItem>
				<ExpandableListItem title="View Report" completed={false}>
					<ViewReportDesc />
				</ExpandableListItem>
				<ExpandableListItem title="Integrate with your worflow" completed={false}>
					<IntegrateDesc />
				</ExpandableListItem>
			</ExpandableList>
			<div className={"flex flex-row mt-30"}>
				<div css={haveTestStyle} className="migrate-test text-13">
					<a href={"https://forms.gle/CdpyTa61LSt9nj4G6"} target={"_blank"}>
						Already have tests? Migrate to Crusher
					</a>
				</div>
				<div className={"ml-auto flex items-center"}>
					<span css={checkoutProjectStyle} className={"text-13 mr-12"}>
						Or checkout <u className={"text-13 mr-0"}>Demo Project</u>
					</span>
					<FullScreenSVG css={fullScreenIconStyle} />
				</div>
			</div>
		</div>
	);
}

const listStyle = css`
	border: 1px solid #171c24;
	border-radius: 8rem;
`;
const haveTestStyle = css`
	color: #fff !important;
	a {
		cursor: default;
	}
	:hover {
		text-decoration: underline;
	}
`;
const checkoutProjectStyle = css`
	color: rgb(208, 208, 208) !important;
`;
const fullScreenIconStyle = css`
	height: 12.5rem;
	width: 12.5rem;
`;
const downloadGridContainerStyle = css`
	border-collapse: collapse;
	tr {
		&:not(:first-child) {
			td {
				padding-top: 38rem;
			}
		}
	}
	.label {
		color: rgba(255, 255, 255, 0.7) !important;
	}
`;
export { OnboardingSteps };
