import Document, { Html, Head, Main, NextScript } from "next/document";

import { css } from "@emotion/core";
import { GTMTag, GTMNoScriptTag } from "../src/utils/scriptUtils";

const body = css`
	font-family: "DM Sans", sans-serif;
`;

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
						rel="stylesheet"
					/>
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
					<link
						href="/lib/@fortawesome/fontawesome-free/css/all.min.css"
						rel="stylesheet"
					/>
					<link href="/lib/ionicons/css/ionicons.min.css" rel="stylesheet" />

					<link href="/assets/css/dashforge.css" rel="stylesheet" />
					<link href="/assets/css/dashforge.dashboard.css" rel="stylesheet" />
					<link href="/assets/css/gilroy.css" rel="stylesheet" />
					<link href="/assets/css/cera-pro.css" rel="stylesheet" />
					<script dangerouslySetInnerHTML={{ __html: GTMTag }} />
				</Head>
				<body style={{ margin: 0, padding: 0 }} css={body}>
					<Main />
					<NextScript />

					<GTMNoScriptTag />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
