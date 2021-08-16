import { ShowOnClick } from "../layouts/ShowonAction/ShowOnAction";
import { css, SerializedStyles } from "@emotion/react";
import { ReactElement } from "react";

type TDropdown = {
	dropdownCSS: SerializedStyles;
	component: ReactElement | string;
	initialState: boolean;
	callback: (openStatus: boolean) => void;
} & React.DetailedHTMLProps<any, any>;

const DropdownBox = ({ component, dropdownCSS }: TDropdown) => (
	<div css={[dropdDown, dropdownCSS]} className={"flex flex-col justify-between"}>
		{component}
	</div>
);

/*
		Should we change this to composability api??

		Sample user will be-
		<Dropwdown>
			<DropdownItems>
			...
			</DropdownItems>
		<Dropwdown>
 */
export const Dropdown = ({ initialState, children, dropdownCSS, component,callback }: TDropdown) => {
	return <ShowOnClick callback={callback} initialState={initialState} component={<DropdownBox dropdownCSS={dropdownCSS} component={component} />}>{children}</ShowOnClick>;
};

export const dropdDown = css`
	top: calc(100% + 4rem);
	left: calc(100% - 54rem);
	position: absolute;
	width: 206.03rem;

	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-sizing: border-box;
	box-shadow: 0 4px 15px rgba(16, 15, 15, 0.4);
	border-radius: 6px;
	padding: 8rem 0;
	z-index: 1;
`;
