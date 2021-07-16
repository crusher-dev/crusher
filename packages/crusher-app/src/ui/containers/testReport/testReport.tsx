import { Button } from "dyson/src/components/atoms";
import { BottomSVG, CalendarSVG, RerunSVG, ThreeEllipsisSVG, ThunderSVG, TickSVG } from '@svg/testReport';
import { css } from "@emotion/core";
import { LayoutSVG, PlaySVG } from '@svg/dashboard';
import { Conditional } from "dyson/src/components/layouts";
import { atom, useAtom } from "jotai";
import React, { useEffect, useState } from 'react';


function TitleSection() {
	return (
		<div>
			<div className={"font-cera text-19 font-700 leading-none"} id={"title"}>feat: integrated test GTM #517</div>
		</div>
	);
}

function StatusTag() {
	return (
		<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, passed]}>
			<TickSVG height={20} /> <span className={"text-14 font-600 ml-16"}>Review req</span>
		</div>
	);
}

function NameNStatusSection() {
	return (
		<div className={"flex items-center justify-between"}>
			<div className={"flex items-center"}>
				<TitleSection />
				<Button
					size={"small"}
					bgColor={"tertiary-dark"}
					className={"ml-20"}
					css={css`
						width: 96px;
					`}
				>
					<div className={"flex items-center justify-center text-13 font-400"}>
						<RerunSVG className={"mr-6"} height={14} />
						Rerun
					</div>
				</Button>
				<ThreeEllipsisSVG className={"ml-22"} width={25} />
			</div>

			<StatusTag />
		</div>
	);
}

const section = [
	{
		name: "Overview",
		icon: <LayoutSVG />,
		key: "overview",
	},
	{
		name: "Test report",
		icon: null,
		key: "reports",
	},
	{
		name: "History",
		icon: null,
	},
];

const selectedTabAtom = atom(1);
function TabBar() {
	const [secltedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);
	return (
		<div css={Tab} className={"flex mt-48 "}>
			{section.map(({ name, icon, key }, i) => (
				<div className={""} onClick={setSelectedTabIndex.bind(this, i)}>
					<div css={[TabItem, secltedTabIndex === i && selected]} className={"flex items-center justify-center text-15"}>
						<Conditional showIf={icon}>
							<span className={"mr-8"}>{icon}</span>
						</Conditional>
						{name}
					</div>
				</div>
			))}
		</div>
	);
}

function TestOverviewTab() {
	return (
		<div className={"flex mt-48 justify-between"}>
			<div css={leftSection}>
				<div css={overviewCard} className={"flex flex-col items-center justify-center pt-120 pb-88"}>
					<div className={"flex flex-col items-center"}>
						<div></div>

						<div
							className={"mb-28"}
							css={css`
								path {
									fill: #aacb65;
								}
							`}
						>
							<TickSVG height={30} width={28} />
						</div>
						<div className={"font-cera text-15 font-500 mb-24"}>Your build has passes succesfully. No review is required</div>
						<div className={"flex items-center"}>
							<Button
								bgColor={"tertiary-dark"}
								css={css`
									width: 148px;
								`}
							>
								<span className={"font-400"}>Review</span>
							</Button>
							<Button
								bgColor={"tertiary-dark"}
								css={css`
									width: 148px;
								`}
								className={"ml-16"}
							>
								{" "}
								<div className={"flex items-center justify-center text-13 font-400"}>
									<RerunSVG className={"mr-6"} height={14} />
									Rerun
								</div>
							</Button>
						</div>
						<div className={"mt-60 text-14 font-600 mb-24"}>Your test were run on</div>

						<div className={"text-13 mb-16"}>
							<span className={"text-13 font-600"}>Browser</span>
							<span
								className={" ml-32"}
								css={css`
									font-size: 12.8rem;
								`}
							>
								Chrome, Firefox, Safari
							</span>
						</div>
						<div className={"text-13 mb-16"}>
							<span className={"text-13 font-600"}>Browser</span>
							<span
								className={" ml-32"}
								css={css`
									font-size: 12.8rem;
								`}
							>
								Chrome, Firefox, Safari
							</span>
						</div>
						<div className={"text-13 "}>
							<span className={"text-13 font-600"}>Browser</span>
							<span
								className={" ml-32"}
								css={css`
									font-size: 12.8rem;
								`}
							>
								Chrome, Firefox, Safari
							</span>
						</div>
					</div>
				</div>
			</div>
			<div css={rightSection} className={"ml-36 pt-12"}>
				<div className={"mb-32"}>
					<div className={"font-600 text-14 mb-16"}>Reviewers</div>
					<div css={tag} className={"text-13 px-18 py-7 mb-12"}>Himanshu</div>
					<div css={tag} className={"text-13 px-18  py-7"}>Himanshu</div>
				</div>
				<div>
					<div className={"font-600 text-14 mb-16"}>Environment</div>
					<div css={tag} className={"text-13 px-18  py-7 mb-12"}>Production</div>
				</div>
			</div>
		</div>
	);
}

