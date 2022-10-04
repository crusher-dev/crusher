import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { Conditional } from "dyson/src/components/layouts";

import { AddSVG } from "@svg/dashboard";
import { ChevronRight } from "@svg/settings";
import InviteMember from "@ui/containers/dashboard/InviteMember";

export function MenuItemHorizontal({ children, selected, ...props }) {
	return (
		<div css={[menuLink, selected && menuSelected]} {...props}>
			{children}
		</div>
	);
}

const menuLink = css`
	display: flex;
	align-items: center;

	font-size: 13.5rem;
	font-weight: 500;
	border-radius: 8rem;
	box-sizing: border-box;
	border: 0.5px solid transparent;

	:hover {
		background: rgba(255, 255, 255, 0.04);
		border: 0.5px solid rgba(255, 255, 255, 0.08);
	}

	box-sizing: border-box;
	border-radius: 6rem;
	height: 28rem;
	padding: 0 10rem;
	color: rgba(255, 255, 255, 0.8);

	:hover {
		background: rgba(255, 255, 255, 0.05);
	}
`;

const menuSelected = css`
	background: rgba(255, 255, 255, 0.04);
	border: 0.5px solid rgba(255, 255, 255, 0.08);
`;

export const CompressibleMenu = ({ name, children, initialState = true }) => {
	const [show, setShow] = useState(initialState);

	return (
		<>
			<div className={"flex items-center pl-10 mr-2 mt- justify-between mt-28 mb-12"} css={project} onClick={setShow.bind(this, !show)}>
				<div className={"flex items-center"}>
					<span className={"text-14 leading-none mr-8 font-700"}>{name}</span>
				</div>
				<Conditional showIf={!show}>
					<ChevronRight height={"10rem"} width={"10rem"} className={"mr-8"} />
				</Conditional>
			</div>

			<Conditional showIf={show}>
				<div className={"mt-6"}>{children}</div>
			</Conditional>
		</>
	);
};

const projectLinks = [
	{
		label: "General",
		link: "/settings/basic",
	},
	{
		label: "Environments",
		link: "/settings/environments",
	},
	{
		label: "Monitoring",
		link: "/settings/monitoring",
	},
	{
		label: "Integrations",
		link: "/settings/integrations",
	},
];

const orgLinks = [
	{
		label: "Team members",
		link: "/settings/org/team-members",
	},
];

function LinksSection({ links, label }) {
	const { pathname } = useRouter();
	return (
		<>
			<CompressibleMenu name={label}>
				<div className={"mt-6 mb-32"} css={linkSection}>
					{links.map(({ link, label }) => {
						return (
							<Link href={link}>
								<MenuItemHorizontal selected={pathname === link}>
									<span
										css={css`
											font-size: 12.5rem;
										`}
										className={" font-500 mt-2 leading-none"}
									>
										{label}
									</span>
								</MenuItemHorizontal>
							</Link>
						);
					})}
				</div>
			</CompressibleMenu>
		</>
	);
}

const linkSection = css`
	display: flex;
	flex-direction: column;
	gap: 8rem;
`;

const clickableCSS = css`
	padding: 4px 8rem;
`;
function LeftSection() {
	const router = useRouter();

	const [showModal, setShowModal] = useState(false);

	const { project_id } = query;

	const isProject = !!project_id;
	const backLink = isProject ? `/${project_id}/dashboard` : "/projects";
	return (
		<div css={sidebar} className={"flex flex-col justify-between py-16 px-23"}>
			<Conditional showIf={showModal}>
				<InviteMember onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div>
				<div className={"flex items-cente mt-10 text-13 mb-32"}>
					<span
						css={clickableCSS}
						onClick={() => {
							router.push(backLink);
						}}
					>
						←{" "}
						<span className={" leading-none mr-8 "} css={hoverCSS}>
							go back
						</span>
					</span>
				</div>
				<LinksSection label={"Project settings"} links={projectLinks} />

				<LinksSection label={"Org settings"} links={orgLinks} />
			</div>

			<div>
				<div css={navLink} className={"flex items-center text-13 mt-4"} onClick={setShowModal.bind(this, true)}>
					<AddSVG className={"mr-12 mb-2"} /> Invite teammates
				</div>
			</div>
		</div>
	);
}

const hoverCSS = css`
	:hover {
		color: #d378fe;
		text-decoration: underline;
	}
`;

export const SettingsLayout = ({ children, hideSidebar = false }) => {
	return (
		<div className={"flex"} css={background}>
			<Conditional showIf={!hideSidebar}>
				<LeftSection />
			</Conditional>

			<div className={"w-full"}>
				<div css={scrollContainer} className={"custom-scroll relative"}>
					<div css={[containerWidth]}>{children}</div>
				</div>
			</div>
		</div>
	);
};

const background = css`
	background: #080808;
	min-height: 100vh;
`;

const sidebar = css`
	width: 303rem;
	height: 100vh;
	border-right: 0.5px solid #1b1b1b;
	box-sizing: border-box;
	background: #0b0b0c;
	justify-content: flex-start;
`;

const containerWidth = css`
	width: 1280rem;
	max-width: calc(100vw - 352rem);
	margin: 0 auto;
	padding: 0 0rem;
	height: 100vh;
`;

const scrollContainer = css`
	overflow-y: scroll;
	height: calc(100vh);
	padding-top: 32rem;
`;

const project = css`
	color: rgba(255, 255, 255, 0.8);

	:hover {
		color: rgba(255, 255, 255, 1);
		path {
			fill: #fff;
		}
	}
`;

const navLink = css`
	box-sizing: border-box;
	line-height: 13rem;
	height: 31rem;
	color: rgba(189, 189, 189, 0.8);
	font-weight: 500;

	margin-left: 6px;
	margin-right: 6px;

	:hover {
		color: rgb(231, 231, 231);
	}
`;
