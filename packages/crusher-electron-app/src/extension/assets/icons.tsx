import React from "react";

interface NavigateIconProps {
	onClick: () => any;
	disabled: boolean;
}

const NavigateBackIcon = (props: NavigateIconProps) => {
	const { disabled, onClick } = props;

	return (
		<svg fill={!disabled ? "#fff" : "#5F6368"} viewBox="0 0 24 24" width={24} height={24} onClick={onClick}>
			<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
		</svg>
	);
};

const NavigateForwardIcon = (props: NavigateIconProps) => {
	const { disabled, onClick } = props;

	return (
		<svg fill={!disabled ? "#fff" : "#5F6368"} style={{ transform: "rotate(180deg)" }} viewBox="0 0 24 24" width={24} height={24} onClick={onClick}>
			<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
		</svg>
	);
};

const NavigateRefreshIcon = (props: NavigateIconProps) => {
	const { disabled, onClick } = props;

	return (
		<svg fill={!disabled ? "#fff" : "#5F6368"} viewBox="0 0 24 24" width="24" height="24" onClick={onClick}>
			<g>
				<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
			</g>
		</svg>
	);
};

const RecordLabelIcon = () => {
	return (
		<svg width="21" height="21" viewBox="0 0 21 21" fill="none">
			<path d="M10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21Z" fill="#5B76F7" />
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
			<path d="M16.07 27.938h.055c-.015 0-.039 0-.056.008v-.009zM20.914 27.938v.008c-.015-.009-.024-.009-.039-.009h.04z" fill="#000" />
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

const SaveIcon = () => {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
			<path
				d="M12.3651 1.63472L11.3653 0.634865C10.959 0.22802 10.4082 0 9.83341 0H1.48962C0.666801 0 0 0.666801 0 1.48962V11.5104C0 12.3332 0.666801 13 1.48962 13H11.5104C12.3332 13 13 12.3332 13 11.5104V3.16659C13 2.59183 12.772 2.04097 12.3651 1.63472ZM2.16663 3.38538V2.03125C2.16663 1.807 2.34863 1.625 2.57288 1.625H8.26038C8.48463 1.625 8.66663 1.807 8.66663 2.03125V3.38538C8.66663 3.60963 8.48463 3.79163 8.26038 3.79163H2.57288C2.34863 3.79163 2.16663 3.60963 2.16663 3.38538ZM6.5 10.8334C5.154 10.8334 4.0625 9.74187 4.0625 8.39587C4.0625 7.04977 5.154 5.95837 6.5 5.95837C7.846 5.95837 8.9375 7.04977 8.9375 8.39587C8.9375 9.74187 7.846 10.8334 6.5 10.8334Z"
				fill="white"
			/>
		</svg>
	);
};

const SwitchOnIcon = () => {
	return (
		<svg width="30" height="20" viewBox="0 0 31 19" fill="none">
			<path
				d="M21.6439 0.143799C19.2924 0.143799 11.7076 0.143799 9.35614 0.143799C4.18887 0.143799 0 4.33267 0 9.49994C0 14.6672 4.18887 18.8561 9.35614 18.8561H21.6439C26.8111 18.8561 31 14.6672 31 9.49994C31 4.33267 26.8111 0.143799 21.6439 0.143799Z"
				fill="#ACD5DF"
			/>
			<path
				d="M9.356 2.01514C5.22882 2.01514 1.87109 5.37287 1.87109 9.50005C1.87109 13.6272 5.22882 16.985 9.356 16.985H15.1543V2.01514H9.356Z"
				fill="#725FEE"
			/>
			<path
				d="M21.6442 2.01514H15.1548C13.3733 4.00294 12.2881 6.62696 12.2881 9.50005C12.2881 12.3731 13.3733 14.9972 15.1548 16.985H21.6442V2.01514Z"
				fill="#6241EA"
			/>
			<path d="M21.6436 2.01514V16.985C25.7773 16.985 29.1285 13.6338 29.1285 9.50005C29.1285 5.36626 25.7773 2.01514 21.6436 2.01514Z" fill="#1C1E20" />
			<path
				d="M27.2578 9.50005C27.2578 5.36626 24.7445 2.01514 21.6441 2.01514C17.5103 2.01514 14.1592 5.36626 14.1592 9.50005C14.1592 13.6338 17.5103 16.985 21.6441 16.985C24.7445 16.985 27.2578 13.6338 27.2578 9.50005Z"
				fill="#101112"
			/>
		</svg>
	);
};

const SwitchOffIcon = () => {
	return (
		<svg width="30" height="20" viewBox="0 0 31 19" fill="none">
			<path
				d="M9.35614 18.8562C11.7076 18.8562 19.2924 18.8562 21.6439 18.8562C26.8111 18.8562 31 14.6673 31 9.50006C31 4.3328 26.8111 0.143929 21.6439 0.143929L9.35614 0.143929C4.18887 0.143929 3.8147e-06 4.3328 3.8147e-06 9.50006C3.8147e-06 14.6673 4.18887 18.8562 9.35614 18.8562Z"
				fill="#DFACDD"
			/>
			<path
				d="M21.644 16.9849C25.7712 16.9849 29.1289 13.6271 29.1289 9.49995C29.1289 5.37277 25.7712 2.01504 21.644 2.01504H15.8457L15.8457 16.9849H21.644Z"
				fill="#EE5F81"
			/>
			<path
				d="M9.35578 16.9849H15.8452C17.6267 14.9971 18.7119 12.373 18.7119 9.49995C18.7119 6.62687 17.6267 4.00285 15.8452 2.01504L9.35578 2.01504L9.35578 16.9849Z"
				fill="#E9426A"
			/>
			<path
				d="M9.35645 16.9849L9.35645 2.01504C5.22266 2.01504 1.87154 5.36616 1.87154 9.49995C1.87154 13.6337 5.22266 16.9849 9.35645 16.9849Z"
				fill="#1C1E20"
			/>
			<path
				d="M3.74223 9.49995C3.74223 13.6337 6.25554 16.9849 9.35591 16.9849C13.4897 16.9849 16.8408 13.6337 16.8408 9.49995C16.8408 5.36616 13.4897 2.01504 9.35591 2.01504C6.25554 2.01504 3.74223 5.36616 3.74223 9.49995Z"
				fill="#101112"
			/>
		</svg>
	);
};

const SettingsIcon = (props: any) => {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
			<path d="M13.2317 5.47983L12.1351 5.34042C12.0447 5.06217 11.9332 4.79383 11.8032 4.53892L12.4804 3.66683C12.7546 3.31392 12.7225 2.81575 12.4093 2.51242L11.4905 1.59367C11.1842 1.2775 10.6861 1.246 10.3326 1.51958L9.46167 2.19683C9.20675 2.06675 8.93842 1.95533 8.65958 1.86492L8.52017 0.77C8.46767 0.33075 8.09492 0 7.65333 0H6.34667C5.90508 0 5.53233 0.33075 5.47983 0.76825L5.34042 1.86492C5.06158 1.95533 4.79325 2.06617 4.53833 2.19683L3.66683 1.51958C3.3145 1.246 2.81633 1.2775 2.51242 1.59075L1.59367 2.50892C1.2775 2.81575 1.24542 3.31392 1.51958 3.66742L2.19683 4.53892C2.06617 4.79383 1.95533 5.06217 1.86492 5.34042L0.77 5.47983C0.33075 5.53233 0 5.90508 0 6.34667V7.65333C0 8.09492 0.33075 8.46767 0.76825 8.52017L1.86492 8.65958C1.95533 8.93783 2.06675 9.20617 2.19683 9.46108L1.51958 10.3332C1.24542 10.6861 1.2775 11.1842 1.59075 11.4876L2.5095 12.4063C2.81633 12.7219 3.31392 12.7534 3.66742 12.4798L4.53892 11.8026C4.79383 11.9332 5.06217 12.0447 5.34042 12.1345L5.47983 13.2288C5.53233 13.6692 5.90508 14 6.34667 14H7.65333C8.09492 14 8.46767 13.6692 8.52017 13.2317L8.65958 12.1351C8.93783 12.0447 9.20617 11.9332 9.46108 11.8032L10.3332 12.4804C10.6861 12.7546 11.1842 12.7225 11.4876 12.4093L12.4063 11.4905C12.7225 11.1837 12.7546 10.6861 12.4804 10.3326L11.8032 9.46108C11.9338 9.20617 12.0452 8.93783 12.1351 8.65958L13.2294 8.52017C13.6687 8.46767 13.9994 8.09492 13.9994 7.65333V6.34667C14 5.90508 13.6692 5.53233 13.2317 5.47983ZM7 9.91667C5.39175 9.91667 4.08333 8.60825 4.08333 7C4.08333 5.39175 5.39175 4.08333 7 4.08333C8.60825 4.08333 9.91667 5.39175 9.91667 7C9.91667 8.60825 8.60825 9.91667 7 9.91667Z" fill="#969696" />
		</svg>
	);
};

