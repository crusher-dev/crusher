function CommentIconSVG(props) {
	return (
		<svg width={"12rem"} height={"12rem"} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M11.607.001H1.393C.623.001 0 .625 0 1.394v7.428c0 .77.624 1.393 1.393 1.393H3.04l-.252 2.27a.464.464 0 00.772.397l2.963-2.667h5.083c.77 0 1.393-.623 1.393-1.393V1.394C13 .624 12.376 0 11.607 0zm.464 8.821a.464.464 0 01-.464.465H6.345a.464.464 0 00-.31.119l-2.189 1.97.175-1.573a.464.464 0 00-.461-.516H1.393a.464.464 0 01-.464-.465V1.394c0-.257.207-.464.464-.464h10.214c.257 0 .464.207.464.464v7.428z"
				fill="#D0D0D0"
			/>
		</svg>
	);
}

function DangerIconSVG(props) {
	return (
		<svg width={"17rem"} height={"15rem"} viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M16.85 13.146L9.392.777a1.042 1.042 0 00-1.784 0L.15 13.147a1.042 1.042 0 00.892 1.579h14.916a1.042 1.042 0 00.892-1.58zM8.506 4.552c.428 0 .79.242.79.67 0 1.307-.153 3.185-.153 4.492 0 .34-.374.483-.637.483-.352 0-.648-.142-.648-.483 0-1.307-.154-3.185-.154-4.492 0-.428.351-.67.802-.67zm.01 8.095a.846.846 0 01-.845-.846.84.84 0 01.846-.846c.45 0 .834.385.834.846 0 .45-.384.846-.834.846z"
				fill="#F344AD"
			/>
		</svg>
	);
}

function ClockIconSVG(props) {
	return (
		<svg width={"12rem"} height={"12rem"} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M6.5 0A6.507 6.507 0 000 6.5C0 10.084 2.916 13 6.5 13S13 10.084 13 6.5 10.084 0 6.5 0zm0 11.631A5.137 5.137 0 011.369 6.5 5.137 5.137 0 016.5 1.369 5.137 5.137 0 0111.631 6.5 5.137 5.137 0 016.5 11.631z"
				fill="#fff"
				fillOpacity={0.6}
			/>
			<path d="M9.21 6.572H6.546V4.264a.684.684 0 10-1.37 0v2.992c0 .378.307.685.685.685h3.35a.684.684 0 100-1.37z" fill="#fff" fillOpacity={0.6} />
		</svg>
	);
}

function DropdownIconSVG(props) {
	return (
		<svg width={9} height={9} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g clipPath="url(#prefix__clip0)">
				<path
					d="M4.5 7.065a.628.628 0 01-.446-.185L.184 3.01a.63.63 0 11.892-.89L4.5 5.542 7.924 2.12a.63.63 0 01.891.892l-3.87 3.87a.628.628 0 01-.445.184z"
					fill="#BDBDBD"
					fillOpacity={0.7}
				/>
			</g>
			<defs>
				<clipPath id="prefix__clip0">
					<path fill="#fff" d="M0 0h9v9H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}

export function BackSVG(props) {
	return (
		<svg viewBox="0 0 26 32" xmlns="http://www.w3.org/2000/svg" {...props}>
			<title />
			<path
				d="M10.1 23a1 1 0 000-1.41L5.5 17h23.55a1 1 0 000-2H5.53l4.57-4.57A1 1 0 008.68 9l-6.36 6.37a.9.9 0 000 1.27L8.68 23a1 1 0 001.42 0z"
				data-name="Layer 2"
				fill={"#fff"}
			/>
		</svg>
	);
}

export function FullImageView(props) {
	return (
		<svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" {...props}>
			<path
				d="M15.75 3.375h-5.625V2.25A1.125 1.125 0 009 1.125H2.25A1.125 1.125 0 001.125 2.25V13.5a1.125 1.125 0 001.125 1.125h5.625v1.125A1.125 1.125 0 009 16.875h6.75a1.125 1.125 0 001.125-1.125V4.5a1.125 1.125 0 00-1.125-1.125zM2.25 8.438h3.47L4.27 9.893l.793.793 2.812-2.812-2.813-2.813-.793.794 1.452 1.457H2.25V2.25H9V13.5H2.25V8.437zM9 15.75v-1.125a1.125 1.125 0 001.125-1.125v-9h5.625v5.063h-3.47l1.45-1.457-.793-.793-2.812 2.812 2.813 2.813.793-.794-1.452-1.457h3.471v5.063H9z"
				fill="#fff"
			/>
		</svg>
	);
}

export function ShowSidebySide(props) {
	return (
		<svg width={13} height={13} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M13.066 1.172H11.72V.469a.469.469 0 00-.938 0v.703H4.22V.469a.469.469 0 10-.938 0v.703H1.934A1.936 1.936 0 000 3.105v9.961C0 14.133.867 15 1.934 15h11.132A1.936 1.936 0 0015 13.066v-9.96a1.936 1.936 0 00-1.934-1.934zm.996 11.894c0 .55-.445.996-.996.996H1.934a.996.996 0 01-.996-.996V5.303c0-.081.065-.147.146-.147h12.832c.08 0 .146.066.146.147v7.763z"
				fill="#F9F9F9"
			/>
		</svg>
	);
}

export function CorrentSVG(props) {
	return (
		<svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M9.604 1C11.638 1 13 2.428 13 4.552v4.903C13 11.572 11.638 13 9.604 13H4.402C2.368 13 1 11.572 1 9.455V4.552C1 2.428 2.368 1 4.402 1h5.202zm-.096 4.2a.529.529 0 00-.744 0L6.286 7.678l-1.05-1.05a.529.529 0 00-.744 0 .529.529 0 000 .744L5.92 8.794c.102.102.234.15.366.15.138 0 .27-.048.372-.15l2.85-2.85a.529.529 0 000-.744z"
				fill="#9EF25B"
				fillOpacity={0.91}
			/>
		</svg>
	);
}

export function CheckSVG(props) {
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
				d="M13.7 2.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.413 0l-4-4A1 1 0 011.7 6.293l3.293 3.293 7.293-7.293a1 1 0 011.414 0z"
				fill="#ACF861"
			/>
		</svg>
	);
}

export function CheckSquare(props) {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M10.008 0c2.349 0 3.922 1.666 3.922 4.144v5.72c0 2.47-1.573 4.136-3.922 4.136H3.998C1.65 14 .07 12.334.07 9.863v-5.72C.07 1.667 1.65 0 4 0h6.008zm-.111 4.9a.606.606 0 00-.86 0L6.175 7.79 4.963 6.567a.606.606 0 00-.86 0 .621.621 0 000 .868l1.65 1.659a.59.59 0 00.422.175c.16 0 .312-.056.43-.175l3.292-3.325a.621.621 0 000-.868z"
				fill="#9EF25B"
				fillOpacity={0.91}
			/>
		</svg>
	);
}

export function ExpandableSVG(props) {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M1 4V1m0 0h3M1 1l3.75 3.75M13 4V1m0 0h-3m3 0L9.25 4.75M1 10v3m0 0h3m-3 0l3.75-3.75M13 13L9.25 9.25M13 13v-3m0 3h-3"
				stroke="#D766FF"
				strokeWidth={1.3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export { CommentIconSVG, DangerIconSVG, ClockIconSVG, DropdownIconSVG };
