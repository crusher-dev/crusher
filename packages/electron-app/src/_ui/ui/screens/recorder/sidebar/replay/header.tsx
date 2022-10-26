import React from "react";
import { css } from "@emotion/react";
import { EllipseIcon, ResetIcon } from "electron-app/src/_ui/constants/icons";
import { useLocalBuild } from "electron-app/src/_ui/hooks/tests";
import { getCurrentTestInfo, getRemainingSteps } from "electron-app/src/store/selectors/app";
import { useSelector } from "react-redux";
import { getAllSteps, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { InfoProgressBar } from "electron-app/src/_ui/ui/components/progressBar/InfoProgressBar";
import { getBuildProgress } from "electron-app/src/store/selectors/builds";



interface IProps {
	className?: string;
}
const ReplaySidebarHeader = ({ className }: IProps) => {
	const testInfo = useSelector(getCurrentTestInfo);
	const { currentBuild } = useLocalBuild();
	const buildProgress = useSelector(getBuildProgress);
	const savedSteps = useSelector(getSavedSteps);

	const testInfoProgressBar = {
		current: savedSteps ? savedSteps?.length : 0,
		total: testInfo?.steps ? testInfo.steps.length : 0,
	};
	const buildProgressBar = {
		current: currentBuild ? currentBuild?.tests?.length - currentBuild?.queuedTests?.length : 0,
		total: currentBuild ? currentBuild?.tests?.length : 0,
	};

	return (
		<div className={String(className)} css={containerCss}>
			<div className={"flex"} css={headerCss}>
				<div>
					<div css={titleCss}>Running test</div>
					<div css={testNameCss} className={"mt-8"}>
						{testInfo?.testName || ""}
					</div>
				</div>
				<div className={"flex ml-auto"}>
				</div>
			</div>
			<div css={contentCss} className="flex items-center px-14">
				<InfoProgressBar
					css={css`& .tracker-bar { background: #AC43FF; } `}
					label={`${testInfoProgressBar.current}/${testInfoProgressBar.total} steps`}
					id={testInfo?.id}
					total={testInfoProgressBar.total}
					value={testInfoProgressBar.current}
					className={"flex-1"} />
				<InfoProgressBar
					css={css`& .label { justify-content: center }`}
					disableTime={true}
					label={`${buildProgressBar.current}/${buildProgressBar.total} tests`}
					total={buildProgressBar.total}
					value={buildProgressBar.current}
					segments={Object.values(buildProgress)}
					className={"flex-1"} />
			</div>
		</div>
	);
};

const titleCss = css`
	font-weight: 700;
	font-size: 15rem;
	color: #fff;
`;
const testNameCss = css`
	font-size: 12rem;
	color: rgb(156, 156, 156);
`;

const resetIconCss = css`
	width: 13rem;
	height: 13rem;
	:hover {
		opacity: 0.8;
	}
`;
const containerCss = css`
	display: flex;
	flex-direction: column;
	padding-top: 18rem;
`;
const headerCss = css`
	height: 53rem;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #141414;
	padding: 0rem 14rem;
	padding-bottom: 14rem;
`;

const contentCss = css`
	height: 84rem;
	padding-top: 16rem;
	gap: 20rem;
`;

export { ReplaySidebarHeader };
