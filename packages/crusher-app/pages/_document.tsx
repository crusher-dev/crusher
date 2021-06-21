import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { GTMTag, SegmentTag } from "../src/utils/scriptUtils";
import React from "react";

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return initialProps;
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel="icon" href="/assets/img/favicon.png" type="image/png" sizes="16x16" />
					<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
					<link href="/assets/css/global.css" rel="stylesheet" />
					<script dangerouslySetInnerHTML={{ __html: GTMTag }} />
					<script dangerouslySetInnerHTML={{ __html: SegmentTag }} />
				</Head>
				<body style={{ margin: 0, padding: 0 }}>
					<Main />
					<NextScript />

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
						color: #324dcf;
					}
					.form-row .StripeElement {
						margin-top: 0.5rem;
						box-sizing: border-box;

						height: 45px;

						padding: 10px 12px;

						border-radius: 4px;
						background-color: white;

						box-shadow: 0 1px 3px 0 #e6ebf1;
						-webkit-transition: box-shadow 150ms ease;
						transition: box-shadow 150ms ease;

						margin-top: 0.5rem;
						border: 1px solid #d0d0d0;
						width: 100%;

						border-radius: 4px;
					}
					.form-row .StripeElement--focus {
						box-shadow: 0 1px 3px 0 #cfd7df;
					}

					.form-row .StripeElement--invalid {
						border-color: #ff3838;
					}

					.StripeElement--webkit-autofill {
						background-color: #fefde5 !important;
					}
					.card-errors {
						margin-top: 0.5rem;
						font-size: 1rem;
						color: #ff3838;
						font-weight: 500;
					}
					ul {
						padding: 0;
						list-style-type: none;
						margin: 0;
					}
				`}</style>
			</Html>
		);
	}
}
