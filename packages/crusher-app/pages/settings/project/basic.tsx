import React, { useEffect } from "react";

import { ProjectSettings } from "@ui/containers/settings/ProjectPage";

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
		<ProjectSettings />
	);
}

export default Dashboard;
