import { css } from "@emotion/react";

import { Logo } from "dyson/src/components/atoms";
import { CenterLayout } from "dyson/src/components/layouts/";

import { usePageTitle } from "../../hooks/seo";
import CrusherBase from "../layout/CrusherBase";

const logoStyle = css`
	box-shadow: 0 0 38px 12px rgb(153 136 255 / 12%);
	animation: logo-animation 0.8s alternate infinite cubic-bezier(0, 0, 1, 0.32);
`;

export const LoadingScreen = () => {
	usePageTitle("🦖");
	return (
		<CrusherBase>
			<CenterLayout className={"pb-100"}>
				<div className="flex flex-col justify-center items-center">
					<Logo showOnlyIcon={true} height={"36rem"} css={logoStyle} />
					<span className={"mt-30 text-14 font-content font-500"}>Firing up all the boosters</span>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};
