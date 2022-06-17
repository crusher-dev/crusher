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
		<svg width={12} height={19} viewBox={"0 0 12 19"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M6.02 6.039c.371 0 .672-.47.672-1.049s-.301-1.048-.673-1.048c-.372 0-.673.47-.673 1.048 0 .58.301 1.049.673 1.049ZM0 9.98v2.728c.004 1.645.59 3.17 1.65 4.295a5.49 5.49 0 0 0 4.035 1.741h.653a5.5 5.5 0 0 0 4.04-1.749c1.05-1.122 1.626-2.646 1.622-4.29V9.98H0Z"
				fill="#595268"
			/>
			<path
				d="M10.933.888A3.522 3.522 0 0 0 8.566 0H6.614v2.805c.736.308 1.267 1.17 1.267 2.185 0 1.015-.531 1.877-1.267 2.185v1.547H12v-5.41A3.228 3.228 0 0 0 10.933.887Z"
				fill="#7E42FF"
			/>
			<path
				d="M4.158 4.99c0-1.014.532-1.877 1.268-2.185V0H3.483C1.525.006-.005 1.462 0 3.313v5.409h5.426V7.175c-.736-.308-1.268-1.17-1.268-2.185Z"
				fill="#595268"
			/>
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
		<svg
			width={17}
			height={17}
			viewBox="0 0 17 17"
			fill="none"
			css={css`
				fill: #ffffff1a;
				path {
					fill: inherit;
				}
				&:hover {
					fill: #9f9f9f;
				}
			`}
			{...props}
		>
			<path d="M16.564 13.792L3.241.47a1.487 1.487 0 00-2.103 0l-.702.701a1.487 1.487 0 000 2.104l13.323 13.323a1.487 1.487 0 002.103 0l.701-.701a1.486 1.486 0 00.001-2.104z" />
			<path d="M13.759.47L.436 13.793a1.487 1.487 0 000 2.103l.7.701a1.487 1.487 0 002.104 0L16.564 3.276a1.486 1.486 0 000-2.103l-.701-.7A1.487 1.487 0 0013.759.47z" />
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
				display: "block",
				shapeRendering: "auto",
			}}
			width={200}
			height={200}
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid"
			{...props}
		>
			<circle cx={50} cy={50} fill="none" stroke="#fff" strokeWidth={10} r={35} strokeDasharray="164.93361431346415 56.97787143782138">
				<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
			</circle>
		</svg>
	);
};

const DeleteIcon = (props: any) => {
	const [isHover, setIsHover] = React.useState(false);

	const handleMouseUp = () => {
		setIsHover(true);
	};

	const handleMouseOut = () => {
		setIsHover(false);
	};

	const customStyle = props.style ? { ...props.style } : {};
	const customContainerStyle = props.containerStyle ? { ...props.containerStyle } : {};

	return (
		<div
			onMouseEnter={handleMouseUp}
			onMouseLeave={handleMouseOut}
			{...props}
			style={{
				...customContainerStyle,
				opacity: isHover ? 0.7 : 1,
				paddingLeft: 8,
				paddingRight: 8,
			}}
		>
			<svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...customStyle }}>
				<path
					d="M7.322 6.007l4.486-4.487A.653.653 0 0012 1.056a.651.651 0 00-.192-.464l-.393-.393a.65.65 0 00-.464-.192.65.65 0 00-.464.192L6 4.685 1.513.2A.65.65 0 001.05.007a.65.65 0 00-.464.192L.192.592a.657.657 0 000 .928l4.487 4.487-4.487 4.486a.652.652 0 00-.192.464c0 .176.068.34.192.464l.393.394a.65.65 0 00.464.191.65.65 0 00.464-.191L6 7.328l4.487 4.487a.651.651 0 00.464.191c.176 0 .34-.068.464-.191l.393-.393a.652.652 0 00.192-.465.652.652 0 00-.192-.464L7.322 6.007z"
					fill="#D7D7D7"
				/>
			</svg>
		</div>
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
			<path d="M16.07 27.938h.055c-.015 0-.039 0-.056.008v-.009zM20.914 27.938v.008c-.015-.009-.024-.009-.039-.009h.04z" fill="#000" />
		</svg>
	);
};

