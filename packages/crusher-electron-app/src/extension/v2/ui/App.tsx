import { render } from "react-dom";
import {Button} from "@dyson/components/atoms/button/Button";
import {css} from "@emotion/react";

const App = () => {
	return (
		<div style={containerStyle}>
			<h2 css={{color: "red", fontSize: "14rem"}}>This is react app</h2>
			<Button
				    css={css`font-size: 14rem;`}
					disabled={false}
					title={"Please enter project name"}
					bgColor={"blue"}
					onClick={() => {}}
				>
					Tests
				</Button>
		</div>
	);
};

const containerStyle = {
	display: "flex",
	height: "100%"
};

render(
	<App />,
	document.querySelector("#root"),
);
