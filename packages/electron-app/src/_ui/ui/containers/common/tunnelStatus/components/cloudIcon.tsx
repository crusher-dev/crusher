import { css } from "@emotion/react";
import React from "react";
import { getStatus } from "../utils";

const getColorByStatus = (status)=>{
	if(status === "tunnel_error" || status === "initializing" || status === "not_configured") return  "#474747"
	return "#898989";
};

export const CloudIcon = ({  ...props }) => {
	const {
		isProxyDisabled,
		isProxyWorking,
		proxyIsInitializing
	} = props;

	const status = getStatus({isProxyDisabled,isProxyWorking,proxyIsInitializing})

	return (
		<div className="flex items-center">
			<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			height={20}
			width={20}
			viewBox="0 0 24 24"

		>
				<path
					fillRule="evenodd"
					d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
					clipRule="evenodd"
					fill={getColorByStatus(status)}
				></path>
			</svg>
			<div css={[
				dot,
				status === "initializing" && initializing,
				status === "working" && workingCSS,
				status === "tunnel_error" && disabledCSS
				]} className="ml-4"></div>
		</div>
	);
};

const dot = css`
min-width: 5px;
min-height: 5px;
border: 3px solid rgba(255, 255, 255, 0.14);
border-radius: 12px;
`

const initializing = css`
background: #F7533D;
animation: 3.5s blink linear infinite;
@keyframes "blink" {
	from, to {
	  opacity: 0;
	}
	50% {
	  opacity: 1;
	}
  }
`

const workingCSS = css`
background: #6FC937;
animation: 2.5s blink ease infinite;
@keyframes "blink" {
	from, to {
	  opacity: .2;
	}
	50% {
	  opacity: 1;
	}
  }
`

const disabledCSS = css`
background: #D71E60;
`
