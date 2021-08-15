export function ChevronRight(props: React.DetailedHTMLProps<any, any>) {
	return (
		<svg width={9} height={9} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g clipPath="url(#prefix__clip0)">
				<path
					d="M7.065 4.5a.628.628 0 01-.185.446l-3.87 3.87a.63.63 0 11-.89-.892L5.542 4.5 2.12 1.076a.63.63 0 01.892-.891l3.87 3.87a.628.628 0 01.184.445z"
					fill="#BDBDBD"
					fillOpacity={0.7}
				/>
			</g>
			<defs>
				<clipPath id="prefix__clip0">
					<path fill="#fff" transform="rotate(-90 4.5 4.5)" d="M0 0h9v9H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}
