import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { SettingsLayout } from "@ui/layout/SettingsBase";

import { useState } from "react";

import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";

import { PRICING_TABLE } from "../pricing_table";

import { Button } from "dyson/src/components/atoms/button/Button";

export const PricingPage = () => {
	const [showPricing, setShowPricing] = useState(true);
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

					<PRICING_TABLE basicOnClick={setShowPricing.bind(this, false)} />
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
						<Button>Continue to dashboard</Button>
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