const tag = css`
  background: rgba(16, 18, 21, 0.5);
  border: 1px solid #171c24;
  border-radius: 4px;
	height: 32px;
`

const overviewCard = css`
	width: 100%;
	min-height: 500px;
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;
	box-sizing: border-box;
	border-radius: 8px;
`;
const leftSection = css`
	width: 70%;
`;
const rightSection = css`
	width: 30%;
	max-width: 315px;
`;

function FilterBar() {
	return(
		<div className={"flex items-center text-14"}>
			<div className={'text-14'}>Filter by <img className={'ml-16'} src={'/browsers.png'} height={16} /></div>
			<div className={'ml-48'}>
				<span className={'text-14 font-500'}>Version</span>
				<span className={'text-14 ml-16 underline'}>All</span>
			</div>
			<div className={'ml-48'}>
				<span className={'text-14 font-500'}>Version</span>
				<span className={'text-14 ml-16 underline'}>All</span>
			</div>
		</div>
	);
}

function NormalStep() {
	return <div className={' flex px-44 relative mb-32'}>
		<div css={tick}>
			<TickSVG height={20} width={20} />
		</div>
		<div>
			<span className={'text-13 font-600'} css={css`color: #D0D0D0;`}>Open URL</span>
			<span className={'text-12 ml-20'}
						css={css`color: #848484;`}>Open URL to check if things are working fine or not</span>
		</div>
	</div>;
}

function TestOverview() {
	return <div className={'flex justify-between mt-8 '}>
		<div className={'text-13'}>Switch to</div>
		<div className={'flex'}>
			<div className={'flex items-center mr-32'}>
				<div className={'mr-8 text-13'}>
					<img src={'/chrome.png'} height={16} className={'mr-8'} />Chrome
				</div>
				<BottomSVG width={12} />
			</div>

			<div className={'flex items-center mr-32'}>
				<div className={'mr-8 text-13'}>
					Chrome
				</div>
				<BottomSVG width={12} />
			</div>

			<div className={'flex items-center'}>
				<div className={'mr-8 text-13'}>
					Chrome
				</div>
				<BottomSVG width={12} />
			</div>
		</div>
	</div>;
}

