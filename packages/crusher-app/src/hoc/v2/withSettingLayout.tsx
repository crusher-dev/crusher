import { css } from "@emotion/core";
import Head from "next/head";
import PlusSVG from "../../../public/svg/sidebarSettings/plus.svg";

import React from "react";

export function WithSettingsLayout(
	Component,
	shouldHaveGetInitialProps = true,
) {
	const WrappedComponent = function (props) {
		return (
			<div>
				<Head>
					<title>Crusher | Create your first test</title>
					<link
						href="/assets/img/favicon.png"
						rel="shortcut icon"
						type="image/x-icon"
					/>
				</Head>
				<div css={settingsPage}>
					{ProjectContainer()}
					{MenuContainer()}
					<div>
						<Component {...props} />
					</div>
				</div>
			</div>
		);
	};
	if (shouldHaveGetInitialProps) {
		WrappedComponent.getInitialProps = async (ctx) => {
			const pageProps =
				Component.getInitialProps && (await Component.getInitialProps(ctx));
			return { ...pageProps };
		};
	}

	return WrappedComponent;
}

function ProjectContainer() {
	const ProjectItem = () => <div css={projectIcon}>C</div>;
	return (
		<div css={projectBar}>
			<ProjectItem />
			<div id="add-project">
				<PlusSVG />
			</div>
		</div>
	);
}

function MenuContainer() {
	return <div css={menuBar}></div>;
}

const projectIcon = css`
	border-radius: 5px;
	width: 2.2rem;
	height: 2.2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;
	font-weight: 800;
	font-size: 13px;
	color: #323232;
	text-transfomation: uppercase;
	background: #e4e4e4;
	:hover {
		cursor: pointer;
		background: #fff;
		border: 2px solid #eae8e8;
	}
`;

const projectBar = css`
	align-item: center;
	height: 100vh;
	background: #f3f3f3;
	border: 1px solid #eae8e8;
	padding: 0 0.65rem;
	padding-top: 2rem;

	#add-project {
		cursor: pointer;
		display: flex;
		justify-content: center;
		svg {
			height: 1.05rem;
			width: 1.05rem;
		}
		svg > path {
			fill: #323232;
		}
	}

	#add-project:hover {
		svg > path {
			fill: #5b76f7;
		}
	}
`;

const menuBar = css`
	width: 20rem;
	height: 100vh;

	background: #fbfbfb;
	border: 1px solid #eae8e8;
`;

const settingsPage = css`
	display: flex;
	height: 100%;
`;
