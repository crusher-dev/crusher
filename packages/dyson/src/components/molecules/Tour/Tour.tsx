import React from "react";

import styled, { keyframes } from "styled-components";
import Joyride, { BeaconRenderProps, CallBackProps, Step, StoreHelpers, TooltipRenderProps, STATUS } from "react-joyride";

import Grid from "./grid";
import { CloseSVG } from "../../icons/CloseSVG";
import { ArrowSVG } from "../../icons/ArrowSVG";
import { css } from "@emotion/react";
import { Button } from "../../atoms";

export type TGuideProps = {
	stepsContent: any;
	currentIndex: number;
	callback: Function;
};
interface Props {
	setLocale: (locale: string) => void;
}

interface State {
	run: boolean;
	steps: Step[];
}

const Wrapper = styled.div`
	background-color: #ccc;
	box-sizing: border-box;
	min-height: 100vh;
	padding: 12px 24px 24px 24px;
	position: relative;
`;

const Row = styled.div`
	align-items: center;
	display: flex;
	white-space: nowrap;
`;

const Input = styled.input`
	-webkit-appearance: none;
	border: 0.1rem solid #f04;
	padding: 0.6rem;
	width: 75%;
`;

const TooltipBody = styled.div`
	background-color: #16171a;
	min-width: 466px;
	max-width: 420px;
	position: relative;
	border-radius: 8px;
	font-size: 13px;
`;

const TooltipContent = styled.div`
	color: #f6f6f6;
	padding: 8px 24px;
`;

const TooltipTitle = styled.h2`
	color: #fff;
	font-size: 16px;
	padding: 24px 24px 4px 24px;
	margin: 0;
`;

const TooltipFooter = styled.div`
	background-color: #16171a;
	display: flex;
	justify-content: space-between;
	margin-top: 1rem;
	padding: 12px 24px 24px 24px;

	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
`;

const Tooltip = ({ continuous, index, isLastStep, step, size, backProps, primaryProps, skipProps, tooltipProps }: TooltipRenderProps) => {
	return (
		<TooltipBody {...tooltipProps}>
			{step.title && (
				<TooltipTitle>
					<div className={"flex justify-between"}>
						<div className={"font-cera font-700"}>{step.title}</div>

						<div {...skipProps} spacer={true}>
							<CloseSVG height={12} width={12} />
						</div>
					</div>
				</TooltipTitle>
			)}
			{step.content && <TooltipContent>{step.content}</TooltipContent>}
			<TooltipFooter>
				<div className={"flex items-center"}>
					<ArrowSVG
						css={css`
							transform: rotate(180deg);
						`}
					/>
					<span className={"ml-8 mr-8 leading-none font-13"}>{`${index + 1}/${size}`}</span>
					<ArrowSVG />

					<div className={"ml-12 font-12"}>skip</div>
				</div>

				{/*{index > 0 && <Button {...backProps}>back</Button>}*/}
				<Button>{continuous ? "next" : "close"}</Button>
			</TooltipFooter>
		</TooltipBody>
	);
};

const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  55% {
    background-color: rgba(157, 100, 255, 0.9);
    transform: scale(1.6);
  }
`;

const BeaconButton = styled.button`
	animation: ${pulse} 1s ease-in-out infinite;
	background-color: #ff15ac;
	border-radius: 100%;
	display: inline-block;
	height: 10rem;
	width: 10rem;
	border: none !important;
`;

export class Tour extends React.Component<Props, State> {
	public state = {
		run: true,
		steps: [
			{
				content: (
					<React.Fragment>
						<div style={{ marginTop: 0 }}>Weekly magic on your inbox</div>
						<div style={{ marginTop: 0 }}>Weekly magic on your inbox</div>
						<div style={{ marginTop: 0 }}>Weekly magic on your inbox</div>
					</React.Fragment>
				),
				placementBeacon: "top" as const,
				target: ".image-grid div:nth-child(1)",
				textAlign: "center",
				title: "Our awesome projects",
			},
			{
				content: "Change the world, obviously",
				disableCloseOnEsc: true,
				disableOverlayClicks: true,
				target: ".image-grid div:nth-child(2)",
				title: "Our Mission",
			},
			{
				content: "Special stuff just for you!",
				placement: "top" as const,
				target: ".image-grid div:nth-child(4)",
				title: "The good stuff",
			},
			{
				content: (
					<div>
						<svg width="96px" height="96px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" role="img">
							<g>
								<path
									d="M83.2922435,72.3864207 C69.5357835,69.2103145 56.7313553,66.4262214 62.9315626,54.7138297 C81.812194,19.0646376 67.93573,0 48.0030634,0 C27.6743835,0 14.1459311,19.796662 33.0745641,54.7138297 C39.4627778,66.4942237 26.1743334,69.2783168 12.7138832,72.3864207 C0.421472164,75.2265157 -0.0385432192,81.3307198 0.0014581185,92.0030767 L0.0174586536,96.0032105 L95.9806678,96.0032105 L95.9966684,92.1270809 C96.04467,81.3747213 95.628656,75.2385161 83.2922435,72.3864207 Z"
									fill="#000000"
								/>
							</g>
						</svg>
					</div>
				),
				placement: "right" as const,
				target: ".image-grid div:nth-child(5)",
				title: "We are the people",
			},
		],
	};

	private helpers?: StoreHelpers;

	private setHelpers = (helpers: StoreHelpers) => {
		this.helpers = helpers;
	};

	private handleClickRestart = () => {
		const { reset } = this.helpers!;

		reset(true);
	};

	private handleJoyrideCallback = (props: CallBackProps) => {
		const { status, type } = props;
		const options: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (options.includes(status)) {
			this.setState({ run: false });
		}

		console.groupCollapsed(type);
		console.log(props);
		console.groupEnd();
	};

	public render() {
		const { run, steps } = this.state;

		return (
			<Wrapper>
				<Joyride
					run={run}
					steps={steps}
					beaconComponent={BeaconButton as React.ElementType<BeaconRenderProps>}
					callback={this.handleJoyrideCallback}
					getHelpers={this.setHelpers}
					scrollToFirstStep={true}
					tooltipComponent={Tooltip}
					styles={{
						options: {
							arrowColor: "#191B1E",
							zIndex: 2000000,
						},
						overlay: {
							backgroundColor: "rgba(79, 46, 8, 0.5)",
						},
					}}
				/>
				<Grid />
			</Wrapper>
		);
	}
}