function TestCard({id}) {
	const [expand,setExpand] = useState(false);
	const [sticky, setSticky] = useState(false);

	useEffect(()=>{
		if(id !== 1) return
		const testCard = document.querySelector(`#test-card-${id}`);
		const stickyOverview =document.querySelector("#sticky-overview-bar")
		const observer = new IntersectionObserver(() => {
			const stickyLastPoint = 96;
			const cardStartingOffset = testCard.getBoundingClientRect().top;
			const cardLastOffset = testCard.getBoundingClientRect().top+ testCard.getBoundingClientRect().height;

			if(cardStartingOffset<stickyLastPoint){
				setSticky(true)
				console.log("show")
			}
			if( cardStartingOffset>0 && cardLastOffset < stickyLastPoint){
				setSticky(false)
				console.log("hide")
			}


		},{ root: stickyOverview, threshold: 0});

		observer.observe(testCard);
	},[])

	return <div css={testCard} className={" flex-col mt-24 "} onClick={setExpand.bind(this, !expand)}
							id={`test-card-${id}`}>

		<Conditional showIf={ sticky}>

			<div css={stickyCSS} className={" px-42 "}>
				<div css={[header, stickyContainer]} className={"items-center w-full px-32 w-full"}>
					<div className={"flex justify-between items-center"}>
						<div className={"flex items-center leading-none text-15 font-600 mt-20"}><TickSVG height={18} className={"mr-16"} />Checkout
							flow
						</div>
						<div className={"flex items-center mt-8"}>
							<span className={"text-13 mr-32"}>5 screenshot | 10 check</span>
							<span className={"flex text-13 mr-26"}><PlaySVG className={"mr-10"} /> Replay recording</span>
							<span><BottomSVG css={expand && close} /></span>
						</div>
					</div>
					<div className={"mt-12 mb-16"}>
						{TestOverview()}
					</div>

				</div>

			</div>
		</Conditional>
		<div>
			<div className={"px-32 w-full"}>
				<div css={header} className={"flex justify-between items-center w-full"}>
					<div className={"flex items-center leading-none text-15 font-600"}><TickSVG height={18} className={"mr-16"} />Checkout
						flow
					</div>
					<div className={"flex items-center"}>
						<span className={"text-13 mr-32"}>5 screenshot | 10 check</span>
						<span className={"flex text-13 mr-26"}><PlaySVG className={"mr-10"} /> Replay recording</span>
						<span><BottomSVG css={expand && close} /></span>
					</div>
				</div>


				<Conditional showIf={expand}>
					{TestOverview()}
				</Conditional>
			</div>
		</div>
		<Conditional showIf={expand}>

			<div className={"px-32 w-full mt-16"} css={stepsContainer}>
				<div className={"ml-32 py-32"} css={stepsList}>
					{Array.apply(null, Array(25)).map(() => <NormalStep />)}
				</div>
			</div>
		</Conditional>
	</div>;
}

const stickyCSS=css`
	position: fixed;
  width: calc(100vw - 250rem);
 	left: 50%;
	transform: translateX(-50%);
  max-width: 1500px;
	top: 95px;
	z-index: 10;
`

const stickyContainer = css`
  background: rgb(13, 14, 17);
  border: 1px solid #171C24;
  box-sizing: border-box;
  border-radius: 0px;
  min-height: 56px;
	border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`

const tick = css`
	position: absolute;
	left:0;
	transform: translate(-50%, 3px);

`

const close = css`
  transform: rotate(
          180deg
  );
`

const stepsList= css`
  border-left: 1px solid #171C24;
`


const stepsContainer= css`
  border-top: 1px solid #171C24;
`

const testCard = css`
  background: rgba(16, 18, 21, 0.5);
  border: 1px solid #171C24;

  :hover {
    background: rgba(34, 38, 43, 0.5);
    border: 1px solid rgba(77, 84, 92, 0.5);
  }

  box-sizing: border-box;
  border-radius: 8px;
`

const header = css`

  min-height: 56px;
`

function ReportSection() {
	const [stickyOverviewSection, setStickOverviewSection] = useState(false)

	useEffect(()=>{
		const heading = document.querySelector('#review-section');
		const observer = new IntersectionObserver((entry, observer) => {
			const {y}= heading.getBoundingClientRect();

			const bottomOffset = y+heading.clientHeight;

			setStickOverviewSection(bottomOffset<0?true:false)
		},{rootMargin: "0px"});

		observer.observe(heading);
	},[])

	return <div className={"mt-40"}>
		<div className={"flex justify-between items-center"} id={"review-section"}>
			<div className={"text-14"}>Jump to</div>
			<div className={"flex items-center"}>
				<div className={"mr-32 leading-none text-14 font-600"}>-/12 test viewed</div>
				<Button css={css`width: 144px;`}>Review</Button>
			</div>
		</div>

		<Conditional showIf={stickyOverviewSection && stickyOverviewSection}>
			<div className={"fixed"} css={stickyBar} id={"sticky-overview-bar"}>
				<div css={containerCSS} className={'px-42 pt-10'}>
					<div>
						<div className={"flex justify-between items-center"}>
							<div className={"text-14"}>
								<span className={"text-16 font-cera font-600 mr-38"}>feat: integrated test GTM #517</span>
								<span className={"text-12 mr-16"}>12 june baseline</span>
								<span className={"text-12"}>Jump to</span>
							</div>
							<div className={"flex items-center pt-4"}>
								<div className={"mr-32 leading-none text-14 font-600"}>-/12 test viewed</div>
								<Button css={css`width: 144px;`}>Review</Button>
							</div>
						</div>
					</div>
					<div className={"mt-6"}>
						<FilterBar />
					</div>
				</div>
			</div>
		</Conditional>

		<div css={filterSection} className={'flex items-center mt-32  px-24'} id={"filter-section"}>
			<FilterBar />
		</div>

		<div css={css`height: 10000px;`} className={"mt-40"}>
			<TestCard id={1}/>
			<TestCard id={2}/>
		</div>
	</div>;
}

