import React, { useEffect } from "react";

import { useAtom } from "jotai";

import { PROJECT_META_KEYS } from "@constants/USER";
import { ProjectSettings } from "@ui/containers/settings/ProjectPage";

import { usePageTitle } from "../../../src/hooks/seo";
import { updateMeta } from "../../../src/store/mutators/metaData";

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
	return <ProjectSettings />;
}

export default Dashboard;
