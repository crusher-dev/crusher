import { css } from "@emotion/react";
import { DropdownIconSVG } from "@svg/builds";
import { Input } from "dyson/src/components/atoms/input/Input";
import { ClickableText } from "../../../../../dyson/src/components/atoms/clickacbleLink/Text";
import { Dropdown } from "../../../../../dyson/src/components/molecules/Dropdown";
import { useRouter } from "next/router";
import { MenuItem } from "@components/molecules/MenuItem";

import { TestType, TestTypeLabel } from "@constants/test";
import { useAtom } from "jotai";
import { buildFiltersAtom } from "../../../store/atoms/pages/buildPage";
import { Conditional } from "dyson/src/components/layouts";
import { CloseSVG } from "@svg/dashboard";
import React from "react";

interface ISearchFilterBarProps {
	data: any;
	placeholder?: string;
}

function StatusList() {
	const [filter, setFilters] = useAtom(buildFiltersAtom);
	return (
		<div className={"flex flex-col justify-between h-full"}>
			<div>
				{Object.entries(TestType).map(([item, value]) => (
					<MenuItem
						label={TestTypeLabel[item]}
						onClick={() => {
							setFilters({ ...filter, status: item });
						}}
						className={"close-on-click"}
					/>
				))}
			</div>
		</div>
	);
}

function Author({  authors }) {

	const [filter, setFilters] = useAtom(buildFiltersAtom);
	return (
		<div className={"flex flex-col justify-between h-full"}>
			<div>
				{authors.map(({ id, name }) => (
					<MenuItem
						label={name}
						className={"close-on-click"}
						onClick={() => {
							setFilters({ ...filter, triggeredBy: id });
						}}
					/>
				))}
			</div>
		</div>
	);
}

const dropDownSelectionCSS = css`
	height: fit-content;
	width: 180rem;
	top: calc(100% + 9rem) !important;
	right: 8px !important;
	left: unset !important;
`;

function Statustag() {
	const [filters, setFilters] = useAtom(buildFiltersAtom);

	const { status } = filters;
	return (
		<React.Fragment>
			<Conditional showIf={!status}>
				<Dropdown component={<StatusList />} dropdownCSS={dropDownSelectionCSS}>
					<ClickableText>
						<div className="flex flex-row items-center">
							<span className="text-13">Status</span>
							<DropdownIconSVG className={"ml-8"} />
						</div>
					</ClickableText>
				</Dropdown>
			</Conditional>

			<Conditional showIf={!!status}>
				<ClickableText
					onClick={() => {
						setFilters({ ...filters, status: null });
					}}
				>
					<div className="flex flex-row items-center">
						<span className="text-13 mt-2">{TestTypeLabel[status]}</span>
						<CloseSVG className={"ml-8"} height={10} />
					</div>
				</ClickableText>
			</Conditional>
		</React.Fragment>
	);
}

function Authorstag({ data }: { data: any }) {
	const [filters, setFilters] = useAtom(buildFiltersAtom);

	const { triggeredBy } = filters;

	const selectedAuthor = data.availableAuthors.filter(({ id }) => id === triggeredBy);

	return (
		<React.Fragment>
			<Conditional showIf={!triggeredBy}>
				<Dropdown component={<Author authors={data.availableAuthors} />} dropdownCSS={dropDownSelectionCSS}>
					<ClickableText>
						<div className="flex flex-row items-center">
							<span className="text-13">Author</span>
							<DropdownIconSVG className={"ml-8"} />
						</div>
					</ClickableText>
				</Dropdown>
			</Conditional>

			<Conditional showIf={!!triggeredBy}>
				<ClickableText
					onClick={() => {
						setFilters({ ...filters, triggeredBy: null });
					}}
				>
					<div className="flex flex-row items-center">
						<span className="text-13 mt-2">{selectedAuthor[0]?.name}</span>
						<CloseSVG className={"ml-8"} height={10} />
					</div>
				</ClickableText>
			</Conditional>
		</React.Fragment>
	);
}

function SearchFilterBar(props: ISearchFilterBarProps) {
	const {  placeholder, data } = props;
	const [filters, setFilters] = useAtom(buildFiltersAtom);

	const { status, triggeredBy, search } = filters;
	const isFilterEnabled = !!status || !!triggeredBy || !!search;

	const closeSVG = (
		<ClickableText
			paddingY={4}
			paddingX={4}
			onClick={() => {
				setFilters({ ...filters, search: null });
			}}
		>
			<CloseSVG height={12} width={12} />
		</ClickableText>
	);

	return (
		<div {...props}>
			<div className="flex flex-row items-center" css={filterBarStyle}>
				<div className={"flex-1 mr-26"}>
					<Input
						onBlur={(e) => {
							setFilters({ ...filters, search: e.target.value });
						}}

						onReturn={(search)=>{
							setFilters({ ...filters, search });
						}}
						rightIcon={!!search ? closeSVG : null}
						css={inputStyle}
						placeholder={placeholder}
						isError={false}
						size="large"
					/>
				</div>
				<div className="flex flex-row ml-auto">
					<Statustag />
					<Authorstag data={data} />
				</div>
			</div>

			<Conditional showIf={isFilterEnabled}>
				<div
					className={"flex text-13 items-center mt-20"}
					css={closeHover}
					onClick={() => {
						setFilters({});
					}}
				>
					<CloseSVG height={10} className={"mr-8"} /> <span className={"mt-2"}>Clear current search query, filters</span>
				</div>
			</Conditional>
		</div>
	);
}

const closeHover = css`
	color: rgba(255, 255, 255, 0.8);

	path {
		fill: rgba(255, 255, 255, 0.8);
	}
	:hover {
		color: rgba(255, 255, 255, 1);
		path {
			fill: rgba(255, 255, 255, 1);
		}
	}
`;

const inputStyle = css`
	height: 41rem;
	width: 100%;
`;
const filterBarStyle = css`
	color: ##d0d0d0;
`;

export { SearchFilterBar };
