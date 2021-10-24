import { css } from "@emotion/react";

export function PRICING_TABLE(props) {
	return (
		<div css={css_webflow}>
			<div id="pricing-table" className="pricing-table">
				<div id="w-node-_241348b3-62c9-048d-6347-e84f42ff4bf3-44fcabff" className="hightlighted"></div>
				<div id="w-node-b60a880d-cc28-153c-d652-c9147e9e7f2f-44fcabff" className="heading-block">
					<div className="text-block-2">Billing Cycle</div>
					<div className="text-block-5">Usage</div>
					<div className="heading-item-block">
						<div className="heading-clok first-block">Exectuin time</div>
						<div className="heading-clok">6 hours testing</div>
					</div>
					<div className="heading-cblock">
						<div className="heading-section-first-item">Usage</div>
						<div className="heading-item-block">
							<div className="heading-clok first-block">6 hours testing</div>
							<div className="heading-clok">6 hours testing</div>
						</div>
					</div>
					<div className="heading-cblock">
						<div className="heading-section-first-item">Support</div>
						<div className="heading-item-block">
							<div className="heading-clok first-block">6 hours testing</div>
							<div className="heading-clok">6 hours testing</div>
						</div>
					</div>
				</div>
				<div id="w-node-ddc71930-048d-6217-82db-6fec46d3544e-44fcabff" className="section-plan-block left-side">
					<div className="pricing-section-heading">Basic</div>
					<div className="plan-pricing">
						<span className="text-span-3">$</span>39 <span className="text-span">per month</span>
					</div>
					<div onClick={props.basicOnClick} className="button">
						<img
							src="https://uploads-ssl.webflow.com/6126a19170998e59b25af4a3/6174bf6fe002069adda4c1a5_482956%205.svg"
							loading="lazy"
							alt=""
							className="image"
						/>
						<div className="text-block-4">Upgrade</div>
					</div>
					<div className="div-block-5"></div>
					<div className="section-item-block first-vlock">
						<div className="div-block-6 first-block">6 hours testing</div>
						<div className="div-block-6">6 hours testing</div>
					</div>
					<div className="plan-feature-block">
						<div className="section-heading-block"></div>
						<div className="section-item-block">
							<div className="div-block-6">6 hours testing</div>
							<div className="div-block-6">6 hours testing</div>
						</div>
					</div>
					<div className="plan-feature-block">
						<div className="section-heading-block"></div>
						<div className="section-item-block">
							<div className="div-block-6">6 hours testing</div>
							<div className="div-block-6">6 hours testing</div>
						</div>
					</div>
				</div>
				<div id="w-node-d15be992-d995-f5ed-0738-b31b20d0825b-44fcabff" className="section-plan-block right-side">
					<div className="pricing-section-heading">Advanced</div>
					<div className="plan-pricing">
						<span className="text-span-3">$</span>249 <span className="text-span">per month</span>
					</div>
					<div onClick={props.advanceUpgradeOnClick} className="button grey">
						<div className="text-block-4">Get in touch</div>
					</div>
					<div className="div-block-5"></div>
					<div className="section-item-block first-vlock">
						<div className="div-block-6 first-block">6 hours testing</div>
						<div className="div-block-6">6 hours testing</div>
					</div>
					<div className="plan-feature-block">
						<div className="section-heading-block"></div>
						<div className="section-item-block">
							<div className="div-block-6">6 hours testing</div>
							<div className="div-block-6">6 hours testing</div>
						</div>
					</div>
					<div className="plan-feature-block">
						<div className="section-heading-block"></div>
						<div className="section-item-block">
							<div className="div-block-6">6 hours testing</div>
							<div className="div-block-6">6 hours testing</div>
						</div>
					</div>
				</div>
				<div id="w-node-_6bdee84f-53c2-9a16-5c9f-72a757231647-44fcabff" className="section-plan-block middle">
					<div className="pricing-section-heading">Pro</div>
					<div className="plan-pricing">
						<span className="text-span-3">$</span>99 <span className="text-span">per month</span>
					</div>
					<div onClick={props.proUpgradeOnClick} className="button grey">
						<img
							src="https://uploads-ssl.webflow.com/6126a19170998e59b25af4a3/6174bf6fe002069adda4c1a5_482956%205.svg"
							loading="lazy"
							alt=""
							className="image"
						/>
						<div className="text-block-4">Upgrade</div>
					</div>
					<div className="div-block-5"></div>
					<div className="section-item-block first-vlock">
						<div className="div-block-6 first-block">6 hours testing</div>
						<div className="div-block-6">6 hours testing</div>
					</div>
					<div className="plan-feature-block">
						<div className="section-heading-block"></div>
						<div className="section-item-block">
							<div className="div-block-6">6 hours testing</div>
							<div className="div-block-6">6 hours testing</div>
						</div>
					</div>
					<div className="plan-feature-block">
						<div className="section-heading-block"></div>
						<div className="section-item-block">
							<div className="div-block-6">6 hours testing</div>
							<div className="div-block-6">6 hours testing</div>
						</div>
					</div>
				</div>
				<div id="w-node-_58a97969-0510-3004-8fb5-bde1084e5319-44fcabff" className="div-block-7">
					<div className="text-block-6">1% of our fees goes in supporting coding girl education</div>
					<img
						src="https://uploads-ssl.webflow.com/6126a19170998e59b25af4a3/6174ccebd688957dabcb9c99_heart%201.png"
						loading="lazy"
						alt=""
						className="image-2"
					/>
				</div>
			</div>
		</div>
	);
}