const MoreIcon = (props: any) => {
	return (
		<svg width={15} height={4} viewBox={"0 0 15 4"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M1.753 0a1.752 1.752 0 100 3.505 1.752 1.752 0 100-3.505zm5.42 0a1.753 1.753 0 10-.001 3.506 1.753 1.753 0 000-3.506zm5.238 0a1.753 1.753 0 10-.002 3.505A1.753 1.753 0 0012.41 0z"
				fill="#B8B8B8"
			/>
		</svg>
	);
};

const CrossIcon = (props) => (
	<svg
		width={12}
		height={12}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		viewBox={"0 0 12 12"}
		css={css`
			fill: #ffffff1a;
			path {
				fill: inherit;
			}
			&:hover {
				fill: #9f9f9f;
			}
		`}
		viewBox={"0 0 12 12"}
		{...props}
	>
		<path d="m7.98 6 3.712-3.712a1.05 1.05 0 0 0 0-1.485l-.495-.495a1.05 1.05 0 0 0-1.484 0L6 4.021 2.288.308a1.05 1.05 0 0 0-1.485 0L.308.803a1.05 1.05 0 0 0 0 1.484L4.02 6 .308 9.713a1.05 1.05 0 0 0 0 1.485l.495.494c.41.41 1.075.41 1.485 0L6 7.98l3.713 3.712c.41.41 1.075.41 1.485 0l.494-.495a1.05 1.05 0 0 0 0-1.484L7.98 6Z" />
	</svg>
);

const DownIcon = (props: any) => {
	return (
		<svg width={14} height={14} viewBox={"0 0 24 24"} fill={"#fff"} xmlns="http://www.w3.org/2000/svg" {...props}>
			<path fill="none" stroke="#fff" strokeWidth={2} d="m2 8.35 10.173 9.823L21.997 8" />
		</svg>
	);
};

const UpIcon = (props: any) => {
	return (
		<svg width={15} height={15} viewBox="0 -6 524 524" fill="#fff" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="m460 321-34 34-164-163L98 355l-34-34 198-196 198 196Z" />
		</svg>
	);
};

const InspectElementIcon = (props: any) => {
	return (
		<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" {...props}>
			<path
				d="m5.598 5.073.042.037 3.75 3.75a.375.375 0 0 1-.288.64l-.054-.008-2.13-.449-1.234 1.795a.375.375 0 0 1-.68-.16L5 10.626v-5.25a.375.375 0 0 1 .598-.302ZM9.75 2a1.25 1.25 0 0 1 1.247 1.168L11 3.25v4.5a1.25 1.25 0 0 1-1.012 1.227.875.875 0 0 0-.278-.503l-.068-.055-3.75-3.75a.875.875 0 0 0-1.389.63l-.003.076V9H2.25a1.25 1.25 0 0 1-1.247-1.168L1 7.75v-4.5a1.25 1.25 0 0 1 1.168-1.247L2.25 2h7.5Z"
				fill="#504E57"
			/>
		</svg>
	);
};

const MuteIcon = (props: any) => {
	return (
		<svg viewBox={"0 0 11 9"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M5.173 0c-.166 0-.316.1-.382.233L1.813 1.896C1.43 1.78 1.015 1.68.832 1.68h-.05c-.4 0-.65.366-.65.765v4.126c0 .4.25.765.65.765h.066c.183 0 .599-.1.982-.216l2.96 1.664c.067.133.234.216.4.216.233 0 .45-.2.45-.433V.416A.47.47 0 0 0 5.172 0Z"
				fill="#3F3F3F"
			/>
			<path
				d="M9.865 6a.404.404 0 0 1-.287-.123L7.491 3.79a.396.396 0 0 1 0-.573.396.396 0 0 1 .573 0l2.087 2.087a.396.396 0 0 1 0 .573.404.404 0 0 1-.286.123Z"
				fill="#FF9E68"
			/>
			<path
				d="M7.777 6a.404.404 0 0 1-.286-.123.396.396 0 0 1 0-.573l2.087-2.087a.396.396 0 0 1 .573 0 .396.396 0 0 1 0 .573L8.064 5.877A.404.404 0 0 1 7.777 6Z"
				fill="#FF9E68"
			/>
			<path d="M9.578 5.877A.404.404 0 0 0 9.864 6c.103 0 .205-.04.287-.123a.396.396 0 0 0 0-.573l-.982-.982-.573.573.982.982Z" fill="#FF9E68" />
			<path d="m10.191 3.278-2.64 2.64a.412.412 0 0 0 .512-.061L10.15 3.77c.144-.123.144-.328.041-.492Z" fill="#FF9E68" />
		</svg>
	);
};

const LoadingIconV2 = (props: any) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={{
				display: "block",
			}}
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid"
			{...props}
		>
			<circle cx={50} cy={50} r={30} stroke="#8746f0" strokeWidth={10} fill="none" />
			<circle cx={50} cy={50} r={30} stroke="#fff" strokeWidth={8} strokeLinecap="round" fill="none">
				<animateTransform
					attributeName="transform"
					type="rotate"
					repeatCount="indefinite"
					dur="1s"
					values="0 50 50;180 50 50;720 50 50"
					keyTimes="0;0.5;1"
				/>
				<animate
					attributeName="stroke-dasharray"
					repeatCount="indefinite"
					dur="1s"
					values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882"
					keyTimes="0;0.5;1"
				/>
			</circle>
		</svg>
	);
};

