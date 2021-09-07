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
	box-sizing: border-box;
	border-radius: 6rem;
	line-height: 13rem;
	height: 28rem;
	padding: 0 10rem;
	color: rgba(255, 255, 255, 0.8);
	font-weight: 600;
	display: flex;
	align-items: center;

	:hover {
		background: rgba(255, 255, 255, 0.05);
	}
`;

const menuSelected = css`
	background: rgba(255, 255, 255, 0.05);
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
		link: "/settings/project/basic",
	},
	{
		label: "Environments",
		link: "/settings/project/environments",
	},
	{
		label: "Monitoring",
		link: "/settings/project/monitoring",
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
				<div className={"mt-6 mb-32"}>
					{links.map(({ link, label }) => {
						return (
							<Link href={link}>
								<MenuItemHorizontal className={"mt-2"} selected={pathname === link}>
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

const clickableCSS = css`
	padding: 4px 8rem;
`;
function LeftSection() {
	const router = useRouter();

	const [showModal, setShowModal] = useState(false);
	return (
		<div css={sidebar} className={"flex flex-col justify-between py-18 px-32"}>
			<Conditional showIf={showModal}>
				<InviteMember onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div>
				<div className={"flex items-center pl-2 mt-10 text-13 mb-32"}>
					<span
						css={clickableCSS}
						onClick={() => {
							router.push("/app/dashboard");
						}}
					>
						{"<"}
						<span className={" leading-none mr-8 underline ml-8"}> Go back</span>
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
	background: #0a0b0e;
	min-height: 100vh;
`;

const sidebar = css`
	width: 281rem;
	background: #101215;
	height: 100vh;
	border: 1px solid #171b20;
	box-sizing: border-box;
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
	padding-top: 56rem;
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