const SearchIcon = (props: any) => {
	return (
		<svg width="12" height="12" {...props} viewBox="0 0 13 13" fill="none">
			<path
				d="M12.5847 11.8409L9.4907 8.623C10.2862 7.67732 10.7221 6.48745 10.7221 5.24874C10.7221 2.35463 8.36747 0 5.47335 0C2.57924 0 0.224609 2.35463 0.224609 5.24874C0.224609 8.14286 2.57924 10.4975 5.47335 10.4975C6.55984 10.4975 7.59522 10.1698 8.48043 9.5477L11.598 12.7901C11.7283 12.9254 11.9035 13 12.0913 13C12.2691 13 12.4378 12.9322 12.5658 12.809C12.8378 12.5472 12.8465 12.1132 12.5847 11.8409ZM5.47335 1.36924C7.61256 1.36924 9.35286 3.10954 9.35286 5.24874C9.35286 7.38795 7.61256 9.12825 5.47335 9.12825C3.33415 9.12825 1.59385 7.38795 1.59385 5.24874C1.59385 3.10954 3.33415 1.36924 5.47335 1.36924Z"
				fill="white"
			/>
		</svg>
	);
};

const TimesIcon = (props: any) => {
	return (
		<svg
			width="12"
			height="12"
			aria-hidden="true"
			focusable="false"
			data-prefix="fal"
			data-icon="times"
			role="img"
			viewBox="0 0 320 512"
			className="svg-inline--fa fa-times fa-w-10 fa-3x"
			{...props}
		>
			<path
				fill="currentColor"
				d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"
				className=""
			></path>
		</svg>
	);
};

