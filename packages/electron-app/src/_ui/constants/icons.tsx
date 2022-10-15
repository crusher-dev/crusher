import React from "react";

const CloudIcon = React.forwardRef(({ shouldAnimateGreen, color = "#9EF25B", ...props }, ref) => {
	return (
		<svg viewBox={"0 0 16 11"} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
			{shouldAnimateGreen ? (
				<linearGradient id="lg" x1="0.5" y1="1" x2="0.5" y2="0">
					<stop offset="0%" stopOpacity="1" stopColor={color} />
					<stop offset="40%" stopOpacity="1" stopColor={color}>
						<animate attributeName="offset" values="0;1" repeatCount="indefinite" dur="0.8s" begin="0s" />
					</stop>
					<stop offset="40%" stopOpacity="0" stopColor={color}>
						<animate attributeName="offset" values="0;1" repeatCount="indefinite" dur="0.8s" begin="0s" />
					</stop>
					<stop offset="100%" stopOpacity="0" stopColor={color} />
				</linearGradient>
			) : (
				""
			)}
			<path
				d="M12.854 4.47C12.566 1.953 10.504 0 8 0 5.497 0 3.433 1.953 3.147 4.47 1.409 4.47 0 5.932 0 7.735 0 9.538 1.409 11 3.146 11h9.708C14.59 11 16 9.538 16 7.735c0-1.803-1.409-3.265-3.146-3.265Z"
				fill={shouldAnimateGreen ? "url(#lg)" : color}
				stroke={"#fff"}
				strokeWidth="0.5"
			/>
		</svg>
	);
});

const DisabledCloudIcon = React.forwardRef(({ shouldAnimateGreen, ...props }, ref) => (
	<svg viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
		<path
			d="M15.895 6.539c-.342-3.01-2.81-5.344-5.801-5.344-2.992 0-5.459 2.335-5.802 5.344-2.077 0-3.76 1.747-3.76 3.902 0 2.156 1.683 3.903 3.76 3.903h11.603c2.078 0 3.761-1.747 3.761-3.903 0-2.155-1.684-3.902-3.76-3.902Z"
			fill="#E8407C"
		/>
		<mask
			id="a"
			style={{
				maskType: "alpha",
			}}
			maskUnits="userSpaceOnUse"
			x={0}
			y={0}
			width={11}
			height={16}
		>
			<path fill="#D9D9D9" d="M0 0h10.625v15.938H0z" />
		</mask>
		<g mask="url(#a)">
			<path
				d="M15.895 6.539c-.342-3.01-2.81-5.344-5.801-5.344-2.992 0-5.459 2.335-5.802 5.344-2.077 0-3.76 1.747-3.76 3.902 0 2.156 1.683 3.903 3.76 3.903h11.603c2.078 0 3.761-1.747 3.761-3.903 0-2.155-1.684-3.902-3.76-3.902Z"
				fill="#E8407C"
			/>
		</g>
		<path fill="#000" d="M14.634 8.635h8.171v8.171h-8.171z" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M17.409 10.6a.572.572 0 0 0-.81.809l1.312 1.311-1.312 1.311a.572.572 0 0 0 .81.81l1.311-1.312 1.312 1.312a.572.572 0 0 0 .808-.81L19.53 12.72l1.311-1.312a.572.572 0 0 0-.808-.808L18.72 11.91 17.409 10.6Zm-1.406-3.378C16.746 7.057 17.647 7 18.72 7c1.073 0 1.974.057 2.717.222.75.166 1.372.45 1.851.93.48.479.764 1.102.93 1.851.165.743.222 1.644.222 2.717 0 1.073-.057 1.974-.222 2.717-.166.75-.45 1.372-.93 1.851-.479.48-1.102.764-1.851.93-.743.165-1.644.222-2.717.222-1.073 0-1.974-.057-2.717-.222-.75-.166-1.372-.45-1.851-.93-.48-.479-.764-1.102-.93-1.851-.165-.743-.222-1.644-.222-2.717 0-1.073.057-1.974.222-2.717.166-.75.45-1.372.93-1.851.479-.48 1.102-.764 1.851-.93Z"
			fill="#fff"
		/>
	</svg>
));

