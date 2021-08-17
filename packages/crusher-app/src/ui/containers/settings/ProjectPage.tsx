import { SettingsLayout } from "@ui/layout/SettingsBase";
import { Heading } from "../../../../../dyson/src/components/atoms/heading/Heading";
import Toggle from "../../../../../dyson/src/components/atoms/toggle/toggle";
import Radio from "../../../../../dyson/src/components/atoms/radio/radio";
import Checkbox from "../../../../../dyson/src/components/atoms/checkbox/checkbox";

export const ProjectSettings = () => {
	return (
		<SettingsLayout>
			<div className={"text-24 mb-100"}>
				<Heading type={1} fontSize={24}>
					sd
				</Heading>
			</div>
		</SettingsLayout>
	);
};
