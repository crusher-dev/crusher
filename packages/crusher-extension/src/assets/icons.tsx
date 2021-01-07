import React from "react";

interface NavigateIconProps {
	onClick: () => any;
	disabled: boolean;
}

const NavigateBackIcon = (props: NavigateIconProps) => {
	const { disabled, onClick } = props;

	return (
		<svg
			fill={!disabled ? "#fff" : "#5F6368"}
			viewBox="0 0 24 24"
			width={24}
			height={24}
			onClick={onClick}
		>
			<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
		</svg>
	);
};

const NavigateForwardIcon = (props: NavigateIconProps) => {
	const { disabled, onClick } = props;

	return (
		<svg
			fill={!disabled ? "#fff" : "#5F6368"}
			style={{ transform: "rotate(180deg)" }}
			viewBox="0 0 24 24"
			width={24}
			height={24}
			onClick={onClick}
		>
			<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
		</svg>
	);
};

const NavigateRefreshIcon = (props: NavigateIconProps) => {
	const { disabled, onClick } = props;

	return (
		<svg
			fill={!disabled ? "#fff" : "#5F6368"}
			viewBox="0 0 24 24"
			width="24"
			height="24"
			onClick={onClick}
		>
			<g>
				<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
			</g>
		</svg>
	);
};

const RecordLabelIcon = () => {
	return (
		<svg width="21" height="21" viewBox="0 0 21 21" fill="none">
			<path
				d="M10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21Z"
				fill="#5B76F7"
			/>
			<path
				d="M10.5 19.8569C16.1072 19.8569 20.6875 15.4616 20.9844 9.9285C20.9945 10.1177 21 10.3083 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 10.3083 0.00549698 10.1177 0.0156269 9.9285C0.312498 15.4616 4.8928 19.8569 10.5 19.8569Z"
				fill="#5B76F7"
			/>
			<path
				d="M10.4999 19.2976C5.64116 19.2976 1.70236 15.3588 1.70236 10.5001C1.70236 5.64132 5.64116 1.70251 10.4999 1.70251C15.3587 1.70251 19.2975 5.64132 19.2975 10.5001C19.2975 15.3588 15.3587 19.2976 10.4999 19.2976Z"
				fill="white"
			/>
			<path
				d="M10.4999 18.1545C15.1666 18.1545 18.9839 14.5208 19.2785 9.9285C19.2906 10.1175 19.2975 10.308 19.2975 10.5C19.2975 15.3588 15.3587 19.2976 10.4999 19.2976C5.64117 19.2976 1.70236 15.3588 1.70236 10.5C1.70236 10.308 1.70921 10.1175 1.72135 9.9285C2.01593 14.5208 5.83325 18.1545 10.4999 18.1545Z"
				fill="#EBE7E7"
			/>
			<path
				d="M7.86 13.482H12.896C13.1622 13.482 13.378 13.2662 13.378 13V7.96401C13.378 7.6978 13.1622 7.48201 12.896 7.48201H7.86C7.59378 7.48201 7.37799 7.6978 7.37799 7.96401V13C7.37799 13.2662 7.59381 13.482 7.86 13.482Z"
				fill="#5B76F7"
			/>
		</svg>
	);
};

const BrowserIcon = (props: any) => {
	return (
		<svg width={37} height={37} viewBox="0 0 37 37" fill="none" {...props}>
			<g clipPath="url(#prefix__clip0)">
				<path
					d="M32.375 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625h27.75A4.63 4.63 0 0037 30.833V6.167a4.63 4.63 0 00-4.625-4.625z"
					fill="#607D8B"
				/>
				<path
					d="M32.375 32.375H4.625c-.85 0-1.542-.69-1.542-1.542V9.25h30.833v21.583c0 .851-.692 1.542-1.541 1.542z"
					fill="#fff"
				/>
				<path
					d="M24.209 22.306c.029-.239.072-.476.072-.723 0-.248-.043-.484-.072-.723l1.387-1.051a.772.772 0 00.202-1l-1.247-2.159a.771.771 0 00-.967-.325L21.985 17a5.784 5.784 0 00-1.262-.75l-.213-1.698a.77.77 0 00-.763-.677h-2.493a.77.77 0 00-.765.675l-.212 1.698a5.792 5.792 0 00-1.263.75l-1.599-.675a.775.775 0 00-.968.327L11.2 18.808a.772.772 0 00.202 1l1.388 1.052c-.028.24-.071.475-.071.723s.043.484.072.723l-1.388 1.052a.772.772 0 00-.201 1l1.247 2.159a.771.771 0 00.966.325l1.6-.675c.39.296.804.56 1.262.75l.212 1.698a.77.77 0 00.764.677h2.492a.77.77 0 00.765-.676l.213-1.697a5.783 5.783 0 001.262-.75l1.6.674c.357.152.772.011.966-.325l1.247-2.158a.772.772 0 00-.202-1l-1.387-1.054z"
					fill="#4CAF50"
				/>
				<path
					d="M18.5 24.667a3.084 3.084 0 110-6.167 3.084 3.084 0 010 6.167z"
					fill="#fff"
				/>
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
		<svg width={17} height={17} viewBox="0 0 17 17" fill="none" {...props}>
			<path
				d="M16.564 13.792L3.241.47a1.487 1.487 0 00-2.103 0l-.702.701a1.487 1.487 0 000 2.104l13.323 13.323a1.487 1.487 0 002.103 0l.701-.701a1.486 1.486 0 00.001-2.104z"
				fill="#9F9F9F"
			/>
			<path
				d="M13.759.47L.436 13.793a1.487 1.487 0 000 2.103l.7.701a1.487 1.487 0 002.104 0L16.564 3.276a1.486 1.486 0 000-2.103l-.701-.7A1.487 1.487 0 0013.759.47z"
				fill="#9F9F9F"
			/>
		</svg>
	);
};