const css_webflow = css`
	* {
		box-sizing: border-box;
	}
	img {
		display: inline-block;
		max-width: 100%;
		vertical-align: middle;
	}
	button {
		border: 0;
		cursor: pointer;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(1turn);
		}
	}
	.pricing-table {
		grid-column-gap: 0;
		grid-row-gap: 0;
		display: grid;
		grid-auto-columns: 1fr;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-template-rows: 6px 1fr auto;
		margin-top: 0;
		max-width: 860px;
	}
	.hightlighted {
		background-color: #1e242c;
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		height: auto;
	}
	.heading-block {
		height: 100%;
		padding-left: 0;
		padding-right: 24px;
		padding-top: 24px;
	}
	.section-plan-block {
		height: 100%;
		padding: 24px 24px 60px;
	}
	.section-plan-block.middle {
		background-color: #0d0e11;
		border: 1px solid #171c24;
		border-radius: 0;
		padding-left: 20px;
		padding-right: 20px;
	}
	.section-plan-block.left-side {
		border: 1px solid #171c24;
		border-radius: 12px 0 0 12px;
		border-right-width: 0;
		padding-left: 26px;
		padding-right: 26px;
	}
	.section-plan-block.right-side {
		border: 1px solid #171c24;
		border-left-width: 0;
		border-radius: 0 12px 12px 0;
		padding-left: 26px;
		padding-right: 26px;
	}
	.text-block-2 {
		color: #8e8e8e;
		font-family: Gilroy, sans-serif;
		font-size: 12.1px;
		font-weight: 500;
		margin-bottom: 114px;
	}
	.pricing-section-heading {
		font-family: Cera pro, sans-serif;
		margin-bottom: 38px;
	}
	.plan-pricing,
	.pricing-section-heading {
		color: #fff;
		font-size: 17px;
		font-weight: 700;
		line-height: 17px;
	}
	.plan-pricing {
		display: flex;
		flex-direction: row;
		margin-bottom: 44px;
	}
	.text-span {
		color: hsla(0, 0%, 100%, 0.81);
		font-size: 11px;
		font-weight: 400;
		line-height: 12px;
		margin-left: 8px;
	}
	.button {
		align-items: center;
		background-color: #6d6af9;
		border-radius: 4px;
		color: #fff;
		display: flex;
		font-weight: 500;
		height: 32px;
		justify-content: center;
	}
	.button:hover {
		background-color: #6562f7;
	}
	.button.grey {
		background-color: #1e242c;
	}
	.button.grey:hover {
		background-color: #181b1f;
	}
	.image {
		height: 12px;
		margin-top: -2px;
		width: 12px;
	}
	.text-block-4 {
		font-size: 13px;
		margin-left: 8px;
		margin-top: 3px;
	}
	.text-block-5 {
		color: #fff;
		font-family: Cera pro, sans-serif;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 94px;
	}
	.div-block-5 {
		background-color: #171c24;
		height: 1px;
		margin-top: 30px;
	}
	.div-block-6 {
		border-bottom: 1px solid #171c24;
		font-size: 13.5px;
		margin-top: 24px;
		padding-bottom: 13px;
	}
	.div-block-6.first-block {
		font-size: 13.5px;
		margin-top: 0;
	}
	.heading-clok {
		border-bottom: 1px solid #171c24;
		font-size: 12.7px;
		margin-top: 24px;
		max-width: 120px;
		padding-bottom: 13px;
	}
	.heading-clok.first-block {
		margin-top: 0;
	}
	.heading-section-first-item {
		color: #fff;
		font-family: Cera pro, sans-serif;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 28px;
		margin-top: 58px;
	}
	.section-heading-block {
		border-bottom: 0 solid #171c24;
		height: 14px;
		margin-top: 58px;
		min-height: 14px;
		padding-bottom: 13px;
	}
	.section-heading-block.first-block,
	.section-item-block.first-vlock {
		margin-top: 54px;
	}
	.text-span-3 {
		font-size: 12px;
		font-weight: 400;
		line-height: 12px;
		margin-right: 4px;
		margin-top: 4px;
	}
	.div-block-7 {
		align-items: center;
		color: #e7e7e7;
		display: flex;
		flex-direction: row-reverse;
		font-size: 13.5px;
		margin-top: 40px;
	}
	.image-2 {
		margin-right: 8px;
	}
	.text-block-6 {
		font-size: 13px;
	}
	#w-node-_241348b3-62c9-048d-6347-e84f42ff4bf3-44fcabff {
		grid-column-end: 4;
		grid-column-start: 3;
		grid-row-end: 1;
		grid-row-start: 2;
	}
	#w-node-b60a880d-cc28-153c-d652-c9147e9e7f2f-44fcabff {
		grid-column-end: 2;
		grid-column-start: 1;
		grid-row-end: 3;
		grid-row-start: 2;
	}
	#w-node-ddc71930-048d-6217-82db-6fec46d3544e-44fcabff {
		grid-column-end: 3;
		grid-column-start: 2;
		grid-row-end: 3;
		grid-row-start: 2;
	}
	#w-node-d15be992-d995-f5ed-0738-b31b20d0825b-44fcabff {
		grid-column-end: 5;
		grid-column-start: 4;
		grid-row-end: 3;
		grid-row-start: 2;
	}
	#w-node-_6bdee84f-53c2-9a16-5c9f-72a757231647-44fcabff {
		grid-column-end: 4;
		grid-column-start: 3;
		grid-row-end: 3;
		grid-row-start: 2;
	}
	#w-node-_58a97969-0510-3004-8fb5-bde1084e5319-44fcabff {
		grid-column-end: 5;
		grid-column-start: 3;
		grid-row-end: 4;
		grid-row-start: 3;
	}
`;