const HelpIcon = (props: any) => {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
			<path
				d="M7.25938 0.031251C5.39062 0.212501 3.67813 1.01875 2.35 2.34375C1.0875 3.60625 0.325 5.15625 0.05625 7.01563C0.025 7.23438 0.015625 8.20938 0.015625 11.4375V15.5781L0.090625 15.6969C0.13125 15.7625 0.221875 15.8531 0.290625 15.9L0.41875 15.9844H4.55938C7.79063 15.9844 8.76562 15.975 8.98438 15.9438C10.8406 15.675 12.3813 14.9188 13.65 13.6563C14.8906 12.4156 15.65 10.9 15.9281 9.09375C16.0031 8.59063 16.0031 7.40938 15.9281 6.90625C15.65 5.10313 14.8969 3.59688 13.6562 2.35C12.425 1.11563 10.8906 0.346876 9.125 0.078126C8.73438 0.0187511 7.6625 -0.00624943 7.25938 0.031251ZM9.01562 1.32813C10.4594 1.55313 11.7312 2.2 12.7656 3.23438C13.8094 4.27813 14.4469 5.54063 14.6781 7.01563C14.7156 7.25938 14.7312 7.54688 14.7312 8C14.7312 8.45313 14.7156 8.74063 14.6781 8.98438C14.4469 10.4594 13.8094 11.7219 12.7656 12.7656C11.7375 13.7938 10.525 14.4125 9.03125 14.6781C8.76875 14.7219 8.30937 14.7313 4.99062 14.7406L1.24688 14.7531L1.25937 11.0094C1.26875 7.69063 1.27813 7.23125 1.32187 6.96875C1.5875 5.475 2.20625 4.2625 3.23438 3.23438C4.38438 2.08438 5.75 1.44688 7.45312 1.26875C7.70625 1.24375 8.7125 1.28125 9.01562 1.32813Z"
				fill="#969696"
			/>
			<path
				d="M7.41308 4.40938C6.53183 4.54376 5.85058 5.09376 5.76621 5.73751C5.71309 6.12501 5.99433 6.44063 6.39121 6.44376C6.60058 6.44688 6.67246 6.39688 6.89121 6.10626C7.18183 5.71876 7.44746 5.60313 7.96933 5.63126C8.55683 5.66563 8.8912 5.98126 8.8287 6.44688C8.78495 6.78438 8.6162 7.00001 8.04745 7.45626C7.58183 7.82813 7.37246 8.11563 7.22871 8.58438C7.18808 8.72188 7.17246 8.87188 7.17246 9.20313C7.17246 9.69376 7.20996 9.81563 7.39433 9.90313C7.52246 9.96563 7.81933 9.98438 8.01933 9.94063C8.22245 9.89376 8.37558 9.74376 8.37558 9.58438C8.3787 9.52813 8.3912 9.34688 8.4037 9.18126C8.4412 8.77188 8.54433 8.57501 8.88808 8.26876C9.5912 7.64376 9.79432 7.41251 10.0131 6.97813C10.5693 5.88751 9.95682 4.77813 8.62245 4.45313C8.37558 4.39376 7.67871 4.36876 7.41308 4.40938Z"
				fill="#969696"
			/>
			<path
				d="M7.54063 10.7626C7.13126 10.8938 6.91251 11.2188 6.94688 11.6438C7.00001 12.3344 7.80626 12.6438 8.31563 12.1657C8.48438 12.0094 8.59376 11.7688 8.59376 11.5626C8.59376 11.2657 8.35626 10.9126 8.08126 10.7969C7.92188 10.7282 7.68751 10.7157 7.54063 10.7626Z"
				fill="#969696"
			/>
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
	SaveIcon,
	SwitchOnIcon,
	SwitchOffIcon,
	SettingsIcon,
	SearchIcon,
	TimesIcon,
	HelpIcon,
};