const BulbIcon = (props: any) => {
	return (
		<svg width={38} height={38} viewBox="0 0 38 38" fill="none" {...props}>
			<path
				d="M18.5 15.236a.594.594 0 01-.594-.594v-1.548a.594.594 0 011.188 0v1.548a.594.594 0 01-.594.594zM23.702 17.392a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.095a.592.592 0 01-.42.174zM27.406 22.594h-1.549a.594.594 0 010-1.188h1.549a.594.594 0 010 1.188zM24.797 28.891a.596.596 0 01-.42-.173l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.096a.594.594 0 01-.42 1.013zM12.202 28.891a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.096a.589.589 0 01-.42.173zM11.142 22.594H9.594a.594.594 0 010-1.188h1.548a.594.594 0 010 1.188zM13.297 17.392a.596.596 0 01-.42-.174l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.097a.594.594 0 01-.42 1.013z"
				fill="#B6C2FF"
			/>
			<path
				d="M20.875 29.125v.99c0 .76-.626 1.385-1.386 1.385h-1.98c-.663 0-1.384-.507-1.384-1.615v-.76h4.75zM21.991 17.693a5.56 5.56 0 00-4.679-1.108c-2.098.436-3.8 2.146-4.235 4.243-.443 2.153.364 4.29 2.09 5.597.466.348.792.887.902 1.511v.009c.017-.007.04-.007.056-.007h4.75c.015 0 .024 0 .04.008v-.008c.11-.602.466-1.156 1.012-1.583A5.529 5.529 0 0024.041 22a5.518 5.518 0 00-2.05-4.307zm-.522 4.703a.599.599 0 01-.594-.594 2.176 2.176 0 00-2.177-2.177.599.599 0 01-.593-.594c0-.324.27-.593.593-.593a3.371 3.371 0 013.364 3.364c0 .325-.27.594-.593.594z"
				fill="#5B76F7"
			/>
			<path
				d="M16.07 27.938h.055c-.015 0-.039 0-.056.008v-.009zM20.914 27.938v.008c-.015-.009-.024-.009-.039-.009h.04z"
				fill="#000"
			/>
		</svg>
	);
};

const BackIcon = (props: any) => {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
			<g clipPath="url(#clip0)">
				<path
					d="M11.3255 5.05902L11.3442 5.06311H3.31434L5.83864 2.53326C5.96225 2.40975 6.03005 2.24243 6.03005 2.06682C6.03005 1.89121 5.96225 1.72507 5.83864 1.60126L5.44586 1.20828C5.32234 1.08477 5.15776 1.01648 4.98225 1.01648C4.80664 1.01648 4.64195 1.08428 4.51844 1.2078L0.19132 5.53453C0.0673197 5.65853 -0.000485191 5.8237 2.61379e-06 5.99941C-0.000485191 6.17609 0.0673197 6.34136 0.19132 6.46516L4.51844 10.7923C4.64195 10.9157 4.80654 10.9836 4.98225 10.9836C5.15776 10.9836 5.32234 10.9156 5.44586 10.7923L5.83864 10.3993C5.96225 10.276 6.03005 10.1113 6.03005 9.9357C6.03005 9.76019 5.96225 9.60419 5.83864 9.48077L3.28586 6.93677H11.3344C11.6961 6.93677 12 6.62507 12 6.2636V5.7078C12 5.34633 11.6871 5.05902 11.3255 5.05902Z"
					fill="white"
				/>
			</g>
			<defs>
				<clipPath id="clip0">
					<rect width="12" height="12" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

export {
	NavigateBackIcon,
	NavigateForwardIcon,
	NavigateRefreshIcon,
	RecordLabelIcon,
	BrowserIcon,
	CloseModalIcon,
	BulbIcon,
	BackIcon,
};
