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

	border-radius: 8rem;

	background: #0D0E0E;
border: 0.6px solid #222225;
box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.14);
	color: #D1D5DB;

	box-sizing: border-box;

	padding: 8rem 0;
	z-index: 1;
`;