export function DocsIcon(props: any) {
	return (
		<svg width={14} height={14} fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.937.673C3.521.543 4.22.5 5.034.5h3.932c.814 0 1.513.043 2.097.173.591.131 1.104.36 1.504.76.4.4.629.913.76 1.504.13.584.173 1.283.173 2.097v3.932c0 .814-.043 1.513-.173 2.097-.131.591-.36 1.104-.76 1.504-.4.4-.912.629-1.504.76-.584.13-1.283.173-2.097.173H5.034c-.814 0-1.513-.043-2.097-.173-.591-.131-1.104-.36-1.504-.76-.4-.4-.629-.912-.76-1.504C.543 10.479.5 9.78.5 8.966V5.034c0-.814.043-1.513.173-2.097.131-.591.36-1.104.76-1.504.4-.4.913-.629 1.504-.76zM3.75 1.8a.65.65 0 01.65.65v3.29c0 .571.733.806 1.065.341a1.887 1.887 0 013.07 0c.332.465 1.065.23 1.065-.34V2.45a.65.65 0 111.3 0v3.29c0 1.836-2.355 2.59-3.422 1.097a.587.587 0 00-.956 0C5.455 8.331 3.1 7.576 3.1 5.74V2.45a.65.65 0 01.65-.65z"
				fill="#989898"
			/>
		</svg>
	);
}

