import React from "react";
import { css } from "@emotion/react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return null;
    }

    return (
        <div className="timer">
            <div className="value" css={remainingTimeCss}>{remainingTime}</div>
        </div>
    );
};

const remainingTimeCss = css`
 	font-size: 10rem; 
  `;

export const StepTimeout = React.memo(({ timeout, ...props }: any) => {

    return (
        <div css={countdownCss} title="timeout for this step">
            <CountdownCircleTimer
                isPlaying
                duration={timeout}
                size={20}
                trailColor={"grey"}
                strokeWidth={1.5}
                colors={["#a056ff", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[10, 6, 3, 0]}
                onComplete={() => ({ shouldRepeat: false, delay: 1 })}
            >
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
});

const countdownCss = css`
	position: relative;
	margin-left: auto;
	text-align: center;
    margin-top: -3rem;

	.timer{
		font-weight: 600;
		margin-top: 1px;
	}
`;