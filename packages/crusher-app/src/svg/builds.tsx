
function DropdownIconSVG(props) {
	return (
		<svg width={9} height={9} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g clipPath="url(#prefix__clip0)">
				<path
					d="M4.5 7.065a.628.628 0 01-.446-.185L.184 3.01a.63.63 0 11.892-.89L4.5 5.542 7.924 2.12a.63.63 0 01.891.892l-3.87 3.87a.628.628 0 01-.445.184z"
					fill="#BDBDBD"
					fillOpacity={0.7}
				/>
			</g>
			<defs>
				<clipPath id="prefix__clip0">
					<path fill="#fff" d="M0 0h9v9H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}

export function BackSVG(props) {
	return (
		<svg viewBox="0 0 26 32" xmlns="http://www.w3.org/2000/svg" {...props}>
			<title />
			<path
				d="M10.1 23a1 1 0 000-1.41L5.5 17h23.55a1 1 0 000-2H5.53l4.57-4.57A1 1 0 008.68 9l-6.36 6.37a.9.9 0 000 1.27L8.68 23a1 1 0 001.42 0z"
				data-name="Layer 2"
				fill={"#fff"}
			/>
		</svg>
	);
}

export function FullImageView(props) {
	return (
		<svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" {...props}>
			<path
				d="M15.75 3.375h-5.625V2.25A1.125 1.125 0 009 1.125H2.25A1.125 1.125 0 001.125 2.25V13.5a1.125 1.125 0 001.125 1.125h5.625v1.125A1.125 1.125 0 009 16.875h6.75a1.125 1.125 0 001.125-1.125V4.5a1.125 1.125 0 00-1.125-1.125zM2.25 8.438h3.47L4.27 9.893l.793.793 2.812-2.812-2.813-2.813-.793.794 1.452 1.457H2.25V2.25H9V13.5H2.25V8.437zM9 15.75v-1.125a1.125 1.125 0 001.125-1.125v-9h5.625v5.063h-3.47l1.45-1.457-.793-.793-2.812 2.812 2.813 2.813.793-.794-1.452-1.457h3.471v5.063H9z"
				fill="#fff"
			/>
		</svg>
	);
}

export function ShowSidebySide(props) {
	return (
		<svg width={13} height={13} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M13.066 1.172H11.72V.469a.469.469 0 00-.938 0v.703H4.22V.469a.469.469 0 10-.938 0v.703H1.934A1.936 1.936 0 000 3.105v9.961C0 14.133.867 15 1.934 15h11.132A1.936 1.936 0 0015 13.066v-9.96a1.936 1.936 0 00-1.934-1.934zm.996 11.894c0 .55-.445.996-.996.996H1.934a.996.996 0 01-.996-.996V5.303c0-.081.065-.147.146-.147h12.832c.08 0 .146.066.146.147v7.763z"
				fill="#F9F9F9"
			/>
		</svg>
	);
}

export function CorrentSVG(props) {
	return (
		<svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M9.604 1C11.638 1 13 2.428 13 4.552v4.903C13 11.572 11.638 13 9.604 13H4.402C2.368 13 1 11.572 1 9.455V4.552C1 2.428 2.368 1 4.402 1h5.202zm-.096 4.2a.529.529 0 00-.744 0L6.286 7.678l-1.05-1.05a.529.529 0 00-.744 0 .529.529 0 000 .744L5.92 8.794c.102.102.234.15.366.15.138 0 .27-.048.372-.15l2.85-2.85a.529.529 0 000-.744z"
				fill="#9EF25B"
				fillOpacity={0.91}
			/>
		</svg>
	);
}

export function CheckSVG(props) {
	return (
		<svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M13.7 2.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.413 0l-4-4A1 1 0 011.7 6.293l3.293 3.293 7.293-7.293a1 1 0 011.414 0z"
				fill="#ACF861"
			/>
		</svg>
	);
}


export function ExpandableSVG(props) {
	return (
		<svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M1 4V1m0 0h3M1 1l3.75 3.75M13 4V1m0 0h-3m3 0L9.25 4.75M1 10v3m0 0h3m-3 0l3.75-3.75M13 13L9.25 9.25M13 13v-3m0 3h-3"
				stroke="#D766FF"
				strokeWidth={1.3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export { DropdownIconSVG };


function ErrorFlat(props) {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.239 2.254a.833.833 0 011.178 0l3.578 3.578 3.577-3.578a.833.833 0 111.179 1.179L8.173 7.01l3.578 3.578a.834.834 0 01-1.179 1.178L6.995 8.188l-3.578 3.578a.833.833 0 01-1.178-1.178L5.816 7.01 2.24 3.433a.833.833 0 010-1.179z"
				fill="#FF4163"
			/>
		</svg>
	);
}



function REVIEW_REQUIRED_FLAT(props) {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.667 6.666C1.667 4.021 4.127 2 7 2s5.333 2.021 5.333 4.666c0 2.644-2.46 4.667-5.333 4.667-.336 0-.67-.028-1.002-.083-.76.547-1.69.809-2.624.739a.5.5 0 01-.389-.763c.218-.352.338-.756.348-1.17-1.014-.84-1.666-2.04-1.666-3.39z"
				fill="#FF8159"
			/>
		</svg>
	);
}





export const TestNewStatusSVG = ({ type, ...props }) => {
	if (type === "FAILED") {
		return <ErrorFlat {...props} />;
	}
	if (type === "MANUAL_REVIEW_REQUIRED") {
		return <REVIEW_REQUIRED_FLAT {...props} />;
	}
	return <CheckSVG {...props} />;
};




export const StatusIconSquare = ({ type, ...props }) => {
	if (type === "FAILED") {
		return <ErrorSquare {...props} />;
	}
	if (type === "MANUAL_REVIEW_REQUIRED") {
		return <REVIEW_REQUIRED_FLAT {...props} />;
	}
	if (type === "RUNNING") {
		return <RunningSVG {...props} />;
	}
	if (type === "INITIATED") {
		return <InitiatedSVG {...props} />;
	}
	return <CheckSquare {...props} />;
};

export function CheckSquare(props) {
	return (
		<svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M10.008 0c2.349 0 3.922 1.666 3.922 4.144v5.72c0 2.47-1.573 4.136-3.922 4.136H3.998C1.65 14 .07 12.334.07 9.863v-5.72C.07 1.667 1.65 0 4 0h6.008zm-.111 4.9a.606.606 0 00-.86 0L6.175 7.79 4.963 6.567a.606.606 0 00-.86 0 .621.621 0 000 .868l1.65 1.659a.59.59 0 00.422.175c.16 0 .312-.056.43-.175l3.292-3.325a.621.621 0 000-.868z"
				fill="#9EF25B"
				fillOpacity={0.91}
			/>
		</svg>
	);
}

function ErrorSquare(props) {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g clipPath="url(#prefix__clip0_3445_4199)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5.395 4.405a.7.7 0 10-.99.99L6.01 7 4.405 8.605a.7.7 0 00.99.99L7 7.99l1.605 1.605a.7.7 0 10.99-.99L7.99 7l1.605-1.605a.7.7 0 10-.99-.99L7 6.01 5.395 4.405zM3.675.271C4.585.07 5.687 0 7 0c1.313 0 2.416.07 3.325.271.917.204 1.68.552 2.266 1.139.586.586.934 1.348 1.138 2.265C13.93 4.585 14 5.687 14 7c0 1.313-.07 2.416-.271 3.325-.204.917-.552 1.68-1.138 2.266-.587.586-1.349.934-2.266 1.138C9.415 13.93 8.313 14 7 14c-1.313 0-2.416-.07-3.325-.271-.917-.204-1.68-.552-2.265-1.138-.587-.587-.935-1.349-1.139-2.266C.07 9.415 0 8.313 0 7c0-1.313.07-2.416.271-3.325.204-.917.552-1.68 1.139-2.265C1.996.823 2.758.475 3.675.27v.001z"
					fill="#E0307A"
				/>
			</g>
			<defs>
				<clipPath id="prefix__clip0_3445_4199">
					<path fill="#fff" d="M0 0h14v14H0z" />
				</clipPath>
			</defs>
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

