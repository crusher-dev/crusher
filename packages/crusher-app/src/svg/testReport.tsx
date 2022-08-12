import { ReactPropTypes } from "react";
import React from "react";

export function RerunSVG(props: ReactPropTypes) {
	return (
		<svg width={"16rem"} height={"17rem"} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g>
				<path
					d="M15.66 7.665a.746.746 0 00-1.06.22l-.022.036C14.3 3.996 11.142.89 7.298.89 3.275.89 0 4.295 0 8.48c0 4.186 3.274 7.591 7.299 7.591.562 0 1.018-.474 1.018-1.06 0-.584-.456-1.058-1.018-1.058-2.901 0-5.262-2.455-5.262-5.473 0-3.017 2.36-5.472 5.262-5.472 2.689 0 4.913 2.11 5.224 4.82a.744.744 0 00-1.019-.163.814.814 0 00-.212 1.102l1.513 2.36a.93.93 0 00.777.444.93.93 0 00.777-.445l1.513-2.359a.814.814 0 00-.212-1.102z"
					fill="#647CFF"
				/>
			</g>
		</svg>
	);
}

export function ThreeEllipsisSVG(props: ReactPropTypes) {
	return (
		<svg width={"25rem"} height={"25rem"} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M2.5 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM11.668 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM20.836 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
				fill="#fff"
				fillOpacity={0.22}
			/>
		</svg>
	);
}

export function CalendarSVG(props: ReactPropTypes) {
	return (
		<svg width={"13rem"} height={"13rem"} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M11.324 1.016h-1.168v-.61a.406.406 0 10-.812 0v.61H3.656v-.61a.406.406 0 10-.812 0v.61H1.676C.752 1.016 0 1.767 0 2.69v8.633C0 12.248.752 13 1.676 13h9.648c.924 0 1.676-.752 1.676-1.676V2.691c0-.924-.752-1.675-1.676-1.675zm.864 10.308a.863.863 0 01-.864.864H1.676a.863.863 0 01-.863-.864V4.596c0-.07.056-.127.126-.127H12.06c.07 0 .127.057.127.127v6.728z"
				fill="#505050"
			/>
		</svg>
	);
}

export function ThunderSVG(props) {
	return (
		<svg width={"14rem"} height={"14rem"} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M11.062.203A.377.377 0 0010.73 0H5.234a.377.377 0 00-.36.27L2.91 6.847a.375.375 0 00.36.482h3.082L5.11 13.55a.376.376 0 00.696.26l4.84-8.5a.377.377 0 00-.326-.564H8.14L11.037.59a.375.375 0 00.025-.388z"
				fill="#FFCC80"
			/>
		</svg>
	);
}

export function ChevronDown(props: ReactPropTypes) {
	return (
		<svg width={9} height={9} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g>
				<path
					d="M6.854 10.767a.956.956 0 01-.677-.283L.314 4.579a.958.958 0 111.36-1.35l5.188 5.225 5.224-5.189a.958.958 0 011.35 1.36L7.533 10.49a.956.956 0 01-.678.278z"
					fill="#BDBDBD"
					fillOpacity={0.7}
				/>
			</g>
		</svg>
	);
}

