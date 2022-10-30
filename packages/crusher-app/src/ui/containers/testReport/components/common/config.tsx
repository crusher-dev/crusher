import { css } from "@emotion/react";

import { useAtom } from "jotai";

import { LinkBlock } from "dyson/src/components/atoms/Link/Link";
import { Dropdown } from "dyson/src/components/molecules/Dropdown";

import { MenuItem } from "@components/molecules/MenuItem";
import { ChevronDown } from "@svg/testReport";
import { getAllConfigurationForGivenTest } from "@utils/core/buildReportUtils";

import { testCardConfigAtom } from "../../atoms";
import { useBasicTestData } from "../../hooks";

function Browsers({ browsers, setConfig }) {
	return (
		<div className={"flex flex-col justify-between h-full"} onClick={() => {}}>
			<div>
				{browsers.map((name: string) => (
					<MenuItem
						css={css`
							padding: 12rem 10rem;
						`}
						label={
							<div className={"flex items-center"}>
								<img src={`/assets/img/build/browser/${name.toLowerCase()}.png`} width={"12rem"} className={"mr-12"} />
								<div>{name.toLowerCase()}</div>
							</div>
						}
						key={name}
						className={"close-on-click"}
						onClick={() => {
							setConfig("browser", name);
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
	top: calc(100% + 4rem) !important;
	right: 8px !important;
	left: unset !important;
`;
export const ConfigChange = () => {
	const { testData } = useBasicTestData();
	const allConfiguration = getAllConfigurationForGivenTest(testData);

	const [testCardConfig, setTestCardConfig] = useAtom(testCardConfigAtom);

	const setConfig = (key, value) => {
		const config = allConfiguration;
		config[key] = value;
		setTestCardConfig(config);
	};

	const browserInLowerCase = testCardConfig?.browser.toLowerCase();
	return (
		<Dropdown component={<Browsers setConfig={setConfig} browsers={allConfiguration.browser} />} dropdownCSS={dropDownSelectionCSS}>
			<LinkBlock css={browserStyle}>
				<div className={"flex items-center "}>
					<div className={" flex items-center  mr-8 text-13"}>
						<img src={`/assets/img/build/browser/${browserInLowerCase}.png`} width={"16rem"} className={"mr-8"} />
						<span className={"mt-1 capitalize"}>{browserInLowerCase}</span>
					</div>
					<ChevronDown width={"12rem"} />
				</div>
			</LinkBlock>
		</Dropdown>
	);
};

const browserStyle = css`
	padding: 6px 8px;
	border-radius: 6px;
	margin-right: -8pxl;
`;
