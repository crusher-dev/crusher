import { ShowOnClick } from "../layouts/ShowonAction/ShowOnAction";
import { css, SerializedStyles } from "@emotion/react";
import { ReactElement } from "react";

type TDropdown = {
	dropdownCSS: SerializedStyles;
	component: ReactElement | string;
	initialState: boolean;
	callback: (openStatus: boolean) => void;

	// For emotion
	className?: string;
} & React.DetailedHTMLProps<any, any>;

const DropdownBox = ({ children, dropdownCSS }: React.DetailedHTMLProps<any, any>) => (
	<div css={[dropdDown, dropdownCSS]} className={"dropdown-box flex flex-col justify-between"}>
		{children}
	</div>
);

//@ts-ignore
DropdownBox.whyDidYouRender = true;

/*
		Should we change this to composability api??

		Sample user will be-
		<Dropwdown>
			<DropdownItems>
			...
			</DropdownItems>
		<Dropwdown>
 */

export const Dropdown = ({ initialState, children, dropdownCSS, className, component, callback }: TDropdown) => {
	return (
		<ShowOnClick
			className={className}
			callback={callback}
			initialState={initialState}
			component={<DropdownBox dropdownCSS={dropdownCSS}>{component}</DropdownBox>}
		>
			{children}
		</ShowOnClick>
	);
};

//@ts-ignore
Dropdown.whyDidYouRender = true;

export const dropdDown = css`
	top: calc(100% + 4rem);
	left: calc(100% - 54rem);
	position: absolute;
	width: 206.03rem;
	overflow: hidden;

	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-sizing: border-box;
	box-shadow: 0 4px 15px rgba(16, 15, 15, 0.4);
	border-radius: 6px;
	padding: 8rem 0;
	z-index: 1;
`;
