import { LogoAnimated } from "dyson/src/components/atoms/logo/LogoAnimated";
import { CenterLayout } from "dyson/src/components/layouts/";

import { usePageTitle } from "../../hooks/seo";
import CrusherBase from "../layout/CrusherBase";

export const LoadingScreen = () => {
	usePageTitle("loading");
	return (
		<CrusherBase>
			<CenterLayout className={"pb-100"}>
				<div className="flex flex-col justify-center items-center">
					<LogoAnimated/>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};
