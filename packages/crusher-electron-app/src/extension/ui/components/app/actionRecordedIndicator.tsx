import React, { useEffect, useRef, useState } from "react";
import { FONT_WEIGHT, POSITION } from "../../../interfaces/css";
import { useSelector } from "react-redux";
import { getActions } from "../../../redux/selectors/actions";
import { Conditional } from "../conditional";

const ActionRecordedIndicator = () => {
	const actions = useSelector(getActions);
	const [shouldShow, setShouldShow] = useState(false);
	const intervalTimeOutRef = useRef(null as any);

	const resetDisplayIntervalTimeout = () => {
		intervalTimeOutRef.current = setTimeout(() => {
			setShouldShow(false);
		}, 1500);
	};

	useEffect(() => {
		const areDefaultActions = actions.length <= 2;

		if (!areDefaultActions) {
			if (!shouldShow) {
				setShouldShow(true);
				resetDisplayIntervalTimeout();
			} else {
				clearInterval(intervalTimeOutRef.current);
				resetDisplayIntervalTimeout();
			}
		}
	}, [actions]);

	return (
		<Conditional If={shouldShow}>
			<div style={actionRecordedIndicatorContainerStyle}>
				<img src={chrome.runtime.getURL("/icons/tickAction.svg")} />
				<span style={actionRecordedIndicatorStyle}>{actions[actions.length - 1].type} Action recorded</span>
			</div>
		</Conditional>
	);
};

const actionRecordedIndicatorContainerStyle = {
	position: POSITION.ABSOLUTE,
	background: "#15181E",
	border: "1px solid #262E3E",
	boxShadow: "0px 4px 14px rgb(255 255 255 / 4%)",
	top: "75%",
	minWidth: "9.5rem",
	padding: "0.55rem 1rem",
	left: "50%",
	zIndex: 999,
	transform: "translateX(-50%)",
	color: "#fff",
	fontFamily: "DM SANS",
	fontSize: 16,
	fontWeight: FONT_WEIGHT.BOLD,
	display: "flex",
	alignItems: "center",
	borderRadius: 4,
};

const actionRecordedIndicatorStyle = {
	marginLeft: "0.85rem",
};

export { ActionRecordedIndicator };
