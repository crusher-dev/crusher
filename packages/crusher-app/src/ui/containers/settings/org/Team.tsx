import { css } from "@emotion/react";
import { useState } from "react";

import useSWR from "swr";

import { Card } from "../../../../../../dyson/src/components/layouts/Card/Card";
import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import InviteMember from "@ui/containers/dashboard/InviteMember";
import { SettingsLayout } from "@ui/layout/SettingsBase";
import { resolvePathToBackendURI } from "@utils/common/url";

export const TeamMembers = () => {
	const [showModal, setShowModal] = useState(false);
	const { data } = useSWR(resolvePathToBackendURI("/teams/users"));

	return (
		<SettingsLayout>
			<Conditional showIf={showModal}>
				<InviteMember onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<div className={"flex justify-between items-start mt-16"}>
					<div>
						<Heading type={2} fontSize={"18"} className={"mb-8"}>
							Team members
						</Heading>
						<TextBlock fontSize={13} className={"mb-24"} color={"#787878"}>
							Make sure you have selected all the configuration you want
						</TextBlock>
					</div>
					<div>
						<Button
							onClick={setShowModal.bind(this, true)}
							css={css`
								width: 164rem;
							`}
						>
							Add a member
						</Button>
					</div>
				</div>

				<hr css={basicHR} />
				{data?.map(({ name, role, email }) => (
					<Card css={teamMemberListCard}>
						<div className={"flex justify-between items-start"}>
							<div className={"text-14"}>
								<div>{name}</div>
								<div className={"text-12"}>
									{email} | {role}
								</div>
							</div>
							<Conditional showIf={false}>
								<div className={"text-12"} id={"delete"}>
									Deactivate
								</div>
							</Conditional>
						</div>
					</Card>
				))}
			</div>
		</SettingsLayout>
	);
};

const teamMemberListCard = css`
	padding: 14rem 20rem;
	#delete {
		:hover {
			text-decoration: underline;
		}
	}
`;

const maxWidthContainer = css`
	width: 680rem;
	margin: 0 auto;
`;

const basicHR = css`
	background: rgba(255, 255, 255, 0.015);
	border-top: 1px solid rgba(196, 196, 196, 0.06);
`;
