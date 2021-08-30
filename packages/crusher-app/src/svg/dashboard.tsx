import React from "react";

export function AddSVG(props) {
	return (
		<svg width={11} height={11} viewBox="0 0 11 11" fill="none" {...props}>
			<g>
				<path
					d="M10.25 4.5H6.5V.75A.75.75 0 005.75 0h-.5a.75.75 0 00-.75.75V4.5H.75a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75H4.5v3.75c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75V6.5h3.75a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75z"
					fill="#BDBDBD"
				/>
			</g>
		</svg>
	);
}

export function TraySVG(props) {
	return (
		<svg width={13} height={13} viewBox="0 0 13 13" fill="none" {...props}>
			<g>
				<path
					d="M13 6.193a.54.54 0 00-.078-.243l-2.437-4.062a.541.541 0 00-.465-.263H2.98c-.19 0-.367.1-.465.263L.078 5.95a.54.54 0 00-.077.243c-.002.012 0 4.099 0 4.099 0 .597.486 1.083 1.083 1.083h10.832c.597 0 1.083-.486 1.083-1.083 0 0 .002-4.087 0-4.1zm-2.709-.235c-.597 0-1.083.486-1.083 1.084a.542.542 0 01-.542.541H4.334a.542.542 0 01-.542-.541c0-.598-.486-1.084-1.083-1.084H1.336l1.95-3.25h6.428l1.95 3.25H10.29z"
					fill="#BDBDBD"
				/>
			</g>
		</svg>
	);
}

export function SearchSVG(props) {
	return (
		<svg width={13} height={13} viewBox="0 0 13 13" fill="none" {...props}>
			<path
				d="M12.585 11.84L9.49 8.624a5.232 5.232 0 001.231-3.374A5.255 5.255 0 005.473 0 5.255 5.255 0 00.225 5.249a5.255 5.255 0 005.248 5.249 5.192 5.192 0 003.007-.95l3.118 3.242a.681.681 0 00.968.019.685.685 0 00.019-.968zM5.473 1.37c2.14 0 3.88 1.74 3.88 3.879 0 2.139-1.74 3.88-3.88 3.88-2.139 0-3.88-1.741-3.88-3.88 0-2.14 1.741-3.88 3.88-3.88z"
				fill="#BDBDBD"
			/>
		</svg>
	);
}

export function LayoutSVG(props) {
	return (
		<svg height={12} viewBox="0 0 11 12" fill="none" {...props}>
			<g fill="#BDBDBD">
				<path d="M4.24 0H.802C.36 0 0 .392 0 .875v2.25C0 3.608.36 4 .802 4H4.24c.442 0 .802-.392.802-.875V.875C5.042.392 4.682 0 4.24 0zM4.24 5H.802C.36 5 0 5.392 0 5.875v5.25c0 .482.36.875.802.875H4.24c.442 0 .802-.393.802-.875v-5.25c0-.483-.36-.875-.802-.875zM10.199 8H6.76c-.442 0-.802.392-.802.875v2.25c0 .482.36.875.802.875H10.2c.442 0 .802-.393.802-.875v-2.25c0-.483-.36-.875-.802-.875zM10.199 0H6.76C6.32 0 5.96.392 5.96.875v5.25c0 .483.36.875.802.875H10.2c.442 0 .802-.392.802-.875V.875C11 .392 10.64 0 10.199 0z" />
			</g>
		</svg>
	);
}

export function ReportSVG(props) {
	return (
		<svg
			width={32}
			height={32}
			viewBox="0 0 32 32"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M23 27h4.003C28.106 27 29 26.11 29 25.003V8h-4.994A1.997 1.997 0 0122 6.002V0h-9.991C10.899 0 10 .898 10 2.007V4h7.5l6.5 7.6V27h-1V13h-4.994A1.997 1.997 0 0116 11.002V5H6.009C4.899 5 4 5.898 4 7.007v22.986A2 2 0 005.997 32h15.006C22.106 32 23 31.11 23 30.003V27zm0-27v5.997c0 .554.451 1.003.99 1.003H29l-6-7zm-6 5v5.997c0 .554.451 1.003.99 1.003H23l-6-7z"
				fill="#BDBDBD"
				fillRule="evenodd"
			/>
		</svg>
	)
}


export function HelpSVG(props) {
	return (
		<svg width={13} height={13} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M6.5 10.245a.635.635 0 100-1.27.635.635 0 000 1.27z" fill="#BDBDBD" />
			<path
				d="M6.5 0A6.496 6.496 0 000 6.5C0 10.092 2.907 13 6.5 13c3.592 0 6.5-2.907 6.5-6.5C13 2.908 10.093 0 6.5 0zm0 11.984A5.481 5.481 0 011.016 6.5 5.481 5.481 0 016.5 1.016 5.481 5.481 0 0111.984 6.5 5.481 5.481 0 016.5 11.984z"
				fill="#BDBDBD"
			/>
			<path
				d="M6.5 3.263c-1.12 0-2.031.91-2.031 2.031a.508.508 0 101.015 0 1.017 1.017 0 012.032 0c0 .56-.456 1.016-1.016 1.016a.508.508 0 00-.508.507v1.27a.508.508 0 101.016 0V7.26A2.035 2.035 0 008.53 5.294c0-1.12-.911-2.031-2.031-2.031z"
				fill="#BDBDBD"
			/>
		</svg>
	);
}