const SeleniumIcon = (props: any) => {
	return (
		<svg viewBox={"0 0 19 19"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M16.998 0a.121.121 0 0 1 .108.19l-4.683 6.36a.18.18 0 0 1-.27 0L10.5 4.71a.192.192 0 0 0-.297.027L9.202 6.01a.212.212 0 0 0 .027.217l2.978 3.086a.18.18 0 0 0 .27 0l5.847-6.578a.125.125 0 0 1 .216.081v15.997a.127.127 0 0 1-.135.136H.595a.127.127 0 0 1-.136-.136V.136A.128.128 0 0 1 .595 0h16.403Zm-4.602 10.8a2.954 2.954 0 0 0-3.004 3.032c0 1.868 1.353 3.059 3.112 3.059a3.727 3.727 0 0 0 2.274-.704.168.168 0 0 0 .027-.217l-.487-.73a.164.164 0 0 0-.217-.028c-.423.29-.921.45-1.434.46-.948 0-1.543-.595-1.651-1.299a.058.058 0 0 1 .054-.054h4.087a.175.175 0 0 0 .162-.162v-.163c0-1.894-1.19-3.194-2.923-3.194ZM8.363 9.772a4.333 4.333 0 0 0-2.923-.975c-1.84 0-2.978 1.083-2.978 2.382 0 2.95 4.493 2.003 4.493 3.384 0 .433-.433.866-1.353.866a3.401 3.401 0 0 1-2.355-.92.18.18 0 0 0-.27.027l-.704.974a.167.167 0 0 0 .027.217c.73.676 1.76 1.136 3.194 1.136 2.111 0 3.14-1.082 3.194-2.49 0-2.923-4.493-2.084-4.493-3.33 0-.46.406-.784 1.11-.784a3.36 3.36 0 0 1 2.138.73.171.171 0 0 0 .243-.026l.704-.948a.171.171 0 0 0-.027-.243Zm4.06 2.22a1.363 1.363 0 0 1 1.435 1.244.058.058 0 0 1-.054.054h-2.761a.058.058 0 0 1-.054-.054c.09-.72.708-1.257 1.434-1.245Z"
				fill="#2CB134"
			/>
		</svg>
	);
};

const CypressIcon = (props: any) => {
	return (
		<svg viewBox={"0 0 18 18"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g clipPath="url(#a)">
				<path
					d="M8.998 0A8.994 8.994 0 0 0 0 9a8.994 8.994 0 0 0 9 9c4.975 0 9-4.025 9-9s-4.059-9-9.002-9Zm-4.22 10.931c.294.393.687.557 1.242.557.263 0 .525-.033.753-.131.23-.098.492-.23.818-.426l.917 1.309c-.752.623-1.603.916-2.585.916-.786 0-1.44-.163-2.029-.49a3.295 3.295 0 0 1-1.31-1.44c-.293-.623-.458-1.343-.458-2.194 0-.817.165-1.57.458-2.192.28-.62.736-1.143 1.31-1.505.556-.36 1.244-.524 1.997-.524.524 0 1.014.066 1.407.229.441.17.85.414 1.21.72l-.916 1.244a3.59 3.59 0 0 0-.752-.426c-.229-.098-.524-.131-.786-.131-1.112 0-1.669.85-1.669 2.584-.032.885.131 1.506.393 1.9Zm9 2.029c-.328 1.015-.819 1.768-1.507 2.323-.687.558-1.603.852-2.748.95l-.229-1.538c.752-.098 1.309-.262 1.669-.524.13-.098.393-.393.393-.393L8.639 5.073h2.258l1.571 6.512 1.67-6.512h2.192l-2.552 7.887Z"
					fill="#fff"
					fillOpacity={0.38}
				/>
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h18v18H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};

const PuppeteerIcon = (props: any) => {
	return (
		<svg viewBox={"0 0 18 17"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M14.895 9.51H3.088v-.63c0-.422.363-.764.81-.764h10.187c.447 0 .81.342.81.765v.629ZM14.072 16.803H3.91c-.454 0-.822-.348-.822-.777V9.51h11.807v6.516c0 .429-.368.777-.822.777Z"
				fill="#fff"
			/>
			<path
				d="M14.748 9.383V8.82c0-.333-.286-.603-.638-.603H3.89c-.352 0-.638.27-.638.603v.564h11.496Zm0 6.723v-6.47H3.252v6.47c0 .333.286.603.638.603h10.22c.352 0 .638-.27.638-.603ZM3.95 7.963l.04-.41-.169.414c.023-.002.046-.003.07-.003h.06Zm10.03-.69.059.69h.07c.039 0 .076.003.113.008l-.242-.699Zm.81.983c.14.15.226.348.226.563v7.287c0 .472-.407.856-.906.856H3.89c-.5 0-.906-.384-.906-.856V8.82c0-.228.096-.436.252-.59l.903-2.21.394-4.065.444.039-.355 3.661.125.046-.17.415L4.4 7.963h9.192l-.51-5.98.445-.034.3 3.527.964 2.78ZM3.98 8.63c.111 0 .202.085.202.19 0 .106-.09.191-.202.191a.197.197 0 0 1-.203-.19c0-.106.091-.191.203-.191Zm.69 0c.113 0 .203.085.203.19 0 .106-.09.191-.202.191a.197.197 0 0 1-.202-.19c0-.106.09-.191.202-.191Zm.67 0c.112 0 .203.085.203.19 0 .106-.091.191-.203.191a.197.197 0 0 1-.202-.19c0-.106.09-.191.202-.191Z"
				fill="#191010"
			/>
			<path
				d="M4.677 12.772a.213.213 0 0 0 .053-.15.208.208 0 0 0-.053-.147c-.036-.038-.088-.056-.153-.056h-.322v.409h.322c.065 0 .117-.018.153-.056Zm-.153-.599c.138 0 .248.04.33.122a.442.442 0 0 1 .123.327c0 .138-.04.246-.12.328a.45.45 0 0 1-.333.124h-.322v.55h-.249v-1.451h.57Zm1.341.89v-.423h.268v.956h-.268v-.086a.444.444 0 0 1-.318.115.398.398 0 0 1-.295-.113.389.389 0 0 1-.111-.29v-.582h.268v.529c0 .067.018.122.056.162a.19.19 0 0 0 .149.062c.168 0 .251-.11.251-.33Zm1.313.263a.277.277 0 0 0 .079-.207.281.281 0 0 0-.08-.209.286.286 0 0 0-.204-.079.29.29 0 0 0-.201.08.267.267 0 0 0-.087.208.26.26 0 0 0 .087.205.29.29 0 0 0 .2.08c.084 0 .15-.027.206-.078Zm-.159-.715a.49.49 0 0 1 .35.144c.099.097.147.218.147.364a.481.481 0 0 1-.148.362.486.486 0 0 1-.349.144.54.54 0 0 1-.334-.104v.531h-.268V12.64h.268v.076a.52.52 0 0 1 .334-.105Zm1.46.715a.277.277 0 0 0 .08-.207.281.281 0 0 0-.08-.209.285.285 0 0 0-.204-.079.29.29 0 0 0-.2.08.267.267 0 0 0-.088.208.26.26 0 0 0 .087.205.29.29 0 0 0 .201.08c.083 0 .15-.027.205-.078Zm-.157-.715a.49.49 0 0 1 .349.144c.099.097.148.218.148.364a.481.481 0 0 1-.148.362.486.486 0 0 1-.35.144.54.54 0 0 1-.334-.104v.531h-.268V12.64h.268v.076a.52.52 0 0 1 .335-.105Zm.892.397h.489a.224.224 0 0 0-.09-.132.279.279 0 0 0-.304.002.212.212 0 0 0-.095.13Zm.25-.397c.138 0 .257.046.357.136.1.092.15.209.156.353v.086h-.77c.013.067.044.12.09.16.047.041.1.062.163.062.115 0 .198-.042.251-.126l.24.048a.461.461 0 0 1-.193.22.58.58 0 0 1-.298.075.519.519 0 0 1-.37-.142.481.481 0 0 1-.15-.364c0-.148.051-.27.152-.366a.52.52 0 0 1 .372-.142Zm1.251.778a.38.38 0 0 0 .169-.046l.077.21a.576.576 0 0 1-.264.072.424.424 0 0 1-.292-.096c-.071-.063-.106-.157-.106-.286v-.396h-.217v-.207h.217v-.29h.268v.29h.33v.207h-.33v.377c0 .11.049.165.148.165Zm.562-.381h.49a.225.225 0 0 0-.09-.132.279.279 0 0 0-.304.002.212.212 0 0 0-.096.13Zm.25-.397c.138 0 .257.046.357.136.1.092.15.209.156.353v.086h-.77c.013.067.044.12.09.16.047.041.1.062.163.062.115 0 .199-.042.251-.126l.24.048a.46.46 0 0 1-.193.22.58.58 0 0 1-.298.075.519.519 0 0 1-.37-.142.481.481 0 0 1-.15-.364c0-.148.051-.27.152-.366a.52.52 0 0 1 .372-.142Zm.953.397h.489a.225.225 0 0 0-.09-.132.279.279 0 0 0-.304.002.212.212 0 0 0-.095.13Zm.25-.397c.137 0 .257.046.357.136.099.092.15.209.156.353v.086h-.771c.014.067.045.12.091.16.047.041.1.062.162.062.116 0 .2-.042.252-.126l.24.048a.461.461 0 0 1-.193.22.58.58 0 0 1-.298.075.519.519 0 0 1-.37-.142.481.481 0 0 1-.15-.364c0-.148.05-.27.152-.366a.52.52 0 0 1 .372-.142Zm1.347.015a.23.23 0 0 1 .07.008l-.014.243h-.058c-.242 0-.362.136-.362.41v.309h-.267v-.956h.267v.174a.43.43 0 0 1 .364-.188Z"
				fill="#191010"
			/>
			<path
				d="m12.906 5.887 1.445-.658v-.66l-3.338-1.505 3.338-1.623V.806L12.956.194 9.003 2.053 4.985.194 3.689.853v.564l3.139 1.624-3.139 1.505v.683l1.346.658L9.02 3.958l3.886 1.93Z"
				fill="#00D8A2"
			/>
			<path
				d="M13.085 5.619v-.284l1.088-.532v.318l-1.088.498Zm-9.31-.824 1.051.57v.227l-1.05-.502v-.295Zm5.383-1.198 3.615 1.687v.34l-3.615-1.75v-.277Zm-4.02 1.736 3.708-1.736v.277L5.139 5.645v-.312Zm2.625-2.836L4.013.787l.97-.467 4.019 1.967 3.95-1.966 1.007.486-3.659 1.74a.183.183 0 0 0 0 .335l3.621 1.712-.938.459-3.981-1.927L4.95 5.092l-.925-.502 3.74-1.756a.184.184 0 0 0-.002-.337ZM3.822 1.366v-.312l3.499 1.65-.354.133-3.145-1.471Zm7.174 1.489c-.004-.003-.335-.15-.335-.15l3.512-1.67v.313l-3.177 1.507Zm.352.163 3.086-1.463a.087.087 0 0 0 .051-.078V.784a.087.087 0 0 0-.05-.078L12.995.01a.097.097 0 0 0-.084 0L9.043 1.863a.097.097 0 0 1-.083 0L5.024.01a.097.097 0 0 0-.083 0L3.514.695a.087.087 0 0 0-.051.077v.704c0 .033.02.064.051.079L6.614 3 3.529 4.448a.087.087 0 0 0-.052.076l-.013.692c0 .034.02.065.05.08l1.483.708a.098.098 0 0 0 .083 0l3.88-1.84a.097.097 0 0 1 .084 0l3.831 1.84a.098.098 0 0 0 .082.001l1.476-.675a.087.087 0 0 0 .052-.078v-.723a.087.087 0 0 0-.051-.079l-3.086-1.432Z"
				fill="#191010"
			/>
		</svg>
	);
};

const LinkIcon = (props: any) => {
	return (
		<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g clipPath="url(#a)" fill="#A975FF">
				<path d="M2.992 2.992a.532.532 0 0 0 0-.753L.908.155a.532.532 0 0 0-.752.753L2.24 2.992a.531.531 0 0 0 .752 0ZM8.297 5.32c-.41 0-.65.392-.65.915 0 .529.247.9.656.9.411 0 .648-.391.648-.915 0-.484-.233-.9-.654-.9Z" />
				<path d="M11.805 5.91 6.617.723c-.26-.26-.77-.439-1.135-.398l-3.54.393 1.285 1.286a.997.997 0 0 1 .445.253 1 1 0 1 1-1.415 1.415.988.988 0 0 1-.254-.444L.717 1.942.324 5.483c-.04.365.139.876.398 1.135l5.188 5.188a.67.67 0 0 0 .943 0l4.952-4.953a.669.669 0 0 0 0-.943ZM3.487 7.615c-.307 0-.611-.08-.763-.164l.124-.504c.164.084.416.168.676.168.28 0 .428-.116.428-.292 0-.168-.128-.263-.452-.38-.448-.155-.74-.403-.74-.796 0-.46.384-.811 1.02-.811.304 0 .528.064.688.136l-.136.492a1.277 1.277 0 0 0-.564-.129c-.264 0-.392.12-.392.26 0 .173.152.248.5.38.476.176.7.424.7.804 0 .453-.349.836-1.089.836Zm3.221-.04h-1.72V4.88h1.664v.5H5.601v.56h.991v.496h-.991v.64h1.107v.5Zm1.56.044c-.798 0-1.266-.604-1.266-1.371 0-.808.516-1.412 1.312-1.412.827 0 1.279.62 1.279 1.363 0 .884-.535 1.42-1.324 1.42Z" />
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h12v12H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};

const CrusherHammerIcon = (props: any) => {
	return (
		<svg viewBox={"0 0 18 18"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M4.576 5.4c-.392 0-.654.216-.654.54v4.32c0 .324.262.54.654.54h1.31V5.4h-1.31ZM5.89 5.4v5.4l1.964-.54V5.94L5.891 5.4ZM11.785 12.6H7.857V18h3.928v-5.4ZM15.704 10.824C15.605 7.656 13.681 5.4 11.312 5.4H9.239l-1.382.48v3.84l.84.816a.43.43 0 0 1 .147.336V12.6h2.961v-1.824c0-.048 0-.144.05-.192l.296-.576c.099-.192.247-.288.444-.288 1.086.048 2.122.432 2.912 1.2.049.144.246.048.197-.096Z"
				fill="#292F35"
			/>
			<path
				d="M0 3.661C0 1.639 1.62 0 3.618 0h10.437c1.998 0 3.618 1.64 3.618 3.661v10.678c0 2.022-1.62 3.66-3.618 3.66H3.618C1.62 18 0 16.362 0 14.34V3.66Z"
				fill="#292F35"
			/>
			<path d="M2.614 5.4c-.393 0-.655.216-.655.54v4.32c0 .324.262.54.655.54h1.309V5.4h-1.31Z" fill="#0C0D0D" />
			<path
				d="M3.918 5.4v5.4l1.8-.54V5.94l-1.8-.54ZM10.836 12.6H7.125V18h3.711v-5.4ZM15.709 10.824C15.585 7.656 13.177 5.4 10.213 5.4H7.62l-1.73.48v3.84l1.05.816c.124.096.186.192.186.336V12.6h3.705v-1.824c0-.048 0-.144.061-.192l.37-.576c.124-.192.31-.288.557-.288 1.358.048 2.655.432 3.643 1.2.132.123.247.055.247-.096Z"
				fill="#0C0D0D"
			/>
		</svg>
	);
};

const DownIcon = (props: any) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 330 330"
			style={{
				enableBackground: "new 0 0 330 330",
			}}
			xmlSpace="preserve"
			{...props}
		>
			<path d="M325.607 79.393c-5.857-5.857-15.355-5.858-21.213.001l-139.39 139.393L25.607 79.393c-5.857-5.857-15.355-5.858-21.213.001-5.858 5.858-5.858 15.355 0 21.213l150.004 150a14.999 14.999 0 0 0 21.212-.001l149.996-150c5.859-5.857 5.859-15.355.001-21.213z" />
		</svg>
	);
};

const StopIcon = (props: any) => {
	return (
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0ZM3 12a9 9 0 0 1 9-9c1.973 0 3.797.642 5.278 1.72L4.72 17.278A8.942 8.942 0 0 1 3 12Zm9 9a8.942 8.942 0 0 1-5.278-1.72L19.28 6.722A8.953 8.953 0 0 1 21 12a9 9 0 0 1-9 9Z"
				fill="#FA618F"
			/>
		</svg>
	);
};

const MiniCrossIcon = (props: any) => {
	return (
		<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="m5.94 5 2.867-2.86a.67.67 0 1 0-.947-.947L5 4.06 2.14 1.193a.67.67 0 1 0-.947.947L4.06 5 1.193 7.86a.667.667 0 0 0 .217 1.093.667.667 0 0 0 .73-.146L5 5.94l2.86 2.867a.667.667 0 0 0 1.093-.217.667.667 0 0 0-.146-.73L5.94 5Z"
				fill="#fff"
			/>
		</svg>
	);
};

const ConsoleIcon = (props: any) => {
	return (
		<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M11.52 0H.48A.48.48 0 0 0 0 .48v11.04c0 .266.214.48.48.48h11.04a.48.48 0 0 0 .48-.48V.48a.48.48 0 0 0-.48-.48ZM6.017 6.091l-2.88 2.416a.12.12 0 0 1-.197-.092v-.94c0-.035.017-.07.043-.092L4.63 6 2.983 4.617a.115.115 0 0 1-.043-.091v-.941a.12.12 0 0 1 .196-.091l2.88 2.413a.119.119 0 0 1 0 .184ZM9.06 8.415c0 .066-.051.12-.113.12H6.173c-.062 0-.113-.054-.113-.12v-.72c0-.066.051-.12.113-.12h2.774c.062 0 .113.054.113.12v.72Z"
				fill="#485264"
			/>
		</svg>
	);
};

const UpMaximiseIcon = (props: any) => {
	return (
		<svg viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5 4c.552 0 1 .225 1 .502v6.996c0 .277-.448.502-1 .502s-1-.225-1-.502V4.502C4 4.225 4.448 4 5 4Z"
				fill="#797979"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.596 3.146a.63.63 0 0 1 .808 0l3.429 3a.457.457 0 0 1 0 .708.63.63 0 0 1-.808 0L5 4.207 1.975 6.854a.63.63 0 0 1-.808 0 .457.457 0 0 1 0-.708l3.429-3Z"
				fill="#797979"
				stroke="#797979"
				strokeWidth={0.6}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1 .65c0-.359.256-.65.571-.65H8.43C8.744 0 9 .291 9 .65c0 .359-.256.65-.571.65H1.57C1.256 1.3 1 1.009 1 .65Z"
				fill="#797979"
			/>
		</svg>
	);
};

const CrusherIcon = (props) => {
	return (
		<img
			src="data:image/png;base64,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"
			{...props}
		/>
	);
};

const CrusherHammerColorIcon = (props) => (
	<svg
		viewBox={"0 0 23 23"}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		css={css`
			zoom: 0.9;
		`}
		{...props}
	>
		<path
			d="M5.183 6.161c-.417 0-.695.28-.695.699v5.59c0 .42.278.699.695.699H6.57V6.16H5.183ZM6.57 6.16v6.988l2.747-.699V6.86L6.57 6.161ZM15.523 17.341h-4.166V23h4.166V17.34ZM21.007 14.057c-.139-4.612-2.846-7.896-6.179-7.896h-2.915l-1.944.698v5.59l1.18 1.188c.139.14.208.28.208.49v2.515h4.166v-2.655c0-.07 0-.21.07-.28l.416-.838c.139-.28.347-.42.625-.42 1.527.07 2.985.63 4.096 1.747.069.21.347.07.277-.14Z"
			fill="#fff"
		/>
		<rect width={22.851} height={23} rx={5} fill="url(#a)" />
		<path d="M3.823 6.161c-.416 0-.694.28-.694.699v5.59c0 .42.278.699.694.699h1.389V6.16H3.823Z" fill="#fff" />
		<path
			d="M5.21 6.16v6.988l2.748-.699V6.86L5.21 6.161ZM14.164 16.84H9.93V23h4.234v-6.16ZM19.65 14.057C19.51 9.445 16.804 6.16 13.47 6.16h-2.916l-1.944.698v5.59l1.18 1.188c.14.14.209.28.209.49v2.515h4.165v-2.655c0-.07 0-.21.07-.28l.416-.838c.14-.28.347-.42.625-.42 1.527.07 2.985.63 4.096 1.747.148.179.278.08.278-.14Z"
			fill="#fff"
		/>
		<defs>
			<linearGradient id="a" x1={11.426} y1={0} x2={11.426} y2={23} gradientUnits="userSpaceOnUse">
				<stop stopColor="#9261FF" />
				<stop offset={1} stopColor="#A56DFF" />
			</linearGradient>
		</defs>
	</svg>
);

const GithubIcon = (props) => (
	<svg viewBox={"0 0 18 17"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M8.522 0a8.523 8.523 0 0 0-2.694 16.608c.426.079.563-.185.563-.41v-1.586c-2.37.515-2.864-1.006-2.864-1.006-.387-.985-.946-1.247-.946-1.247-.774-.529.059-.517.059-.517.855.06 1.306.878 1.306.878.76 1.303 1.993.926 2.48.708.075-.55.296-.927.54-1.139-1.892-.216-3.882-.947-3.882-4.212 0-.93.333-1.69.878-2.287-.088-.215-.38-1.082.083-2.256 0 0 .716-.228 2.344.874a8.173 8.173 0 0 1 2.133-.287 8.197 8.197 0 0 1 2.134.287c1.627-1.102 2.342-.874 2.342-.874.463 1.174.172 2.041.084 2.256a3.29 3.29 0 0 1 .877 2.287c0 3.273-1.994 3.994-3.891 4.205.305.264.584.783.584 1.578v2.338c0 .227.137.493.569.41A8.524 8.524 0 0 0 8.521 0Z"
			fill="#fff"
		/>
	</svg>
);

const PlayIconV2 = (props) => (
	<svg viewBox={"0 0 16 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<rect width={16} height={16} rx={5} fill="#9462FF" />
		<path
			d="M5.693 11a.742.742 0 0 1-.328-.076.63.63 0 0 1-.365-.56V5.636a.63.63 0 0 1 .365-.56.737.737 0 0 1 .67.008l4.649 2.418a.63.63 0 0 1 .232.214.528.528 0 0 1 0 .568.63.63 0 0 1-.232.213l-4.649 2.42a.743.743 0 0 1-.342.083Z"
			fill="#000"
			fillOpacity={0.6}
		/>
	</svg>
);

const CreateIcon = (props) => (
	<svg viewBox={"0 0 28 28"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M21.533.753a2.571 2.571 0 0 0-3.637 0l-4.753 4.753v-.64a2.572 2.572 0 0 0-2.572-2.571h-8A2.571 2.571 0 0 0 0 4.866v20.572a2 2 0 0 0 2 2h20.571a2.572 2.572 0 0 0 2.572-2.572v-8.005a2.572 2.572 0 0 0-2.572-2.57h-.635l4.749-4.75a2.571 2.571 0 0 0 0-3.636L21.533.753Zm-8.39 9.187 4.35 4.35h-4.35V9.94Zm-1.714 4.35H1.714V4.866c0-.473.384-.857.857-.857h8c.474 0 .858.384.858.857v9.424Zm-9.715 1.714h9.715v9.72H2.57a.857.857 0 0 1-.857-.858v-8.862Zm11.429 9.72v-9.72h9.428c.474 0 .858.384.858.857v8.005a.857.857 0 0 1-.858.857h-9.428Z"
			fill="#D6FF80"
		/>
	</svg>
);

const ConnectivityWarningIcon = (props) => (
	<svg viewBox={"0 0 43 35"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M15.628 16.462c-2.933.896-5.7 2.48-8.023 4.794l4.055 4.055a13.59 13.59 0 0 1 4.142-2.828l-.174-6.02ZM15.296 5.447A29.917 29.917 0 0 0 0 13.652l4.055 4.054a24.243 24.243 0 0 1 11.415-6.412l-.174-5.847ZM27.305 5.447l-.174 5.856a24.243 24.243 0 0 1 11.416 6.412l4.055-4.054a29.835 29.835 0 0 0-15.297-8.214ZM26.79 22.483a13.607 13.607 0 0 1 4.15 2.837l4.055-4.055a19.277 19.277 0 0 0-8.023-4.803l-.183 6.021ZM21.301 34.526a3.48 3.48 0 1 0 0-6.961 3.48 3.48 0 0 0 0 6.96ZM22.676 24.71h-2.758a1.33 1.33 0 0 1-1.332-1.296l-.66-22.04A1.336 1.336 0 0 1 19.255 0h4.09a1.33 1.33 0 0 1 1.331 1.375l-.67 22.04a1.33 1.33 0 0 1-1.331 1.296Z"
			fill="#4E4E4E"
		/>
	</svg>
);

function PlayV2Icon(props) {
	return (
		<svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<rect width={18} height={18} rx={9} fill="#A966FF" />
			<rect x={0.125} y={0.125} width={17.75} height={17.75} rx={8.875} stroke="#000" strokeOpacity={0.53} strokeWidth={0.25} />
			<path
				d="M7.963 12.123a.58.58 0 01-.291-.08.67.67 0 01-.324-.582V6.539a.67.67 0 01.324-.582.576.576 0 01.595.007l4.126 2.518a.607.607 0 01.281.518.62.62 0 01-.28.517l-4.128 2.519a.584.584 0 01-.303.087z"
				fill="#fff"
			/>
		</svg>
	);
}

export {
	CrusherIcon,
	GithubIcon,
	CrusherHammerColorIcon,
	CrossIcon,
	BulbIcon,
	DeleteIcon,
	SettingsIcon,
	NavigateBackIcon,
	NavigateRefreshIcon,
	SearchIcon,
	MouseIcon,
	WarningIcon,
	BrowserIcon,
	CloseModalIcon,
	LoadingIcon,
	MoreIcon,
	DownIcon,
	UpIcon,
	InspectElementIcon,
	MuteIcon,
	LoadingIconV2,
	SeleniumIcon,
	CypressIcon,
	PuppeteerIcon,
	LinkIcon,
	CrusherHammerIcon,
	DownIcon,
	StopIcon,
	MiniCrossIcon,
	ConsoleIcon,
	UpMaximiseIcon,
	PlayIconV2,
	CreateIcon,
	ConnectivityWarningIcon,
	PlayV2Icon,
};
