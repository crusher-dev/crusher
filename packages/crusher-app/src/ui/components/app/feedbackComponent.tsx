import React, { useEffect, useState } from "react";
import { css } from "@emotion/core";

const normalImageUrl = "/svg/dashboard/feedback.svg";
const hoverImageUrl = "/svg/dashboard/feedback_hover.svg";
export const FeedbackComponent = () => {
	const [imgUrl, setImgUrl] = useState(normalImageUrl);
	const [showfeedbackSVG, setShowFeedbackSVG] = useState(true);
	const hideHotjarFeedback = () => {
		const hotjarElement = document?.querySelector("#_hj_feedback_container");
		if (hotjarElement) {
			hotjarElement.style.visibility = "hidden";
		} else {
			requestAnimationFrame(hideHotjarFeedback);
		}
	};

	useEffect(() => {
		hideHotjarFeedback();
	}, []);

	const showHotjar = () => {
		const hotjarElement = document.querySelector("#_hj_feedback_container");
		hotjarElement.style.visibility = "visible";
		document.querySelector("#_hj_feedback_container").childNodes[0].childNodes[0].click();
		setShowFeedbackSVG(false);
	};
	if (!showfeedbackSVG) return null;
	return (
		<img
			src={imgUrl}
			css={feedbackCss}
			onClick={showHotjar}
			onMouseEnter={setImgUrl.bind(this, hoverImageUrl)}
			onMouseLeave={setImgUrl.bind(this, normalImageUrl)}
		/>
	);
};
const feedbackCss = css`
    position: fixed;
    bottom: 0;
    right: 0;
    height: 6rem;
    width: 10rem;
    cursor: pointer;
    z-index: 99999;
}
`;