export function PlaySVG(props) {
	return (
		<svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g>
				<path
					d="M2.977.309C1.715-.415.69.178.69 1.632v10.735c0 1.456 1.024 2.048 2.286 1.325l9.382-5.381c1.263-.724 1.263-1.898 0-2.622L2.977.31z"
					fill="#647CFF"
				/>
			</g>
		</svg>
	);
}

export function RightArrow(props) {
	return (
		<svg width={9} height={9} viewBox="0 0 9 9" fill="none" {...props}>
			<g>
				<path
					d="M7.066 4.5a.628.628 0 01-.185.446l-3.87 3.87a.63.63 0 11-.89-.892L5.543 4.5 2.12 1.076a.63.63 0 01.892-.891l3.87 3.87a.628.628 0 01.184.445z"
					fill="#BDBDBD"
					fillOpacity={0.7}
				/>
			</g>
		</svg>
	);
}

export function LoadingSVG(props) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={200} height={200} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block" {...props}>
			<circle cx={50} cy={50} fill="none" stroke={props.color || "#85a2b6"} strokeWidth={10} r={35} strokeDasharray="164.93361431346415 56.97787143782138">
				<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur=".61s" values="0 50 50;360 50 50" keyTimes="0;1" />
			</circle>
		</svg>
	);
}

export function AppleSVG(props) {
	const { variant } = props;

	return (
		<svg width={17} height={16} viewBox="0 0 17 16" fill="none" {...props}>
			<g fill={variant === "white" ? "#fff" : "#293264"}>
				<path d="M11.356.47c-.86.056-1.865.57-2.45 1.24-.535.606-.974 1.508-.803 2.384.94.028 1.91-.499 2.473-1.18.526-.632.924-1.528.78-2.443z" />
				<path d="M14.754 5.523c-.826-.967-1.986-1.528-3.082-1.528-1.446 0-2.058.647-3.063.647-1.037 0-1.824-.645-3.075-.645-1.229 0-2.538.701-3.367 1.9C1 7.586 1.2 10.76 3.09 13.464c.677.968 1.58 2.056 2.761 2.065 1.052.01 1.348-.63 2.773-.636 1.424-.008 1.694.645 2.744.634 1.182-.008 2.135-1.214 2.811-2.181.485-.694.666-1.043 1.042-1.826-2.735-.973-3.174-4.603-.467-5.997z" />
			</g>
		</svg>
	);
}

export function CloseSVG(props) {
	return (
		<svg width={15} height={15} viewBox="0 0 15 15" fill="none" {...props}>
			<path
				d="M12.818 11.326L8.99 7.5l3.827-3.826a1.052 1.052 0 000-1.491 1.052 1.052 0 00-1.492 0L7.5 6.009 3.674 2.183a1.052 1.052 0 00-1.491 0 1.052 1.052 0 000 1.491L6.009 7.5l-3.826 3.826a1.052 1.052 0 000 1.492 1.052 1.052 0 001.491 0L7.5 8.99l3.826 3.827a1.052 1.052 0 001.492 0c.41-.413.41-1.081 0-1.492z"
				fill="#FCFCFC"
			/>
		</svg>
	);
}

export function FullScreenSVG(props) {
	return (
		<svg width={13} height={13} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g clipPath="url(#prefix__clip0)" fill="#899CFF">
				<path d="M7.639 0v1.389h2.49L3.301 8.215l.982.983 6.827-6.826v2.49H12.5V0H7.639z" />
				<path d="M11.111 11.111H1.39V1.39H6.25V0H1.389C.622 0 0 .622 0 1.389v9.722C0 11.88.622 12.5 1.389 12.5h9.722c.768 0 1.389-.621 1.389-1.389V6.25h-1.389v4.861z" />
			</g>
			<defs>
				<clipPath id="prefix__clip0">
					<path fill="#fff" d="M0 0h12.5v12.5H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}

export function CompleteStatusIconSVG(props) {
	const { isCompleted, ...otherProps } = props;

	return (
		<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...otherProps}>
			<path
				d="M8 0C3.589 0 0 3.589 0 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm4.471 5.895l-5.113 5.072c-.3.301-.782.321-1.102.02L3.549 8.521a.813.813 0 01-.06-1.123c.3-.32.802-.34 1.123-.04l2.145 1.965 4.571-4.571a.799.799 0 011.143 0c.321.32.321.822 0 1.143z"
				fill={isCompleted ? "#AACB65" : "#404144"}
			/>
		</svg>
	);
}

export function NewTabSVG(props) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={14} height={14} {...props}>
			<path d="M19 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5v14h14v-7h2v7c0 1.1-.9 2-2 2z" fill={"#BDBDBD"} />
			<path d="M21 10h-2V5h-5V3h7z" fill={"#BDBDBD"} />
			<path d="M8.278 14.308l11.03-11.03 1.414 1.414-11.03 11.03z" fill={"#BDBDBD"} />
		</svg>
	);
}
