import React from 'react';
import { usePageTitle } from "../../src/hooks/seo";
import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import {atomWithQuery} from "../../src/store/utils"
import { useAtom } from 'jotai';

const newAtom =  atomWithQuery(["new", "test"], {new: 2})

function Dashboard() {
	usePageTitle("Dashboard");

	const [atom1, setAtom1] = useAtom( newAtom )


	return (
		<>
			<div className={"text-20 pt-20 pb-20"} onClick={setAtom1.bind(this, {new: atom1.new+1, test:23})}>dsf<br/></div>
			<ProjectSettings />
		</>
	);
}

export default Dashboard;
