import { Controls, CustomHelperProps, Navigation } from "reactour";
import React from "react";
import { POSITION } from "../../../../interfaces/css";

const MyCustomHelper = ({ current, content, totalSteps }: CustomHelperProps) => (
	<>
		<main className="CustomHelper__wrapper" style={wrapperStyle}>
			<div className="CustomHelper__content">
				{content}
				<Controls data-tour-elem="controls" className="CustomHelper__controls" style={controlsStyle}>
					<Navigation data-tour-elem="navigation">
						{Array.from(Array(totalSteps).keys()).map((li, i) => (
							<div key={li} style={dotStyle(current, i)}></div>
						))}
					</Navigation>
				</Controls>
			</div>
		</main>
		<div style={progressBarContainerStyle}>
			<div style={progressBarStyle(current, totalSteps)}></div>
		</div>
		<style>{`
        .reactour__helper{
            border-radius: 0.325rem;	
        }
`}</style>
	</>
);

const wrapperStyle = {
	width: "22rem",
	padding: "1.5rem 1.25rem",
	borderRadius: "0.375rem",
};
const controlsStyle = { background: "#1A1D23", marginTop: "2rem" };
const dotStyle = (current: number, index: number) => ({
	backgroundColor: current !== index ? "rgba(196, 196, 196, 0.25)" : "#6893E6",
	width: "0.6rem",
	height: "0.6rem",
	borderRadius: "0.4rem",
	marginLeft: index !== 0 ? 7 : 0,
	cursor: "not-allowed",
});
const progressBarContainerStyle = {
	width: "100%",
	height: "0.375rem",
	background: "#010101",
	bottom: "-0.1rem",
	position: POSITION.ABSOLUTE,
};
const progressBarStyle = (current: number, totalSteps: number) => ({
	width: `${100 * (current / totalSteps)}%`,
	height: "100%",
	background: "#6893E6",
});

export { MyCustomHelper };
