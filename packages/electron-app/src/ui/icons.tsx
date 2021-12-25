import { css } from "@emotion/react";
import React from "react";

const SettingsIcon = (props: any) => {
	return (
		<svg viewBox="0 0 14 14" fill="none" {...props}>
			<path
				d="M13.2317 5.47983L12.1351 5.34042C12.0447 5.06217 11.9332 4.79383 11.8032 4.53892L12.4804 3.66683C12.7546 3.31392 12.7225 2.81575 12.4093 2.51242L11.4905 1.59367C11.1842 1.2775 10.6861 1.246 10.3326 1.51958L9.46167 2.19683C9.20675 2.06675 8.93842 1.95533 8.65958 1.86492L8.52017 0.77C8.46767 0.33075 8.09492 0 7.65333 0H6.34667C5.90508 0 5.53233 0.33075 5.47983 0.76825L5.34042 1.86492C5.06158 1.95533 4.79325 2.06617 4.53833 2.19683L3.66683 1.51958C3.3145 1.246 2.81633 1.2775 2.51242 1.59075L1.59367 2.50892C1.2775 2.81575 1.24542 3.31392 1.51958 3.66742L2.19683 4.53892C2.06617 4.79383 1.95533 5.06217 1.86492 5.34042L0.77 5.47983C0.33075 5.53233 0 5.90508 0 6.34667V7.65333C0 8.09492 0.33075 8.46767 0.76825 8.52017L1.86492 8.65958C1.95533 8.93783 2.06675 9.20617 2.19683 9.46108L1.51958 10.3332C1.24542 10.6861 1.2775 11.1842 1.59075 11.4876L2.5095 12.4063C2.81633 12.7219 3.31392 12.7534 3.66742 12.4798L4.53892 11.8026C4.79383 11.9332 5.06217 12.0447 5.34042 12.1345L5.47983 13.2288C5.53233 13.6692 5.90508 14 6.34667 14H7.65333C8.09492 14 8.46767 13.6692 8.52017 13.2317L8.65958 12.1351C8.93783 12.0447 9.20617 11.9332 9.46108 11.8032L10.3332 12.4804C10.6861 12.7546 11.1842 12.7225 11.4876 12.4093L12.4063 11.4905C12.7225 11.1837 12.7546 10.6861 12.4804 10.3326L11.8032 9.46108C11.9338 9.20617 12.0452 8.93783 12.1351 8.65958L13.2294 8.52017C13.6687 8.46767 13.9994 8.09492 13.9994 7.65333V6.34667C14 5.90508 13.6692 5.53233 13.2317 5.47983ZM7 9.91667C5.39175 9.91667 4.08333 8.60825 4.08333 7C4.08333 5.39175 5.39175 4.08333 7 4.08333C8.60825 4.08333 9.91667 5.39175 9.91667 7C9.91667 8.60825 8.60825 9.91667 7 9.91667Z"
				fill="#969696"
			/>
		</svg>
	);
};

const NavigateBackIcon = (props: any) => {
	const { disabled, onClick } = props;

	return (
		<svg fill={!disabled ? "#fff" : "#5F6368"} viewBox="0 0 24 24" onClick={onClick} {...props}>
			<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
		</svg>
	);
};

const NavigateRefreshIcon = (props: any) => {
	const { disabled, onClick } = props;

	return (
		<svg fill={!disabled ? "#fff" : "#5F6368"} viewBox="0 0 24 24" onClick={onClick} {...props}>
			<g>
				<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
			</g>
		</svg>
	);
};

const SearchIcon = (props: any) => {
	return (
		<svg {...props} viewBox="0 0 13 13" fill="none">
			<path
				d="M12.5847 11.8409L9.4907 8.623C10.2862 7.67732 10.7221 6.48745 10.7221 5.24874C10.7221 2.35463 8.36747 0 5.47335 0C2.57924 0 0.224609 2.35463 0.224609 5.24874C0.224609 8.14286 2.57924 10.4975 5.47335 10.4975C6.55984 10.4975 7.59522 10.1698 8.48043 9.5477L11.598 12.7901C11.7283 12.9254 11.9035 13 12.0913 13C12.2691 13 12.4378 12.9322 12.5658 12.809C12.8378 12.5472 12.8465 12.1132 12.5847 11.8409ZM5.47335 1.36924C7.61256 1.36924 9.35286 3.10954 9.35286 5.24874C9.35286 7.38795 7.61256 9.12825 5.47335 9.12825C3.33415 9.12825 1.59385 7.38795 1.59385 5.24874C1.59385 3.10954 3.33415 1.36924 5.47335 1.36924Z"
				fill="white"
			/>
		</svg>
	);
};

