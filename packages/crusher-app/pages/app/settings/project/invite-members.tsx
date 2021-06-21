import React from "react";
import { css } from "@emotion/core";
import { cleanHeaders } from "@utils/backendRequest";
import { getAllSlackIntegrationsForProject } from "@services/alerting";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { PIXEL_REM_RATIO } from "@constants/other";
import { InviteMembersContainer } from "@ui/containers/settings/inviteMembersContainer";

const INVITE_LINK = "https://app.crusher.dev/invite/user/f321fasgc32ase";

const InviteProjectMembers = () => {
	return (
		<SettingsContent contentCSS={settingContentCSS}>
			<SettingsContentHeader title={"Invite team members"} desc={"Invite your friends, employees or co-workers in current project"} />
			<InviteMembersContainer link={INVITE_LINK} />
		</SettingsContent>
	);
};

const settingContentCSS = css`
	width: ${640 / PIXEL_REM_RATIO}rem;
`;

InviteProjectMembers.getInitialProps = async (ctx: any) => {
	const { req, res } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}
		const cookies = getCookies(req);

		const selectedProject = cookies.selectedProject ? JSON.parse(cookies.selectedProject) : null;

		const slackIntegrations = await getAllSlackIntegrationsForProject(selectedProject, headers);

		return {
			isIntegratedWithSlack: false,
			isIntegratedWithRepo: false,
			isIntegratedWithEmail: true,
			slackIntegrations: slackIntegrations,
		};
	} catch {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSettingsLayout(InviteProjectMembers));
