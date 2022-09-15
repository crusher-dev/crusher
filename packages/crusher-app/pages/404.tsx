import { css } from "@emotion/react";
import Link from "next/link";

import { BlankBase, CenterLayout } from "dyson/src/components/layouts";

function ErrorSVG(props) {
	return (
		<svg width={"36rem"} height={"36rem"} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M35.994 18c0-9.941-8.057-18-17.997-18S0 8.059 0 18s8.058 18 17.997 18c9.94 0 17.997-8.059 17.997-18z" fill="#313740" />
			<path
				d="M29.1 3.832a17.926 17.926 0 013.831 11.104c0 9.94-8.057 18-17.997 18-4.19 0-8.044-1.432-11.102-3.832C7.127 33.302 12.247 36 17.997 36c9.94 0 17.998-8.059 17.998-18 0-5.752-2.697-10.873-6.895-14.168z"
				fill="#272d35"
			/>
			<path d="M19.14 21.023h-2.285a.82.82 0 01-.82-.82V9.853a.82.82 0 01.82-.82h2.285a.82.82 0 01.82.82v10.35a.82.82 0 01-.82.82z" fill="#FF60D2" />
			<path d="M19.14 9.034h-1.482a.82.82 0 01.82.82v10.35a.82.82 0 01-.82.82h1.481a.82.82 0 00.82-.82V9.853a.82.82 0 00-.82-.82z" fill="#F146C1" />
			<path d="M17.998 27.549a1.963 1.963 0 111.963-1.963 1.963 1.963 0 01-1.963 1.963z" fill="#FF60D2" />
			<path d="M17.998 23.623c-.158 0-.312.02-.459.054a1.963 1.963 0 010 3.817 1.963 1.963 0 10.459-3.871z" fill="#F146C1" />
		</svg>
	);
}

export default function Custom404() {
	return (
		<div
			css={css`
				height: 100vh;
			`}
		>
			<BlankBase
				css={css`
					background: #080808;
				`}
			>
				<CenterLayout>
					<div className="flex flex-col justify-center items-center pb-56">
						<ErrorSVG height={"32rem"} />
						<div className={"font-cera text-18 font-700 mt-32 mb-12 leading-none"} css={textColor}>
							Page not found
						</div>
						<div className={"font-500 mb-48 text-13 leading-none"} css={textColor}>
							Are you at the right place?
						</div>
						<div className={"mb-80 text-13 leading-none italic"}>Error id #212</div>
						<Link href={"/app/dashboard"}>
							<div className={"underline text-14 leading-none font-600"}> {"<"} Go back to Dashboard</div>
						</Link>
					</div>
				</CenterLayout>
			</BlankBase>
		</div>
	);
}

const textColor = css`
	color: rgba(255, 255, 255, 0.8);
`;
