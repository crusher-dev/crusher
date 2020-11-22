import Document, { Html, Head, Main, NextScript } from "next/document";
import { GTMTag, GTMNoScriptTag } from "../src/utils/scriptUtils";
import { getThemeFromCookie } from "@utils/styleUtils";
import React from "react";

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const { query } = ctx;
		const theme = getThemeFromCookie(ctx);
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps, theme };
	}

	render() {
		// @ts-ignore
		const { theme } = this.props;
		return (
			<Html>
				<Head>
					<link
						rel="icon"
						href="/assets/img/favicon.png"
						type="image/png"
						sizes="16x16"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
						rel="stylesheet"
					/>
					<link href="/assets/css/global.css" rel="stylesheet" />
					<script dangerouslySetInnerHTML={{ __html: GTMTag }} />
				</Head>
				<body style={{ margin: 0, padding: 0 }}>
					<Main />
					<NextScript />
					<GTMNoScriptTag />
					<div id={"overlay"}></div>
				</body>
				<style jsx global>{`
					body {
						background: #fbfbfb;
						font-family: DM Sans;
					}
					::-webkit-scrollbar {
						width: 2px; /* Remove scrollbar space */
					}
					a {
						text-decoration: none;
						color: inherit;
					}
					a:hover {
						text-decoration: underline !important;
						color: #5b76f7;
					}
				`}</style>
			</Html>
		);
	}
}
