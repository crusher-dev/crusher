import React, { useEffect } from "react";

import { PricingPage } from "@ui/containers/settings/pricing_table/index";

import { usePageTitle } from "../../../src/hooks/seo";
import { useAtom } from "jotai";
import { updateMeta } from "../../../src/store/mutators/metaData";
import { PROJECT_META_KEYS } from "@constants/USER";

function Dashboard() {
	usePageTitle("Dashboard");
	const [, updateMetaData] = useAtom(updateMeta);

	useEffect(() => {
		updateMetaData({
			type: "project",
			key: PROJECT_META_KEYS.INTEGRATE_WITH_CI,
			value: true,
		});
	}, []);
	return (
		<>
			<PricingPage />
		</>
	);
}

export default Dashboard;
