import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { SettingsLayout } from "@ui/layout/SettingsBase";

import { useState, useCallback } from "react";

import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";

import { PRICING_TABLE } from "../pricing_table";

import { Button } from "dyson/src/components/atoms/button/Button";
import { backendRequest } from "@utils/common/backendRequest";
import { RequestMethod } from "@types/RequestOptions";
import { useAtom } from "jotai";
import { userAtom } from "@store/atoms/global/user";
import { teamAtom } from "@store/atoms/global/team";
import Link from "next/link";

export const PricingPage = () => {
	const [showPricing, setShowPricing] = useState(true);
	const [user] = useAtom(userAtom);
	const [team] = useAtom(teamAtom);

	const changePricing = useCallback(
		(planName) => {
			backendRequest("https://crusherdev.api.stdlib.com/test@dev/webhooks/slack/upgrade_pricing", {
				method: RequestMethod.POST,
				payload: {
					text: `Plan Upgrade requested :pound::pound:\nUser- ${user.name} (${user?.id || ""})\nTeam- ${team.name}(${team.id})\nCurrent plan- ${
						team.plan
					}\nNew plan- ${planName}
				`,
				},
				credentials: "omit",
			});
			setShowPricing(false);
		},
		[showPricing],
	);
	return (
		<SettingsLayout>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Conditional showIf={showPricing}>
					<Heading type={1} fontSize={"20"} className={"mb-8"}>
						All Plans
					</Heading>
					<TextBlock fontSize={13} color={"#c1c1c1"}>
						Questions? Get in touch with us
					</TextBlock>
					<hr css={basicHR} className={"mt-36 mb-36"} />

					<PRICING_TABLE
						basicOnClick={changePricing.bind(this, "Basic plan")}
						advanceUpgradeOnClick={changePricing.bind(this, "Advanced plan")}
						proUpgradeOnClick={changePricing.bind(this, "Pro plan")}
					/>
				</Conditional>

				<Conditional showIf={!showPricing}>
					<Heading type={1} fontSize={"20"} className={"mb-12"}>
						Account upgraded
					</Heading>
					<TextBlock fontSize={13} color={"#c1c1c1"}>
						Questions? Get in touch with us
					</TextBlock>
					<hr css={basicHR} className={"mt-24 mb-36"} />
					<div className={"text-14"}>We’ve upgrade your account to Pro. We will get in touch with you to add payment details over email.</div>
					<div className={"flex justify-between mt-32"}>
						<Link href={"/app/dashboard"}>
							<Button>Go to dashboard</Button>
						</Link>
					</div>
				</Conditional>
			</div>
		</SettingsLayout>
	);
};

const maxWidthContainer = css`
	width: 840rem;
	margin: 0 auto;
`;

const basicHR = css`
	background: rgba(255, 255, 255, 0.015);
	border-top: 1px solid rgba(196, 196, 196, 0.06);
`;
