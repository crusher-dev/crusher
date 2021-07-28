import { css } from "@emotion/core";
import { DropdownIconSVG } from "@svg/builds";
import { Input } from "dyson/src/components/atoms/input/Input";

interface ISearchFilterBarProps {
	value: string;
	placeholder?: string;
	handleInputChange: any;
}

function SearchFilterBar(props: ISearchFilterBarProps) {
	const { handleInputChange, value, placeholder } = props;

	return (
		<div {...props}>
			<div className="flex flex-row items-center" css={filterBarStyle}>
				<div className={"flex-1 mr-26"}>
					<Input value={value} css={inputStyle} placeholder={placeholder} onChange={handleInputChange} isError={false} size="large" />
				</div>
				<div className="flex flex-row ml-auto">
					<div className="flex flex-row items-center">
						<span className="text-14">Status</span>
						<DropdownIconSVG className={"ml-8"} />
					</div>
					<div className="flex flex-row items-center ml-26">
						<span className="text-14">Author</span>
						<DropdownIconSVG className={"ml-8"} />
					</div>
				</div>
			</div>
		</div>
	);
}

const inputStyle = css`
	height: 41rem;
	width: 100%;
`;
const filterBarStyle = css`
	color: ##d0d0d0;
`;

export { SearchFilterBar };
