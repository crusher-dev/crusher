import React from "react";
import { SidebarTopBarLayout } from '@ui/layout/DashboardBase';
import { TestIntegrationList } from "@ui/containers/dashboard/testIntegrationList";
import {css} from "@emotion/core";

function App() {
	return (
		<>
		<SidebarTopBarLayout>
			<div css={containerStyle} className="pl-48 pt-42 pr-48">
				<div css={headingStyle} className={"font-cera text-16 font-bold"}>Integrate and start testing</div>
				<div className="mt-12 text-13">It’ll hardly take 5 seconds</div>
				<TestIntegrationList className={"mt-32"}/>
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

export default App;
