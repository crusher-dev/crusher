import { css } from '@emotion/react';
import { MenuItemHorizontal, UserNProject } from '@ui/containers/dashboard/UserNProject';
import React, { useState } from 'react';
import { AddSVG, HelpSVG, LayoutSVG, PlaySVG, RightArrow, SearchSVG, TraySVG } from '@svg/dashboard';

import { Button } from 'dyson/src/components/atoms';
import { Input } from 'dyson/src/components/atoms';
import Link from 'next/link';
import { Conditional } from 'dyson/src/components/layouts';
import { Download } from '@ui/containers/dashboard/Download';


const CURRENT_PROJECT_LIST = [{
	name: "Dashboard",
	ICON: LayoutSVG,
	isSelected: false
},
	{
		name: "Activity",
		ICON: LayoutSVG,
		isSelected: false
	},
	{
		name: "Settings",
		ICON: LayoutSVG,
		isSelected: false
	}];


const PROJECTS_LIST = [{
	name: "Default",
	ICON: LayoutSVG,
	isSelected: false
},
	{
		name: "Google",
		ICON: LayoutSVG,
		isSelected: false
	},
	{
		name: "Facebook",
		ICON: LayoutSVG,
		isSelected: false
	},
	{
		name: "Yahoo",
		ICON: LayoutSVG,
		isSelected: false
	}]


function ProjectList() {
	const [search,setSearch] = useState(false)
	return <>
		<div className={'flex pl-10 mr-2 mt- justify-between mt-36'} css={project}>
			<div className={'flex items-center'}>
				<span className={'text-13 leading-none mr-8 font-600'}>Projects</span>

			</div>

			<div className={'flex items-center'} css={hoverCSS} >
				<AddSVG />
				<div className={'text-13 leading-none ml-8 leading-none mt-2'}>Add</div>
			</div>
		</div>

		{
			search && (
				<div>
					<Input placeholder={"enter name"} css={smallInputBox}/>
				</div>
			)
		}

		<div className={'mt-6'}>
			{PROJECTS_LIST.map(({ name, ICON }) => (
				<MenuItemHorizontal className={'mt-2'}>
					<ICON height={12} />
					<span className={'text-13 ml-16 font-500 mt-2 leading-none'}>{name}</span>
				</MenuItemHorizontal>
			))}
		</div>
	</>;
}

function LeftSection() {
	return 		<div css={sidebar} className={"flex flex-col justify-between py-18 px-14"}>
		<div>
			<UserNProject />

			{/*<div>*/}
			{/*	<div css={OutlinedButton} className={' mt-28 flex justify-between'}>*/}
			{/*		<span className={'text-13'}>Upgrade to pro</span> <RightArrow/>*/}
			{/*	</div>*/}
			{/*</div>*/}

			<div className={'mt-24'}>
				{CURRENT_PROJECT_LIST.map(({ name, ICON }) => (
					<MenuItemHorizontal className={'mt-2'}>
						<ICON height={12} />
						<span className={'text-13 ml-16 font-500 mt-2 leading-none'}>{name}</span>
					</MenuItemHorizontal>
				))}
			</div>

			<ProjectList />
		</div>

		<div>
			<div>
				<div css={navLink} className={'flex items-center text-13 mt-4'}>
					<AddSVG className={'mr-12 mb-2'} /> Invite People
				</div>

				<a href={"https://docs.crusher.dev/docs/references/contact-us"} target={"_blank"}>
					<div css={navLink} className={'flex items-center text-13 mt-4'}>
						<HelpSVG className={'mr-12 mb-2'} /> Help & Feedback
					</div>
				</a>
				<a href={"https://docs.crusher.dev/"} target={"_blank"}>
					<div css={navLink} className={'flex items-center text-13 mt-4'}>
						<HelpSVG className={'mr-12 mb-2'} /> Documentation
					</div>
				</a>
			</div>

			<div className={'flex justify-between py-8 px-12 pb-6 mt-20'} css={upgradeCard}>
				<div>
					<div className={'label font-700'}>Free Plan</div>
					<div className={'description text-12'}>Get 50% off</div>
				</div>
				<div>
					<div><TraySVG css={css`margin-left: auto;`} /></div>
					<div className={'upgrade text-12 mt-6 font-600'}>Upgrade</div>
				</div>
			</div>
		</div>
	</div>;
}

