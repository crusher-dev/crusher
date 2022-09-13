import { css } from "@emotion/react";
import React, { useMemo } from "react";

import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";

import { usePageTitle } from "../../src/hooks/seo";
import { Conditional } from "dyson/src/components/layouts";
import { useAtom } from "jotai";
import { currentProjectSelector } from "../../src/store/selectors/getCurrentProject";
import { userAtom } from "../../src/store/atoms/global/user";
import { getOnboardingStepIndex } from "@utils/core/dashboard/onboardingUtils";
import Input from "dyson/src/components/atoms/input/Input";
import { Button } from "dyson/src/components/atoms";

function Dashboard() {
	usePageTitle("Dashboard");

	const [project] = useAtom(currentProjectSelector);
	const [user] = useAtom(userAtom);

	const onboardingIndex = useMemo(() => {
		return getOnboardingStepIndex(project, user);
	}, [project, user]);

	return (
		<SidebarTopBarLayout>
			<div css={containerStyle} className=" pt-36 ">
				<Conditional showIf={onboardingIndex !== -1}>
					<div className="flex items-center">
						<Input css={newInputBoxCSS} size={"medium"} placeholder={"Searh project"}></Input>
						<Button css={buttonCss} size="big-medium" className="ml-16">
							+ new project
						</Button>
					</div>
				</Conditional>
			</div>
		</SidebarTopBarLayout>
	);
}

export const newInputBoxCSS = css`
	flex: 1;
	input {
		background: transparent;
		border: 0.5px solid rgba(56, 56, 56, 0.6);
		border-radius: 10rem;
		font-weight: 500;
		:focus {
			// background: #121316;
			border: 0.5px solid #ae47ff;
			border-color: #ae47ff;
		}
		::placeholder {
			color: #808080;
		}
		:hover {
			// box-shadow: 0px 0px 0px 3px rgba(28, 28, 28, 0.72);
		}
	}

	@-webkit-keyframes autofill {
		0%,
		100% {
			color: #666;
			background: transparent;
		}
	}

	input:-webkit-autofill {
		-webkit-animation-delay: 1s; /* Safari support - any positive time runs instantly */
		-webkit-animation-name: autofill;
		-webkit-animation-fill-mode: both;
	}
`;

const buttonCss = css`
	width: 144rem;

	border-radius: 10rem;

	background: #cecece;
	color: #202020;
	border-color: transparent !important;

	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0) !important;

	:hover {
		background: #eeeeee;
		color: #202020;
		filter: brightness(80%);
	}

	:focus {
		outline: 1px solid #ae47ff;
	}
`;

const containerStyle = css`
	color: #fff !important;
`;

export default Dashboard;
