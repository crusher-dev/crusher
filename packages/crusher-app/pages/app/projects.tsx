import { css } from "@emotion/react";
import React, { useMemo } from "react";

import { OnboardingSteps } from "@ui/containers/dashboard/onboardingSteps";
import { OnBoardingTutorialVideo } from "@ui/containers/dashboard/tutorials";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";

import { usePageTitle } from "../../src/hooks/seo";
import { Conditional } from "dyson/src/components/layouts";
import { useAtom } from "jotai";
import { currentProjectSelector } from "../../src/store/selectors/getCurrentProject";
import { userAtom } from "../../src/store/atoms/global/user";
import { getOnboardingStepIndex } from "@utils/core/dashboard/onboardingUtils";

function Dashboard() {
	usePageTitle("Dashboard");

	const [project] = useAtom(currentProjectSelector);
	const [user] = useAtom(userAtom);

	const onboardingIndex = useMemo(() => {
		return getOnboardingStepIndex(project, user);
	}, [project, user]);

	return (
		<SidebarTopBarLayout>
			<div css={containerStyle} className=" pt-42 ">
				<Conditional showIf={onboardingIndex !== -1}>
					<div>ds</div>
				</Conditional>
			</div>
		</SidebarTopBarLayout>
	);
}

const containerStyle = css`
	color: #fff !important;
`;
const headingStyle = css`
	color: #d0d0d0 !important;
	font-weight: bold;
`;
const footerContainerStyle = css`
	border: 1rem solid #191e25;
	height: 280rem;
	border-radius: 6rem;
`;
const footerPlaceholderStyle = css`
	color: rgba(255, 255, 255, 0.5);
`;

export default Dashboard;
