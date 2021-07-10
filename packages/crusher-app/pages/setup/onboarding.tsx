import React, { useCallback, useState } from 'react';
import { css } from "@emotion/core";
import {  CenterLayout, Conditional } from "dyson/src/components/layouts";
import CrusherBase from "crusher-app/src/components/CrusherBase";
import { Button, DiscordSocialBtn, GithubSocialBtn } from "dyson/src/components/atoms";

const HowItWorksView = () => {
	return (
		<>
			<div className="m-8 text-16 leading-none mb-36">How it works in 60 seconds?</div>
			<div
				className="rounded-10"
				css={css`
					background-color: #191e22;
					height:400px;
					width:544px;
					overflow:hidden;
				`}
			>
				<video width="100%" controls>
					<source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
					Your browser does not support HTML video.
				</video>
			</div>
		</>
	);
};

const GithubDiscordSection = () => {

	const openLinkInNewTab = useCallback((url)=>{
		window.open(url, '_blank').focus();
	},[])

	return (
		<>
			<div className="mb-56 text-17 text-center">{`"We help devs ship HQ fast. We do this by eliminating
     chores and removing noise from their workflow."`}</div>
			<div className=" text-16 flex flex-col items-center mb-56">
				<span className={"mb-20 leading-none"}>Star us to show some love</span>
				<div>
					<GithubSocialBtn count={234} onClick={openLinkInNewTab.bind(this,"https://github.com/crusherdev/crusher")}/>
				</div>
			</div>
			<div className="text-16 flex flex-col items-center">
				<span className={"mb-20 leading-none"}>Join us and ship products with other devs</span>
				<div>
					<DiscordSocialBtn count={234} />
				</div>
			</div>
		</>
	);
};

const GetViewByStep = ({ step }:{step: number}) => {
	switch (step) {
		case 0:
			return <HowItWorksView />;
		case 1:
			return <GithubDiscordSection />;
		default:
			return null;
	}
};

const BeforeDashboard = () => {
	const [step, setStep] = useState(0);
	const handleNext = () => {
		setStep(step + 1);
	};
	return (
		<CrusherBase>
			<CenterLayout className={"pb-100"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<GetViewByStep step={step}/>
					<Conditional showIf={step < 1}>
						<Button className="mt-68" onClick={handleNext} >
							Next
						</Button>

					</Conditional>
					<Conditional showIf={step === 1}>
						<Button className="mt-72">
							Open Dashboard
						</Button>
					</Conditional>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};

const containerCSS = css`
  max-width:473rem;
`

export default BeforeDashboard;