const MouseIcon = (props) => {
	return (
		<svg width={12} height={19} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M6.02 6.039c.371 0 .672-.47.672-1.049s-.301-1.048-.673-1.048c-.372 0-.673.47-.673 1.048 0 .58.301 1.049.673 1.049ZM0 9.98v2.728c.004 1.645.59 3.17 1.65 4.295a5.49 5.49 0 0 0 4.035 1.741h.653a5.5 5.5 0 0 0 4.04-1.749c1.05-1.122 1.626-2.646 1.622-4.29V9.98H0Z" fill="#595268" />
			<path d="M10.933.888A3.522 3.522 0 0 0 8.566 0H6.614v2.805c.736.308 1.267 1.17 1.267 2.185 0 1.015-.531 1.877-1.267 2.185v1.547H12v-5.41A3.228 3.228 0 0 0 10.933.887Z" fill="#7E42FF" />
			<path d="M4.158 4.99c0-1.014.532-1.877 1.268-2.185V0H3.483C1.525.006-.005 1.462 0 3.313v5.409h5.426V7.175c-.736-.308-1.268-1.17-1.268-2.185Z" fill="#595268" />
	  	</svg>
	);
};

const WarningIcon = (props) => (
	<svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<g clipPath="url(#clip0_1539_948)">
			<path
				d="M1.42434 12.3063C0.155444 12.3063 -0.363674 11.4072 0.270772 10.3083L5.34644 1.51706C5.98088 0.418142 7.01907 0.418142 7.65352 1.51706L12.7292 10.3083C13.3636 11.4072 12.8445 12.3063 11.5756 12.3063H1.42434Z"
				fill="#FF629A"
			/>
			<path
				d="M12.7292 10.3082L7.65356 1.51697C7.33636 0.967485 6.91814 0.693557 6.5 0.693604V12.3062H11.5757C12.8446 12.3062 13.3637 11.4071 12.7292 10.3082Z"
				fill="#DE3D76"
			/>
			<path d="M6.50028 8.12761H5.57171L5.10742 4.41333H6.50028L6.96456 6.27047L6.50028 8.12761Z" fill="white" />
			<path d="M7.42857 8.12761H6.5V4.41333H7.89286L7.42857 8.12761Z" fill="white" />
			<path d="M6.49986 10.9134H5.57129V9.05627H6.49986L6.96415 9.98485L6.49986 10.9134Z" fill="white" />
			<path d="M7.42857 9.05627H6.5V10.9134H7.42857V9.05627Z" fill="white" />
		</g>
		<defs>
			<clipPath id="clip0_1539_948">
				<rect width="13" height="13" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

const BrowserIcon = (props: any) => {
	return (
		<svg width={37} height={37} viewBox="0 0 37 37" fill="none" {...props}>
			<g clipPath="url(#prefix__clip0)">
				<path
					d="M32.375 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625h27.75A4.63 4.63 0 0037 30.833V6.167a4.63 4.63 0 00-4.625-4.625z"
					fill="#607D8B"
				/>
				<path d="M32.375 32.375H4.625c-.85 0-1.542-.69-1.542-1.542V9.25h30.833v21.583c0 .851-.692 1.542-1.541 1.542z" fill="#fff" />
				<path
					d="M24.209 22.306c.029-.239.072-.476.072-.723 0-.248-.043-.484-.072-.723l1.387-1.051a.772.772 0 00.202-1l-1.247-2.159a.771.771 0 00-.967-.325L21.985 17a5.784 5.784 0 00-1.262-.75l-.213-1.698a.77.77 0 00-.763-.677h-2.493a.77.77 0 00-.765.675l-.212 1.698a5.792 5.792 0 00-1.263.75l-1.599-.675a.775.775 0 00-.968.327L11.2 18.808a.772.772 0 00.202 1l1.388 1.052c-.028.24-.071.475-.071.723s.043.484.072.723l-1.388 1.052a.772.772 0 00-.201 1l1.247 2.159a.771.771 0 00.966.325l1.6-.675c.39.296.804.56 1.262.75l.212 1.698a.77.77 0 00.764.677h2.492a.77.77 0 00.765-.676l.213-1.697a5.783 5.783 0 001.262-.75l1.6.674c.357.152.772.011.966-.325l1.247-2.158a.772.772 0 00-.202-1l-1.387-1.054z"
					fill="#4CAF50"
				/>
				<path d="M18.5 24.667a3.084 3.084 0 110-6.167 3.084 3.084 0 010 6.167z" fill="#fff" />
				<path
					d="M18.5 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625H18.5v-3.083H4.625c-.85 0-1.542-.69-1.542-1.542V9.25H18.5V1.542z"
					fill="#546D79"
				/>
				<path
					d="M18.5 9.25H3.083v21.583c0 .851.692 1.542 1.542 1.542H18.5v-3.083h-1.247a.77.77 0 01-.765-.676l-.213-1.697a5.786 5.786 0 01-1.263-.75l-1.598.674a.773.773 0 01-.968-.325l-1.248-2.158a.772.772 0 01.202-1l1.388-1.052c-.026-.24-.07-.477-.07-.725s.044-.484.073-.723l-1.388-1.051a.772.772 0 01-.202-1l1.248-2.159a.771.771 0 01.968-.325l1.598.675c.39-.296.805-.56 1.263-.75l.213-1.698a.767.767 0 01.762-.677H18.5V9.25z"
					fill="#DEDEDE"
				/>
				<path
					d="M18.5 13.875h-1.247a.77.77 0 00-.765.675l-.212 1.698a5.79 5.79 0 00-1.263.75l-1.599-.675a.773.773 0 00-.968.325L11.2 18.807a.772.772 0 00.202 1l1.388 1.052c-.027.24-.07.476-.07.724s.043.484.073.723l-1.388 1.052a.772.772 0 00-.202 1l1.247 2.159a.773.773 0 00.969.325l1.598-.675c.39.296.805.56 1.263.75l.213 1.698a.767.767 0 00.761.677H18.5v-4.625a3.084 3.084 0 010-6.167v-4.625z"
					fill="#429846"
				/>
				<path d="M18.5 18.5a3.083 3.083 0 000 6.167V18.5z" fill="#DEDEDE" />
			</g>
			<defs>
				<clipPath id="prefix__clip0">
					<path fill="#fff" d="M0 0h37v37H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};

const CloseModalIcon = (props: any) => {
	return (
		<svg width={17} height={17} viewBox="0 0 17 17" fill="none" css={css`fill: #ffffff1a; path { fill: inherit; } &:hover {fill: #9F9F9F}`} {...props} >
			<path
				d="M16.564 13.792L3.241.47a1.487 1.487 0 00-2.103 0l-.702.701a1.487 1.487 0 000 2.104l13.323 13.323a1.487 1.487 0 002.103 0l.701-.701a1.486 1.486 0 00.001-2.104z"
			/>
			<path
				d="M13.759.47L.436 13.793a1.487 1.487 0 000 2.103l.7.701a1.487 1.487 0 002.104 0L16.564 3.276a1.486 1.486 0 000-2.103l-.701-.7A1.487 1.487 0 0013.759.47z"
			/>
		</svg>
	);
};

const LoadingIcon = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={{
				margin: "auto",
				background: "#fff",
			}}
			width={200}
			height={200}
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid"
			display="block"
			{...props}
		>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(30 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(60 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(90 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(120 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(150 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(180 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(210 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(240 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(270 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(300 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite" />
			</rect>
			<rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#fe718d" transform="rotate(330 50 50)">
				<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite" />
			</rect>
		</svg>
	);
};

export { SettingsIcon, NavigateBackIcon, NavigateRefreshIcon, SearchIcon, MouseIcon, WarningIcon, BrowserIcon, CloseModalIcon, LoadingIcon };