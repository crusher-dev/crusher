export function Dolphin(props) {
	return (
		<svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M0 5a5 5 0 015-5h9.87a5 5 0 015.001 5v10a5 5 0 01-5 5H5A5 5 0 010 15V5z" fill="url(#prefix__paint0_linear_1896_3325)" />
			<path
				d="M3.682 6.512a.6.6 0 00-.68.594v4.26a.6.6 0 00.68.594l2.997-.402a.6.6 0 00.52-.595V7.51a.6.6 0 00-.52-.595l-2.997-.402zM17.366 12.784c-.12-3.716-2.475-6.363-5.373-6.363h-2.47a.4.4 0 00-.127.02l-1.355.452a.4.4 0 00-.274.38v4.042a.4.4 0 00.127.293l.9.838c.12.113.18.225.18.394v1.627c0 .221.18.4.4.4h2.823a.4.4 0 00.4-.4v-1.74c0-.04 0-.113.024-.17.016-.04.047-.074.067-.113l.331-.617c.121-.226.302-.338.544-.338 1.328.056 2.596.507 3.562 1.407.128.144.241.065.241-.112z"
				fill="#fff"
			/>
			<path d="M12.195 14.003h-2.82a.4.4 0 00-.4.4v5.19c0 .22.18.4.4.4h2.82a.4.4 0 00.4-.4v-5.19a.4.4 0 00-.4-.4z" fill="#fff" />
			<defs>
				<linearGradient id="prefix__paint0_linear_1896_3325" x1={9.935} y1={0} x2={9.935} y2={20} gradientUnits="userSpaceOnUse">
					<stop stopColor="#A284FA" />
					<stop offset={1} stopColor="#711BFE" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function TopDown(props) {
	return (
		<svg width={8} height={13} fill="none" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M3.64 0c.13 0 .26.05.36.152l3.13 3.183c.2.202.2.53 0 .733a.504.504 0 01-.72 0L3.64 1.252.87 4.068a.504.504 0 01-.72 0 .524.524 0 010-.733L3.28.152C3.38.05 3.51 0 3.64 0zM3.64 12.44c-.13 0-.261-.05-.36-.152L.15 9.105a.525.525 0 010-.733.504.504 0 01.72 0l2.77 2.816 2.77-2.816a.504.504 0 01.72 0c.2.202.2.53 0 .733L4 12.288a.504.504 0 01-.36.152z"
				fill="#5F5F5F"
				className="expand"
			/>
		</svg>
	);
}