export function PassedSVG(props: ReactPropTypes) {
	const { isMonochrome } = props;
	return (
		<svg width={"16rem"} height={"16rem"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M8 0C3.589 0 0 3.589 0 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm4.471 5.895l-5.113 5.072c-.3.301-.782.321-1.102.02L3.549 8.521a.813.813 0 01-.06-1.123c.3-.32.802-.34 1.123-.04l2.145 1.965 4.571-4.571a.799.799 0 011.143 0c.321.32.321.822 0 1.143z"
				fill={isMonochrome ? "#fff" : "#aacb65"}
			/>
		</svg>
	);
}

export function InitiatedSVG(props) {
	const { isMonochrome } = props;
	return (
		<svg width={21} height={21} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<rect width={21} height={21} rx={10.5} fill={isMonochrome ? "#fff" : "#47484A"} />
			<path d="M10.5 8A2.503 2.503 0 008 10.5c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5S11.878 8 10.5 8z" fill="#0a0b0e" />
		</svg>
	);
}


export function FailedSVG(props) {
	const { isMonochrome } = props;
	return (
		<svg
		  width={16}
		  height={16}
		  viewBox="0 0 16 16"
		  fill="none"
		  xmlns="http://www.w3.org/2000/svg"
		  {...props}
		>
		  <path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 8a8 8 0 1116 0A8 8 0 010 8zm6.166-2.966a.8.8 0 00-1.132 1.132L6.87 8 5.034 9.834a.8.8 0 001.132 1.132L8 9.13l1.834 1.835a.8.8 0 001.132-1.132L9.13 8l1.835-1.834a.8.8 0 00-1.132-1.132L8 6.87 6.166 5.034z"
			fill={isMonochrome ? "#fff" : "#EF4074"}
		  />
		</svg>
	  );
}

export function ExpandSVG(props) {
	return (
		<svg width="22rem" height="22rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="20" height="20" rx="3" fill="#171C24" />
			<g clip-path="url(#clip0_2735_255)">
				<path
					d="M10.5 15.4951C10.3745 15.4951 10.2491 15.4472 10.1534 15.3516L7.1436 12.3417C6.95213 12.1502 6.95213 11.8398 7.1436 11.6484C7.33499 11.457 7.64535 11.457 7.83683 11.6484L10.5 14.3117L13.1631 11.6485C13.3546 11.4571 13.6649 11.4571 13.8563 11.6485C14.0479 11.8399 14.0479 12.1503 13.8563 12.3418L10.8465 15.3517C10.7508 15.4473 10.6254 15.4951 10.5 15.4951Z"
					fill="white"
					fill-opacity="0.83"
				/>
			</g>
			<g clip-path="url(#clip1_2735_255)">
				<path
					d="M10.5 4.50492C10.6255 4.50492 10.7509 4.55282 10.8466 4.64842L13.8564 7.6583C14.0479 7.84976 14.0479 8.16019 13.8564 8.35158C13.665 8.54296 13.3546 8.54296 13.1632 8.35158L10.5 5.68827L7.83686 8.35148C7.64539 8.54287 7.33506 8.54287 7.14368 8.35148C6.95213 8.1601 6.95213 7.84967 7.14368 7.6582L10.1535 4.64833C10.2492 4.55271 10.3746 4.50492 10.5 4.50492Z"
					fill="white"
					fill-opacity="0.83"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2735_255">
					<rect width="7" height="7" fill="white" transform="translate(7 10)" />
				</clipPath>
				<clipPath id="clip1_2735_255">
					<rect width="7" height="7" fill="white" transform="translate(14 10) rotate(-180)" />
				</clipPath>
			</defs>
		</svg>
	);
}

export function ReviewRequiredSVG(props) {
	const { isMonochrome } = props;
	return (
		<svg width={"22rem"} height={"22rem"} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<rect width={"22rem"} height={"22rem"} rx={"11rem"} fill={isMonochrome ? "#d9aecc" : "#fff"} />
			<path
				d="M12.235 14.75v1.75a.48.48 0 01-.149.352.48.48 0 01-.351.148h-2a.48.48 0 01-.352-.148.48.48 0 01-.148-.352v-1.75a.48.48 0 01.148-.352.48.48 0 01.352-.148h2a.48.48 0 01.351.148.48.48 0 01.149.352zm.234-8.25l-.219 6a.503.503 0 01-.16.352.494.494 0 01-.355.148h-2a.494.494 0 01-.356-.148.503.503 0 01-.16-.352L9 6.5a.46.46 0 01.137-.352A.468.468 0 019.485 6h2.5c.135 0 .251.05.347.148a.46.46 0 01.137.352z"
				fill="#44293c"
			/>
		</svg>
	);
}

export function RunningSVG(props) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={"20rem"} height={"20rem"} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block" {...props}>
			<circle cx={84} cy={50} r={"10rem"} fill="#d9d9d9">
				<animate
					attributeName="r"
					repeatCount="indefinite"
					dur="0.6578947368421053s"
					calcMode="spline"
					keyTimes="0;1"
					values="14;0"
					keySplines="0 0.5 0.5 1"
					begin="0s"
				/>
				<animate
					attributeName="fill"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="discrete"
					keyTimes="0;0.25;0.5;0.75;1"
					values="#d9d9d9;#6a6a6a;#828282;#a8a8a8;#d9d9d9"
					begin="0s"
				/>
			</circle>
			<circle cx={"16rem"} cy={50} r={"10rem"} fill="#d9d9d9">
				<animate
					attributeName="r"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="0;0;14;14;14"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="0s"
				/>
				<animate
					attributeName="cx"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="16;16;16;50;84"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="0s"
				/>
			</circle>
			<circle cx={50} cy={50} r={"10rem"} fill="#a8a8a8">
				<animate
					attributeName="r"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="0;0;14;14;14"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="-0.6578947368421053s"
				/>
				<animate
					attributeName="cx"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="16;16;16;50;84"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="-0.6578947368421053s"
				/>
			</circle>
			<circle cx={84} cy={50} r={"10rem"} fill="#828282">
				<animate
					attributeName="r"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="0;0;14;14;14"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="-1.3157894736842106s"
				/>
				<animate
					attributeName="cx"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="16;16;16;50;84"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="-1.3157894736842106s"
				/>
			</circle>
			<circle cx={"16rem"} cy={50} r={"10rem"} fill="#6a6a6a">
				<animate
					attributeName="r"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="0;0;14;14;14"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="-1.9736842105263157s"
				/>
				<animate
					attributeName="cx"
					repeatCount="indefinite"
					dur="2.6315789473684212s"
					calcMode="spline"
					keyTimes="0;0.25;0.5;0.75;1"
					values="16;16;16;50;84"
					keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
					begin="-1.9736842105263157s"
				/>
			</circle>
		</svg>
	);
}

export const TestStatusSVG = ({ type, ...props }) => {
	if (type === "FAILED") {
		return <FailedSVG {...props} />;
	}
	if (type === "RUNNING") {
		return <RunningSVG {...props} />;
	}
	if (type === "INITIATED") {
		return <InitiatedSVG {...props} />;
	}
	if (type === "MANUAL_REVIEW_REQUIRED") {
		return <ReviewRequiredSVG {...props} />;
	}
	return <PassedSVG {...props} />;
};

export const InfoSVG = (props) => {
	return (
		<svg width={11} height={11} viewBox={"0 0 11 11"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M5.5 0a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm.917 9.024a.376.376 0 01-.376.376h-1.03a.376.376 0 01-.376-.376V4.842c0-.208.168-.376.375-.376h1.031c.207 0 .376.168.376.376v4.182zM5.5 3.754a.933.933 0 110-1.865.933.933 0 010 1.865z"
				fill="#656565"
			/>
		</svg>
	);
};