const TOP_NAV_LINK = [{
	name: 'overview',
	selected: false
},
	{
		name: 'Test',
		selected: false
	},
	{
		name: 'Monitoring',
		selected: false
	},
	{
		name: 'Builds',
		selected: true
	},
	{
		name: 'Settings',
		selected: false
	}
]

function TopNavbar() {
	const [showCreateTest,setShowCreateTest] = useState(false);
	return (
		<div css={[nav]} className={""}>
			<div css={[containerWidth]}>
			<div className={"w-full flex px-47 pl-32 justify-between"}>
				<div className={'flex'}>
					{TOP_NAV_LINK.map(({ name, selected }) => (
						<div className={'pt-24 mr-6'} css={navLinkSquare}>
							<div className={'font-cera font-500 px-24 capitalize'}>{name}</div>

							{selected && (<div className={'selected mt-19'}></div>)}
						</div>
					))}

				</div>

				<Conditional showIf={showCreateTest}>
					<Download onClose={setShowCreateTest.bind(this, false)} />
				</Conditional>

				<div className={'flex items-center'}>
					<Button bgColor={'tertiary-dark'}>
						<div className={'flex items-center'}>
							<PlaySVG className={'mr-12'} />Run test
						</div>
					</Button>
					<Button className={'ml-20'} css={css`width: 160rem;`} onClick={setShowCreateTest.bind(this, true)}>Create a
						test</Button>
					<span className={'ml-24 font-500 text-14 leading-none'} css={shareLink}>Share</span>

				</div>
			</div>
			</div>
	</div>);
}


export const SidebarTopBarLayout = ({children, hideSidebar = false})=>{

	return (	<div className={"flex"} css={background}>


		<Conditional showIf={!hideSidebar}>
			<LeftSection />
		</Conditional>


		<div className={"w-full"}>
			<TopNavbar/>
			<div css={containerWidth}>
				{children}
			</div>
		</div>
	</div>)
}

const navLinkSquare = css`
	div{
    color: #D0D0D0;
    font-size: 13.5px;
	}
	.selected{
    background: #23272E;
    border-radius: 4px 4px 0px 0px;
		height: 5px;
	}
`

const background = css`
	background: #0A0B0E;
	min-height: 100vh;
`

const sidebar = css`
	width: 286rem;
	background: #101215;
	border: 1px solid #171B20;
	box-sizing: border-box;
`

const nav = css`
	width: 100%;
	background: #101215;
	height: 68rem;
`
const containerWidth = css`
	max-width: calc(100vw - 250rem);
  margin: 0 auto;
`

const project = css`
	color: rgba(255, 255, 255, 0.9);
	font-size: 1;
`

const hoverCSS = css`
  padding: 6px 10px 6px 10px;
 :hover{
   background: #202429;
   border-radius: 4px;
 }
`

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
`

const shareLink = css`

  color: rgba(189, 189, 189, 1);
`

const upgradeCard = css`
  background: #1A1D21;
  border: 1px solid #212529;
  border-radius: 6rem;

	path{
		fill: #6372FF;
	}
  .label {
    color: rgba(255, 255, 255, 0.88);
    font-size: 13.5rem;
  }

  .description {
    color: rgba(255, 255, 255, 0.3)
  }

  .upgrade {
    color: #6372FF;
  }

  :hover {
    background: #24282d;
    border: 1px solid #30353b;
  }
`

const smallInputBox = css`
  width: calc(100% - 14px);
  background: linear-gradient(
          0deg
          ,#0e1012,#0e1012);
  border: 1px solid #2a2e38;
  box-sizing: border-box;
  border-radius: 4px;
  height: 30rem;
  font-size: 14rem;
  padding-left: 16rem;
  color: #fff;
  margin: 7px 7px;
	padding-top: 2rem;
	padding-left: 12rem;
	`