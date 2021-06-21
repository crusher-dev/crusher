import React, { useState } from "react";
import { withRouter } from "next/router";

import { css } from "@emotion/core";
import { WhiteLogo } from "@ui/components/common/Atoms";
import { getTime, toPascalCase } from "@utils/helpers";
import { Platform } from "@interfaces/Platform";

function renderBrowserList(onPlatformChanged, selectedBrowser = Platform.CHROME) {
	const browsers = [
		{
			name: Platform.CHROME,
			icon:
				"https://res.cloudinary.com/dnanbuigy/image/fetch/c_scale,h_30/q_99/https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/1200px-Google_Chrome_icon_%28September_2014%29.svg.png",
		},
		{
			name: Platform.FIREFOX,
			icon:
				"https://res.cloudinary.com/dnanbuigy/image/fetch/c_scale,h_30/q_99/https://design.firefox.com/product-identity/firefox/firefox/firefox-logo.png",
		},
		{
			name: Platform.SAFARI,
			icon: "https://res.cloudinary.com/dnanbuigy/image/fetch/c_scale,h_30/q_99/https://image.flaticon.com/icons/svg/564/564442.svg",
		},
	];

	function handleBrowserSelection(browser) {
		onPlatformChanged(browser);
	}
	const out = browsers.map((value) => {
		const { name, icon } = value;
		return (
			<div
				className="pt-2 pb-2 pl-1 pr-1 text-center tx-medium"
				css={[styles.browserButton, name === selectedBrowser ? styles.selectedBrowserButton : null]}
				onClick={() => {
					handleBrowserSelection(name);
				}}
			>
				<img className="ml-2 mr-2" src={icon} title={toPascalCase(name)} style={{ height: 20 }} />
			</div>
		);
	});

	return <div css={styles.browserList}>{out}</div>;
}

const BaseHeader = ({
    referenceJob,
    onPlatformChanged,
    platform
}: any) => {
    const [mobileMenu] = useState(false);

    return (
		<div className={mobileMenu ? "navbar-nav-show" : ""}>
			<header
				className="navbar navbar-header navbar-header-fixed "
				style={{
					background: "#131415",
					border: "1px solid #191E23",
					padding: "1rem 1rem",
				}}
			>
				<div css={containerCss}>
					<div className="navbar-brand" style={{ paddingLeft: 0, paddingRight: 0 }}>
						<a href="/app/dashboard" className="df-logo">
							{" "}
							<WhiteLogo style={{ height: "1.5rem" }} />
						</a>
					</div>

					<MiddleMenu />
					<div
						className="navbar-brand"
						style={{
							color: "#fff",
							fontSize: "0.9375rem",
							fontFamily: "Cera Pro",
							fontWeight: 500,
						}}
					>
						<div>Baseline</div>
						<div style={{ marginLeft: "1.5rem" }}>
							#{referenceJob.id} - ({getTime(new Date(referenceJob.created_at))})
						</div>
						{/*<div className="pt-2 pb-2 pl-1 pr-1 text-center tx-medium" css={[styles.greenButton]}>Approve all</div>*/}
					</div>
					<div className={"navbar-right"}>{renderBrowserList(onPlatformChanged, platform)}</div>
				</div>
			</header>
		</div>
	);
};

export const Header = withRouter(BaseHeader);

export const MiddleMenu = () => (
	<div id="navbarMenu" className="navbar-menu-wrapper">
		<div className="navbar-menu-header" style={{ background: "#131415" }}>
			<a href="/app/dashboard" className="df-logo">
				<img loading="lazy" style={{ height: 24 }} src="/assets/img/logo/logo_light.svg"></img>
			</a>

			<a id="mainMenuClose" onClick={() => {}}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#fff"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="feather feather-x"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</a>
		</div>
	</div>
);

const containerCss = css`
	width: 70%;
	margin: 0 auto;
	display: flex;
`;

const styles = {
	greenButton: css`
		background: rgb(22, 46, 36);
		border-radius: 4px;
		color: #76ff76;
		padding: 10px 26px !important;
		font-size: 12px;
		border-radius: 6px;
	`,
	browserButton: css`
		border-radius: 4px;
		color: #20222a;
		padding: 8px 2px !important;
		font-size: 12px;
		border-radius: 6px;
		margin-right: 8px;
	`,
	selectedBrowserButton: css`
		background: #1a1c23;
	`,
	browserList: css`
		display: flex;
		margin-right: 16px;
	`,
	countryList: css`
		display: flex;
		margin-right: 16px;
	`,
	countryButton: css`
		color: #20222a;
		padding: 8px 2px !important;
		font-size: 12px;
		border-radius: 6px;
		margin-right: 16px;
	`,
	selectedCountryButton: css`
		background: #1a1c23;
		border: 1.5px solid #1a1c23;
		border-radius: 4px;
	`,
};
