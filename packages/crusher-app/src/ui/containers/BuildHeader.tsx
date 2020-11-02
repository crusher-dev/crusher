import React, { useState } from "react";
import { withRouter } from "next/router";

import { css } from "@emotion/core";
import { WhiteLogo } from "@ui/components/Atoms";
import { toPascalCase } from "@utils/helpers";
import { Platform } from "@interfaces/Platform";

const ROUTES = {
	PROJECT_DASHBOARD: "PROJECT_DASHBOARD",
	PROJECT_BUILDS: "PROJECT_BUILD",
	PROJECT_HOSTS: "PROJECT_HOSTS",
	PROJECT_SETTINGS: "PROJECT_SETTINGS",
	PROJECT_TESTS: "PROJECT_TESTS",
};

function getCurrentRoute(router) {
	const pathName = router.pathname;
	switch (pathName) {
		case "/app/project/dashboard":
			return ROUTES.PROJECT_DASHBOARD;
		case "/app/project/builds":
			return ROUTES.PROJECT_BUILDS;
		case "/app/project/hosts":
			return ROUTES.PROJECT_HOSTS;
		case "/app/project/sidebarSettings":
			return ROUTES.PROJECT_SETTINGS;
		case "/app/project/tests":
			return ROUTES.PROJECT_TESTS;
		default:
			return null;
	}
}

function renderBrowserList(
	onPlatformChanged,
	selectedBrowser = Platform.CHROME,
) {
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
			icon:
				"https://res.cloudinary.com/dnanbuigy/image/fetch/c_scale,h_30/q_99/https://image.flaticon.com/icons/svg/564/564442.svg",
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
				css={[
					styles.browserButton,
					name === selectedBrowser ? styles.selectedBrowserButton : null,
				]}
				onClick={() => {
					handleBrowserSelection(name);
				}}
			>
				<img
					className="ml-2 mr-2"
					src={icon}
					title={toPascalCase(name)}
					height="20px"
				/>
			</div>
		);
	});

	return <div css={styles.browserList}>{out}</div>;
}

function renderCountriesList(selectedCountry = "global") {
	const countries = [
		{
			name: "global",
			icon:
				"https://res.cloudinary.com/dnanbuigy/image/fetch/c_scale,h_64/q_65/https://image.flaticon.com/icons/svg/3039/3039687.svg",
		},
	];

	function handleCountrySelection(country) {}

	const out = countries.map((value) => {
		const { name, icon } = value;
		return (
			<div
				className="pt-2 pb-2 pl-1 pr-1 text-center tx-medium"
				css={[
					styles.countryButton,
					name === selectedCountry ? styles.selectedCountryButton : null,
				]}
				onClick={() => {
					handleCountrySelection(name);
				}}
			>
				<img
					className="ml-2 mr-2"
					src={icon}
					title={toPascalCase(name)}
					height="20px"
				/>
			</div>
		);
	});

	return <div css={styles.countryList}>{out}</div>;
}

const BaseHeader = ({
	isMobile,
	isDesktop,
	router,
	onPlatformChanged,
	platform,
}: any) => {
	const [search, toggleSearch] = useState(false);
	const [mobileMenu, showMobileMenu] = useState(false);
	const currentRoute = getCurrentRoute(router);

	return (
		<div className={mobileMenu ? "navbar-nav-show" : ""}>
			<header
				className="navbar navbar-header navbar-header-fixed "
				style={{ background: "#131415", border: "1px solid #191E23" }}
			>
				<div className="container">
					<div className="navbar-brand">
						<a href="/app/dashboard" className="df-logo">
							{" "}
							<WhiteLogo height={22} />
						</a>
					</div>

					<MiddleMenu />
					<div className="navbar-right">
						{renderCountriesList()}
						{renderBrowserList(onPlatformChanged, platform)}
						{/*<div className="pt-2 pb-2 pl-1 pr-1 text-center tx-medium" css={[styles.greenButton]}>Approve all</div>*/}
					</div>
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
				<img loading="lazy" style={{ height: 24 }} src="/svg/logo-dark.svg"></img>
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