const NotepadIcon = (props) => (
	<svg viewBox={"0 0 14 14"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M10.261 3.661a.778.778 0 0 0-1.1 0l-5.5 5.5a.778.778 0 1 0 1.1 1.1l5.5-5.5a.778.778 0 0 0 0-1.1Z" fill="#BDBDBD" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 2.333A2.333 2.333 0 0 1 2.333 0h9.334A2.333 2.333 0 0 1 14 2.333v9.334A2.333 2.333 0 0 1 11.667 14H2.333A2.333 2.333 0 0 1 0 11.667V2.333Zm2.333-.777h9.334c.43 0 .777.348.777.777v9.334c0 .43-.348.777-.777.777H2.333a.778.778 0 0 1-.777-.777V2.333c0-.43.348-.777.777-.777Z"
			fill="#BDBDBD"
		/>
	</svg>
);

const ConsoleIcon = (props) => (
	<svg viewBox={"0 0 11 11"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M9.533 0H1.467A1.42 1.42 0 0 0 .43.46C.155.756 0 1.156 0 1.572V9.43c0 .416.155.816.43 1.11.275.295.648.46 1.037.461h8.066a1.42 1.42 0 0 0 1.037-.46c.275-.295.43-.695.43-1.111V1.57c0-.416-.155-.816-.43-1.11A1.42 1.42 0 0 0 9.533 0Zm-7.7 5.5a.35.35 0 0 1-.212-.072.391.391 0 0 1-.134-.19.42.42 0 0 1-.006-.24.396.396 0 0 1 .123-.198L3.08 3.536 1.604 2.27a.413.413 0 0 1 .052-.651.35.35 0 0 1 .407.037L3.896 3.23a.39.39 0 0 1 .101.136.416.416 0 0 1-.101.477L2.063 5.414a.352.352 0 0 1-.23.086Zm3.667 0H4.033a.355.355 0 0 1-.259-.115.408.408 0 0 1-.107-.278c0-.104.038-.204.107-.278a.355.355 0 0 1 .26-.115H5.5c.097 0 .19.042.26.115a.408.408 0 0 1 .107.278.408.408 0 0 1-.108.278.355.355 0 0 1-.259.115Z"
			fill="#858585"
		/>
	</svg>
);

const PointerIcon = (props) => (
	<svg viewBox={"0 0 8 8"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.154.18c.24.215.259.584.043.823L1.503 7.178c-.215.24-.76.216-1 0-.239-.215-.215-.76 0-1L6.33.223a.583.583 0 0 1 .824-.044Z"
			fill="#3C3C3D"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M.356.949A.583.583 0 0 1 .908.336L6.733.03a.583.583 0 0 1 .613.552l.305 5.826a.583.583 0 1 1-1.165.06l-.274-5.242-5.243.275A.583.583 0 0 1 .356.949Z"
			fill="#3C3C3D"
		/>
	</svg>
);

const EditIcon = (props) => (
	<svg viewBox={"0 0 13 14"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M4.157 4.292h2.35a.554.554 0 0 0 0-1.11h-2.35a.554.554 0 0 0 0 1.11ZM7.06 6.422a.555.555 0 0 0-.552-.554h-2.35a.554.554 0 0 0 0 1.109h2.35c.305 0 .552-.25.552-.555ZM2.499 4.284a.544.544 0 1 0 0-1.088.544.544 0 0 0 0 1.088ZM2.499 6.966a.544.544 0 1 0 0-1.088.544.544 0 0 0 0 1.088Z"
			fill="#BDBDBD"
		/>
		<path
			d="m12.833 7.372-2.157-2.157a.537.537 0 0 0-.775 0l-.645.642v-4.47a.883.883 0 0 0-.883-.884H.883A.885.885 0 0 0 0 1.387v7.455c0 .488.395.883.883.883h4.484l-.109.106a.842.842 0 0 0-.138.276L4.57 12.82c-.104.533.275.748.636.663l2.709-.554c.111 0 .194-.056.276-.139l4.643-4.645a.53.53 0 0 0 0-.772ZM1.06 8.667V1.565h7.137V6.91L6.434 8.664H1.06v.003Zm6.466 3.215-1.74.361.357-1.743 4.118-4.12 1.409 1.382-4.144 4.12Z"
			fill="#BDBDBD"
		/>
	</svg>
);

const ConsoleIconV3 = (props) => (
	<svg viewBox={"0 0 18 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.5 4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V4Zm2.647.647a.5.5 0 0 1 .706 0l1.5 1.5a.5.5 0 0 1 0 .706l-1.5 1.5a.5.5 0 0 1-.706-.706L6.293 6.5 5.147 5.353a.5.5 0 0 1 0-.706ZM8 7.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H8Z"
			fill="#FAFAFA"
		/>
	</svg>
);

const BasketBallIcon = React.forwardRef((props, ref) => (
	<svg viewBox={"0 0 18 18"} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
		<path d="M15.75 9a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" stroke="#303030" strokeWidth={1.5} />
		<path d="M6 10.5c.684.91 1.773 1.5 3 1.5s2.316-.59 3-1.5M6.75 7.508V7.5M11.25 7.508V7.5" stroke="#303030" strokeWidth={1.5} strokeLinecap="round" />
	</svg>
));

const ResetIcon = React.forwardRef((props, ref) => (
	<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
		<g clipPath="url(#a)">
			<path
				d="M6.574 11.966a5.25 5.25 0 0 0 4.61-4.6 5.253 5.253 0 0 0-5.152-5.862V.092c0-.078-.098-.12-.164-.07L2.96 2.155a.09.09 0 0 0 0 .145l2.907 2.135c.066.049.164.005.164-.071v-1.41a3.806 3.806 0 0 1 3.733 4.06 3.82 3.82 0 0 1-3.547 3.535 3.807 3.807 0 0 1-4-3.187.724.724 0 0 0-1.43.218 5.256 5.256 0 0 0 5.786 4.385Z"
				fill="#fff"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h12v12H0z" />
			</clipPath>
		</defs>
	</svg>
));

const PageIcon = React.forwardRef((props) => (
	<svg viewBox={"0 0 14 14"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.406 1.75c-.604 0-1.094.49-1.094 1.094V10.5a1.75 1.75 0 0 0 1.75 1.75h8.75a1.75 1.75 0 0 1-1.75-1.75V2.844c0-.605-.49-1.094-1.093-1.094H2.406ZM7 5.688a.437.437 0 1 0 0 .875h.875a.437.437 0 1 0 0-.875H7Zm-.438-1.313A.437.437 0 0 1 7 3.937h.875a.437.437 0 1 1 0 .876H7a.437.437 0 0 1-.438-.438ZM3.5 7.438a.437.437 0 1 0 0 .875h4.375a.437.437 0 1 0 0-.876H3.5Zm-.438 2.187a.437.437 0 0 1 .438-.438h4.375a.437.437 0 1 1 0 .876H3.5a.438.438 0 0 1-.438-.438ZM3.5 3.937a.437.437 0 0 0-.438.438v1.75c0 .242.197.438.438.438h1.75a.437.437 0 0 0 .438-.438v-1.75a.437.437 0 0 0-.438-.438H3.5Z"
			fill="#2A2A2A"
		/>
		<path d="M10.938 3.938h1.093c.362 0 .656.293.656.656V10.5a.875.875 0 1 1-1.75 0V3.937Z" fill="#2A2A2A" />
	</svg>
));

const ElementIcon = React.forwardRef((props) => (
	<svg viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9.093 3.032a4.375 4.375 0 0 0-6.186 6.186.438.438 0 1 1-.62.62 5.25 5.25 0 1 1 8.963-3.713.438.438 0 0 1-.875 0c0-1.12-.427-2.24-1.282-3.093ZM7.856 4.269A2.625 2.625 0 0 0 4.144 7.98a.438.438 0 1 1-.619.618A3.5 3.5 0 1 1 9.5 6.125a.437.437 0 1 1-.875 0c0-.673-.257-1.343-.769-1.856Zm-2.12.766a.437.437 0 0 1 .479.182l3.05 4.618a.438.438 0 0 1-.454.67l-1.223-.251.61 2.275a.438.438 0 0 1-.846.226l-.61-2.274-.933.828a.438.438 0 0 1-.728-.353l.332-5.525a.438.438 0 0 1 .323-.396Z"
			fill="#2A2A2A"
		/>
	</svg>
));

const CodeIcon = React.forwardRef((props) => (
	<svg viewBox={"0 0 12 12"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M.75 2.696A1.75 1.75 0 0 1 2.5.946h7a1.75 1.75 0 0 1 1.75 1.75v7a1.75 1.75 0 0 1-1.75 1.75h-7a1.75 1.75 0 0 1-1.75-1.75v-7Zm8.313 3.5a.438.438 0 0 1-.129.31L7.622 7.817a.438.438 0 1 1-.619-.618l1.004-1.004-1.004-1.003a.438.438 0 1 1 .619-.618l1.312 1.312a.436.436 0 0 1 .129.31Zm-5.997-.309a.438.438 0 0 0 0 .618l1.312 1.313a.438.438 0 1 0 .619-.618L3.993 6.196l1.004-1.003a.438.438 0 1 0-.619-.618L3.066 5.887Z"
			fill="#2A2A2A"
		/>
	</svg>
));

const UnCollapseIcon = (props) => (
	<svg viewBox={"0 0 8 7"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M.274.833h7.463c.21 0 .358.29.19.49L4.28 6.032a.327.327 0 0 1-.527 0l-3.69-4.71c-.147-.2-.02-.49.211-.49Z" fill="#2D2D2D" />
	</svg>
);

const SaveButtonDownIcon = (props) => (
	<svg viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="m11.653 1.227-5 4.546-5-4.546" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const EditPencilIcon = (props) => (
	<svg viewBox={"0 0 12 12"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M10.866 1.135a1.312 1.312 0 0 0-1.857 0l-.578.578 1.856 1.856.579-.578a1.312 1.312 0 0 0 0-1.856ZM9.756 4.1 7.902 2.244 1.826 8.319a2.625 2.625 0 0 0-.66 1.107l-.4 1.342a.375.375 0 0 0 .466.467l1.343-.4a2.625 2.625 0 0 0 1.107-.66L9.757 4.1Z"
			fill="#686868"
		/>
	</svg>
);

const ReselectPointerIcon = React.forwardRef((props, ref) => (
	<svg viewBox={"0 0 10 12"} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5 .75a.375.375 0 0 1 .375.375V2.25a.375.375 0 0 1-.75 0V1.125A.375.375 0 0 1 5 .75ZM1.818 2.068a.375.375 0 0 1 .53 0l.796.796a.375.375 0 0 1-.53.53l-.796-.796a.375.375 0 0 1 0-.53Zm6.364 0a.375.375 0 0 1 0 .53l-.796.796a.375.375 0 0 1-.53-.53l.796-.796a.375.375 0 0 1 .53 0ZM4.774 4.316a.375.375 0 0 1 .41.155L7.798 8.43a.375.375 0 0 1-.388.574L6.36 8.789l.522 1.95a.375.375 0 1 1-.724.194l-.522-1.95-.801.71a.375.375 0 0 1-.623-.303l.284-4.735a.375.375 0 0 1 .277-.34v.001ZM.5 5.25a.375.375 0 0 1 .375-.375H2a.375.375 0 0 1 0 .75H.875A.375.375 0 0 1 .5 5.25Zm7.125 0A.375.375 0 0 1 8 4.875h1.125a.375.375 0 0 1 0 .75H8a.375.375 0 0 1-.375-.375ZM3.144 7.106a.375.375 0 0 1 0 .53l-.796.796a.375.375 0 1 1-.53-.53l.796-.796a.375.375 0 0 1 .53 0Z"
			fill="#686868"
		/>
	</svg>
));

const AddedIcon = (props) => (
	<svg viewBox={"0 0 13 12"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.5 0a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm.462 4.154a.462.462 0 0 0-.924 0v1.384H4.654a.462.462 0 0 0 0 .924h1.384v1.384a.462.462 0 0 0 .924 0V6.462h1.384a.462.462 0 0 0 0-.924H6.962V4.154Z"
			fill="#C852FF"
		/>
	</svg>
);
const EllipseIcon = (props) => (
	<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<circle cx={5} cy={5} r={4.5} stroke="#fff" />
	</svg>
);

const FailedStepIcon = (props) => (
	<svg viewBox={"0 0 18 18"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.936 5.664a.9.9 0 0 0-1.272 1.272L7.727 9l-2.063 2.064a.9.9 0 0 0 1.272 1.272L9 10.273l2.064 2.063a.9.9 0 0 0 1.272-1.272L10.273 9l2.063-2.064a.9.9 0 0 0-1.272-1.272L9 7.727 6.936 5.664ZM4.726.349C5.893.089 7.311 0 9 0c1.688 0 3.106.09 4.275.349 1.179.262 2.159.71 2.913 1.463.754.754 1.2 1.734 1.463 2.913C17.911 5.894 18 7.312 18 9c0 1.688-.09 3.106-.349 4.275-.262 1.179-.71 2.159-1.463 2.913-.754.754-1.734 1.2-2.913 1.463-1.169.26-2.587.349-4.275.349-1.688 0-3.106-.09-4.275-.349-1.179-.262-2.159-.71-2.913-1.463-.754-.754-1.2-1.734-1.463-2.913C.089 12.106 0 10.688 0 9c0-1.688.09-3.106.349-4.275.262-1.179.71-2.159 1.463-2.913.754-.754 1.734-1.2 2.913-1.463Z"
			fill="#E0307A"
		/>
	</svg>
);

const OptionsIcon = (props) => (
	<svg viewBox={"0 0 18 4"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M1.85 0C.83 0 0 .83 0 1.849c0 1.02.83 1.849 1.85 1.849 1.018 0 1.848-.83 1.848-1.849C3.698.829 2.868 0 1.85 0ZM8.547 0c-1.02 0-1.849.83-1.849 1.849 0 1.02.83 1.849 1.85 1.849s1.849-.83 1.849-1.849C10.397.829 9.567 0 8.547 0ZM15.246 0c-1.02 0-1.85.83-1.85 1.849 0 1.02.83 1.849 1.85 1.849s1.849-.83 1.849-1.849c0-1.02-.83-1.849-1.85-1.849Z"
			fill="#E0E0E0"
		/>
	</svg>
);

const InfoIcon = React.forwardRef((props, ref) => (
	<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.25 6.875a6.375 6.375 0 1 1-12.75 0 6.375 6.375 0 0 1 12.75 0Zm-8.063-.563a.563.563 0 0 1 .563-.562h.19A1.313 1.313 0 0 1 7.22 7.348l-.345 1.549a.188.188 0 0 0 .184.228h.19a.563.563 0 1 1 0 1.125h-.19A1.312 1.312 0 0 1 5.78 8.652l.345-1.549a.188.188 0 0 0-.184-.228h-.19a.563.563 0 0 1-.563-.563ZM6.5 4.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
			fill="#757575"
		/>
	</svg>
));

export function SelectedSVG(props) {
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
				d="M4.15 1.233C4.93 1.06 5.875 1 7 1s2.07.06 2.85.233c.786.174 1.44.473 1.942.975.502.503.8 1.156.975 1.942.174.78.233 1.725.233 2.85s-.06 2.07-.233 2.85c-.174.786-.473 1.44-.975 1.942-.503.502-1.156.8-1.942.975C9.07 12.941 8.125 13 7 13s-2.07-.06-2.85-.233c-.786-.174-1.44-.473-1.942-.975-.502-.503-.8-1.156-.975-1.942C1.06 9.07 1 8.125 1 7s.06-2.07.233-2.85c.174-.786.473-1.44.975-1.942.503-.502 1.156-.8 1.942-.975zm1.954 2.559c.308-.832 1.484-.832 1.792 0l.377 1.016a.6.6 0 00.562.392h.881c.86 0 1.292 1.04.683 1.65l-.92.92a.6.6 0 00-.165.542l.222 1.107c.16.805-.716 1.413-1.414.981l-.806-.499a.6.6 0 00-.632 0l-.806.5c-.698.431-1.575-.177-1.414-.982l.222-1.107a.6.6 0 00-.164-.542l-.946-.946c-.6-.6-.175-1.624.672-1.624h.917a.6.6 0 00.562-.392l.377-1.016z"
				fill="#C140FD"
			/>
		</svg>
	);
}


const GoBackIcon = (props) => {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			viewBox="0 0 14 14"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M2 7h10M5.75 3.25L2.109 6.891a.154.154 0 000 .218l3.64 3.641"
				stroke="#919191"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const CloseIcon = (props) => (
	<svg viewBox={"0 0 8 8"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M.13.141a.444.444 0 0 1 .627 0l3.237 3.233L7.231.14a.444.444 0 1 1 .628.626L4.622 4l3.237 3.233a.443.443 0 1 1-.628.626L3.994 4.626.757 7.86a.444.444 0 0 1-.627-.626L3.367 4 .13.767a.443.443 0 0 1 0-.626Z"
			fill="#3E3E3E"
		/>
	</svg>
);

const UpDownSizeIcon = (props) => (
	<svg viewBox={"0 0 10 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3.97.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L4.5 2.31 1.28 5.53A.75.75 0 0 1 .22 4.47L3.97.72ZM.22 10.47a.75.75 0 0 1 1.06 0l3.22 3.22 3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L.22 11.53a.75.75 0 0 1 0-1.06Z"
			fill="#7E7E7E"
		/>
	</svg>
);


const BackIconV3 = (props) => (
	<svg
		viewBox={"0 0 12 10"}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M1 5h10M4.75 1.25 1.109 4.891a.154.154 0 0 0 0 .218l3.64 3.641"
			stroke="#919191"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

const GithubIcon = (props) => (
	<svg
		viewBox={"0 0 16 16"}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM4.427 4.067h-.002a.8.8 0 0 0-.49.527 3.853 3.853 0 0 0-.153 1.988A3.957 3.957 0 0 0 3.2 8.706c0 1.52.4 2.605 1.13 3.33.717.71 1.63.95 2.39 1.054l.024.003a7.886 7.886 0 0 0 2.505-.022h.001c.763-.093 1.684-.322 2.407-1.028.739-.722 1.14-1.81 1.142-3.338a3.956 3.956 0 0 0-.582-2.124l.017-.096a3.835 3.835 0 0 0-.195-1.95.8.8 0 0 0-.467-.466h-.001l-.001-.001h-.002l-.004-.002-.008-.003-.017-.006a.896.896 0 0 0-.128-.033c-.384-.074-1.02-.005-1.94.62l-.064.044a5.92 5.92 0 0 0-2.817 0 5.654 5.654 0 0 0-.064-.044c-.922-.627-1.562-.694-1.944-.62a1.077 1.077 0 0 0-.126.033l-.016.005-.008.003-.004.001-.002.001Z"
			fill="#fff"
		/>
	</svg>
)

const TickIcon = (props) => (
	<svg
	  viewBox={'0 0 12 9'}
	  fill="none"
	  xmlns="http://www.w3.org/2000/svg"
	  {...props}
	>
	  <path
		fillRule="evenodd"
		clipRule="evenodd"
		d="M10.693.7a.501.501 0 0 1 .136.142.465.465 0 0 1 .054.37.476.476 0 0 1-.09.171l-5.6 6.825a.517.517 0 0 1-.169.134.556.556 0 0 1-.62-.085l-3.15-2.925a.469.469 0 0 1-.14-.341.471.471 0 0 1 .153-.336.546.546 0 0 1 .362-.143.548.548 0 0 1 .367.13l2.726 2.531L9.958.793A.555.555 0 0 1 10.693.7Z"
		fill="#B0FF72"
		stroke="#B0FF72"
		strokeWidth={0.6}
	  />
	</svg>
  )


const CorrectCircleIcon = (props) => (
	<svg
	  viewBox={"0 0 14 14"}
	  fill="none"
	  xmlns="http://www.w3.org/2000/svg"
	  {...props}
	>
	  <path
		fillRule="evenodd"
		clipRule="evenodd"
		d="M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7Zm9.595-1.895a.7.7 0 0 1 0 .99L7.017 8.673a1.014 1.014 0 0 1-1.434 0L4.405 7.495a.7.7 0 0 1 .99-.99l.905.905 2.305-2.305a.7.7 0 0 1 .99 0Z"
		fill="#9EF25B"
	  />
	  <path
		fillRule="evenodd"
		clipRule="evenodd"
		d="M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7Zm9.595-1.895a.7.7 0 0 1 0 .99L7.017 8.673a1.014 1.014 0 0 1-1.434 0L4.405 7.495a.7.7 0 0 1 .99-.99l.905.905 2.305-2.305a.7.7 0 0 1 .99 0Z"
		fill="#9EF25B"
	  />
	</svg>
  )
  


const EditIconV4 = (props) => (
	<svg
	  viewBox={"0 0 14 14"}
	  fill="none"
	  xmlns="http://www.w3.org/2000/svg"
	  {...props}
	>
	  <path
		d="m3.803 9.742.884-2.209a2.8 2.8 0 0 1 .619-.939l4.844-4.843a1.485 1.485 0 0 1 2.1 2.1L7.406 8.694a2.8 2.8 0 0 1-.94.62l-2.208.884a.35.35 0 0 1-.455-.455v-.001Z"
		fill="#CC5FFF"
	  />
	  <path
		d="M2.45 4.025c0-.483.392-.875.875-.875H7A.525.525 0 0 0 7 2.1H3.325A1.925 1.925 0 0 0 1.4 4.025v6.65A1.925 1.925 0 0 0 3.325 12.6h6.65a1.925 1.925 0 0 0 1.925-1.925V7a.525.525 0 1 0-1.05 0v3.675a.875.875 0 0 1-.875.875h-6.65a.875.875 0 0 1-.875-.875v-6.65Z"
		fill="#CC5FFF"
	  />
	</svg>
  )
export {
	BackIconV3,
	DisabledCloudIcon,
	CloudIcon,
	NotepadIcon,
	ConsoleIcon,
	PointerIcon,
	EditIcon,
	ConsoleIconV3,
	BasketBallIcon,
	ResetIcon,
	PageIcon,
	ElementIcon,
	CodeIcon,
	UnCollapseIcon,
	SaveButtonDownIcon,
	EditPencilIcon,
	ReselectPointerIcon,
	AddedIcon,
	EllipseIcon,
	FailedStepIcon,
	OptionsIcon,
	InfoIcon,
	GoBackIcon,
	CloseIcon,
	UpDownSizeIcon,
	GithubIcon,
	TickIcon,
	CorrectCircleIcon,
	EditIconV4
};
