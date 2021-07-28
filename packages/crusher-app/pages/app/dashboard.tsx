import React from "react";
import { SidebarTopBarLayout } from '@ui/layout/DashboardBase';
import { OnboardingSteps } from "@ui/containers/dashboard/onboardingSteps";
import {css} from "@emotion/core";
import { usePageTitle } from '../../src/hooks/seo';

function Dashboard() {
	usePageTitle("Dashboard");
	return (
		<>
		<SidebarTopBarLayout>
			<div css={containerStyle} className=" pt-42 ">
				<div css={headingStyle} className={"font-cera text-16 font-bold"}>Integrate and start testing</div>
				<div className="mt-4 text-13">It’ll hardly take 5 seconds</div>
				<OnboardingSteps className={"mt-32"}/>
				<div className={"flex flex-row items-center mt-84 justify-center"} css={footerContainerStyle}>
					<div className={"text-14"} css={footerPlaceholderStyle}>We’ll fill this space when data starts to come in</div>
				</div>
			</div>
		</SidebarTopBarLayout>
		</>
	);
}

const containerStyle = css`
	color: #fff !important;
`;
const headingStyle = css`
	color: #D0D0D0 !important;
	font-weight: bold;
`;
const footerContainerStyle = css`
	border: 1rem solid #191E25;
	height: 280rem;
	border-radius: 6rem;
`;
const footerPlaceholderStyle = css`
	color: rgba(255, 255, 255, 0.5);
`;

export default Dashboard