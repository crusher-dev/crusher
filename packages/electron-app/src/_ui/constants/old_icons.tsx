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

const EditIcon = (props) => (
	<svg viewBox={"0 0 13 13"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="m12.833 6.87-2.157-2.157a.537.537 0 0 0-.775 0l-.645.643V.886a.883.883 0 0 0-.883-.884H.883A.885.885 0 0 0 0 .885V8.34c0 .488.395.884.883.884h4.484l-.109.106a.842.842 0 0 0-.138.276l-.551 2.711c-.104.533.275.748.636.663l2.709-.554c.111 0 .194-.056.276-.138l4.643-4.646a.53.53 0 0 0 0-.772ZM1.06 8.165V1.063h7.137v5.346L6.434 8.162H1.06v.003Zm6.466 3.216-1.74.36.357-1.743 4.118-4.12L11.67 7.26l-4.144 4.12Z"
			fill="#7A7A7A"
		/>
	</svg>
);
const PlayIcon = (props) => (
	<svg viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M1.386 14c-.23 0-.456-.062-.656-.178-.45-.258-.73-.76-.73-1.306V1.484C0 .937.28.436.73.178A1.303 1.303 0 0 1 2.07.195l9.296 5.644c.194.123.353.294.464.497a1.385 1.385 0 0 1-.464 1.824L2.07 13.805a1.317 1.317 0 0 1-.684.195Z"
			fill="#B061FF"
		/>
	</svg>
);

const LogoV2 = (props) => (
	<svg viewBox={"0 0 23 24"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M5.183 6.661c-.417 0-.695.28-.695.699v5.59c0 .42.278.699.695.699H6.57V6.66H5.183ZM6.57 6.66v6.988l2.747-.699V7.36L6.57 6.66ZM15.521 17.84h-4.166v5.66h4.166v-5.66ZM21.007 14.556c-.139-4.611-2.846-7.896-6.179-7.896h-2.915l-1.944.7v5.59l1.18 1.187c.139.14.208.28.208.49v2.515h4.166v-2.656c0-.07 0-.21.07-.28l.416-.838c.139-.28.347-.419.625-.419 1.527.07 2.985.629 4.096 1.747.069.21.347.07.277-.14Z"
			fill="#fff"
		/>
		<rect y={0.5} width={22.851} height={23} rx={6} fill="#292929" />
		<path d="M3.823 6.661c-.416 0-.694.28-.694.699v5.59c0 .42.278.699.694.699h1.389V6.66H3.823Z" fill="#fff" />
		<path
			d="M5.21 6.66v6.988l2.748-.699V7.36L5.21 6.66ZM14.164 17.339H9.93v6.16h4.234v-6.16ZM19.648 14.556c-.139-4.611-2.846-7.896-6.179-7.896h-2.916l-1.944.7v5.59l1.18 1.187c.14.14.209.28.209.49v2.515h4.165v-2.656c0-.07 0-.21.07-.28l.416-.838c.14-.28.348-.419.625-.419 1.528.07 2.985.629 4.096 1.747.148.178.278.08.278-.14Z"
			fill="#fff"
		/>
	</svg>
);

const DroppdownIconV2 = (props) => (
	<svg viewBox={"0 0 9 6"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M4.851 5.319a.554.554 0 0 1-.396-.167l-3.44-3.498a.577.577 0 0 1 0-.806.554.554 0 0 1 .793 0L4.85 3.943 7.895.848a.554.554 0 0 1 .792 0 .576.576 0 0 1 0 .806l-3.44 3.498a.554.554 0 0 1-.396.167Z"
			fill="#BDBDBD"
			fillOpacity={0.7}
		/>
	</svg>
);

const RedDotIcon = (props) => (
	<svg viewBox={"0 0 6 6"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<rect x={0.851} y={0.5} width={5} height={5} rx={2.5} fill="#FF506F" />
	</svg>
);

const PlayIconV3 = (props) => (
	<svg viewBox={"0 0 6 8"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M.667 7.726V.263c0-.21.289-.358.489-.19l4.71 3.647c.178.127.178.4 0 .527l-4.71 3.69c-.2.147-.49.02-.49-.211Z" fill="#708AEC" />
	</svg>
);

const GreenCheckboxIcon = (props) => (
	<svg viewBox={"0 0 14 14"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M10.078 0C12.427 0 14 1.666 14 4.144v5.72C14 12.334 12.427 14 10.078 14H4.07C1.72 14 .14 12.334.14 9.864v-5.72C.14 1.666 1.72 0 4.07 0h6.008Zm-.111 4.9a.606.606 0 0 0-.86 0L6.246 7.791 5.033 6.566a.606.606 0 0 0-.86 0 .621.621 0 0 0 0 .868l1.65 1.659a.59.59 0 0 0 .422.175c.16 0 .312-.056.43-.175l3.292-3.325a.621.621 0 0 0 0-.868Z"
			fill="#9EF25B"
			fillOpacity={0.91}
		/>
	</svg>
);

const FailedCheckboxIcon = (props) => (
	<svg viewBox={"0 0 14 14"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.395 4.405a.7.7 0 0 0-.99.99L6.01 7 4.405 8.605a.7.7 0 0 0 .99.99L7 7.99l1.605 1.605a.7.7 0 0 0 .99-.99L7.99 7l1.605-1.605a.7.7 0 0 0-.99-.99L7 6.01 5.395 4.405ZM3.675.271C4.585.07 5.687 0 7 0c1.313 0 2.416.07 3.325.271.917.204 1.68.552 2.266 1.139.586.586.934 1.348 1.138 2.265C13.93 4.585 14 5.687 14 7c0 1.313-.07 2.416-.271 3.325-.204.917-.552 1.68-1.138 2.266-.587.586-1.349.934-2.266 1.138C9.415 13.93 8.313 14 7 14c-1.313 0-2.416-.07-3.325-.271-.917-.204-1.68-.552-2.265-1.138-.587-.587-.935-1.349-1.139-2.266C.07 9.415 0 8.313 0 7c0-1.313.07-2.416.271-3.325.204-.917.552-1.68 1.139-2.265C1.996.823 2.758.475 3.675.27Z"
			fill="#E0307A"
		/>
	</svg>
);

const PointerArrowIcon = (props) => (
	<svg viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M0 8.692V.296C0 .059.325-.107.55.082l5.3 4.103c.2.143.2.451 0 .593l-5.3 4.15c-.225.167-.55.024-.55-.236Z" fill="#202020" />
	</svg>
);

const AddIconV3 = (props) => (
	<svg viewBox={"0 0 12 12"} fill="none" className={"add-icon"} xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M10.825 4.608h-3.7V1.175a1.175 1.175 0 1 0-2.349 0v3.433H1.175a1.175 1.175 0 0 0 0 2.35h3.601v3.867a1.174 1.174 0 1 0 2.35 0V6.957h3.7a1.175 1.175 0 1 0 0-2.349Z"
			fill="#fff"
		/>
	</svg>
);

export function GarbageIcon(props) {
	return (
		<svg width={11} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.714 1.702v.13c.743.067 1.482.165 2.216.292a.428.428 0 11-.146.845l-.12-.02-.574 7.468A1.714 1.714 0 017.381 12H2.905a1.714 1.714 0 01-1.709-1.583L.621 2.95l-.12.02a.429.429 0 01-.146-.845 27.751 27.751 0 012.216-.293v-.13c0-.893.694-1.656 1.61-1.686.641-.02 1.283-.02 1.925 0 .916.03 1.608.793 1.608 1.687zM4.208.872c.623-.02 1.247-.02 1.87 0 .43.014.78.376.78.83v.064a28.28 28.28 0 00-3.43 0v-.064c0-.454.349-.816.78-.83zm-.203 3.397a.429.429 0 00-.857.033l.198 5.143a.429.429 0 10.857-.033l-.198-5.143zm3.132.033a.429.429 0 10-.856-.033l-.199 5.143a.429.429 0 10.857.033l.198-5.143z"
				fill="#BDBDBD"
			/>
		</svg>
	);
}

export {
	CrossIcon,
	DeleteIcon,
	SettingsIcon,
	WarningIcon,
	LoadingIcon,
	MoreIcon,
	DownIcon,
	UpIcon,
	InspectElementIcon,
	LoadingIconV2,
	StopIcon,
	MiniCrossIcon,
	ConsoleIcon,
	UpMaximiseIcon,
	CreateIcon,
	ConnectivityWarningIcon,
	PlayV2Icon,
	EditIcon,
	PlayIcon,
	LogoV2,
	DroppdownIconV2,
	RedDotIcon,
	ActionHeadingIcon,
	PlayIconV3,
	GreenCheckboxIcon,
	FailedCheckboxIcon,
	PointerArrowIcon,
	AddIconV3,
};