const containerCSS = css`
	width: calc(100vw - 250rem);
  margin: 0 auto;
	max-width: 1500px;
`

const stickyBar = css`
  background: #0D0E11;
  border: 1px solid #171C24;
  box-sizing: border-box;
  height: 96px;
	width: 100%;
	z-index: 100;
	top: 0;
	left:0
`

const filterSection = css`
  height: 42px;

  background: #0D0E11;
  border: 1px solid #171C24;
  box-sizing: border-box;
  border-radius: 8px;
`

export const TestReport = () => {
	const [secltedTabIndex] = useAtom(selectedTabAtom);
	return (
		<div className={"px-42 mt-62"}>
			<NameNStatusSection />
			<div className={"flex items-center leading-none mt-16 text-13"}>
				<CalendarSVG className={"mr-16"} />2 mins
			</div>
			<Conditional showIf={secltedTabIndex !== 1}>
				<div className={"flex items-center leading-none mt-24 text-13"}>
					<ThunderSVG className={"mr-16"} />
					Wohoo! You saved 20 hours of testing
				</div>
			</Conditional>
			<Conditional showIf={secltedTabIndex === 1}>
				<div className={"flex leading-none mt-56 mb-52  items-center"}>
					<div className={"text-13"} css={css`width: 100px`}>Comparing to</div>
					<div css={timeLine} className={"ml-40 relative"}>
						<div className={"absolute flex flex-col items-center"} css={currentSelected}>
							<div className={"mb-8 text-12"}>12Jun</div>
							<div><TickSVG /></div>
						</div>

						<div className={"absolute flex flex-col items-center"} css={timelineItem}>
							<div><TickSVG /></div>
						</div>

					</div>
				</div>
			</Conditional>
			<TabBar />
			<Conditional showIf={secltedTabIndex === 0}>
				<TestOverviewTab />
			</Conditional>
			<Conditional showIf={secltedTabIndex === 1}>
				<ReportSection/>
			</Conditional>
		</div>
	);
};

const timeLine= css`
	height: 2px;
	width: 100%;
	background: #1E242C;
`

const currentSelected= css`
  position: absolute;
  transform: translateY(-72%);
`

const timelineItem= css`
  position: absolute;
  transform: translateY(-50%);
	left: 50%;
`

const statusTag = css`
	min-width: 152px;
	height: 30px;
	background: rgba(152, 38, 127, 0.8);
	border: 1px solid rgba(255, 64, 213, 0.46);
	box-sizing: border-box;
	border-radius: 15.5px;
`;

const passed = css`
	background: #416a3e;
	border: 1px solid #64ae59;
`;

const review = css`
	background: #9d6852;
	border: 1px solid #ebb9a4;
`;

const running = css`
	background: #1e242c;
	border: 1px solid #545e6b;
`;

const Tab = css`
	border-bottom: 1px solid #1e242c;
`;

const TabItem = css`
	top: 1px;
	position: relative;
	height: 37px;
	min-width: 136px;
	padding: 0 24px;

	:hover {
		color: #fff;
		font-weight: 600;
	}

	min-width: 136px;
`;

const selected = css`
	top: 1px;
	position: relative;
	border: 1px solid #1e242c;
	border-radius: 6px 6px 0px 0px;
	border-bottom: 1px solid #0a0b0e;
	color: #fff;
	min-width: 136px;
	font-weight: 600;

	padding-top: 2px;
`;
