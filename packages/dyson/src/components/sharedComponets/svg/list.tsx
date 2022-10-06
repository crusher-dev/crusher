export const EditIcon = (props: any) => (
	<svg viewBox={"0 0 13 13"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="m12.833 6.87-2.157-2.157a.537.537 0 0 0-.775 0l-.645.643V.886a.883.883 0 0 0-.883-.884H.883A.885.885 0 0 0 0 .885V8.34c0 .488.395.884.883.884h4.484l-.109.106a.842.842 0 0 0-.138.276l-.551 2.711c-.104.533.275.748.636.663l2.709-.554c.111 0 .194-.056.276-.138l4.643-4.646a.53.53 0 0 0 0-.772ZM1.06 8.165V1.063h7.137v5.346L6.434 8.162H1.06v.003Zm6.466 3.216-1.74.36.357-1.743 4.118-4.12L11.67 7.26l-4.144 4.12Z"
			fill="#7A7A7A"
		/>
	</svg>
);
export const PlayIcon = (props: any) => (
	<svg viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M1.386 14c-.23 0-.456-.062-.656-.178-.45-.258-.73-.76-.73-1.306V1.484C0 .937.28.436.73.178A1.303 1.303 0 0 1 2.07.195l9.296 5.644c.194.123.353.294.464.497a1.385 1.385 0 0 1-.464 1.824L2.07 13.805a1.317 1.317 0 0 1-.684.195Z"
			fill="#B061FF"
		/>
	</svg>
);

export const LoadingIconV2 = (props: any) => {
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

export function GarbageIcon(props: any) {
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
