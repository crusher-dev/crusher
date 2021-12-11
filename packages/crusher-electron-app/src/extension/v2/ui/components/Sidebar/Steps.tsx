import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox, CheckboxProps } from "@dyson/components/atoms/checkbox/checkbox";
import { css } from "@emotion/react";
import { MoreIcon } from "crusher-electron-app/src/extension/assets/icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Conditional } from "@dyson/components/layouts";
import { Dropdown } from "@dyson/components/molecules/Dropdown";

const WarningIcon = () => (
	<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clipPath="url(#clip0_1539_948)">
			<path
				d="M1.42434 12.3063C0.155444 12.3063 -0.363674 11.4072 0.270772 10.3083L5.34644 1.51706C5.98088 0.418142 7.01907 0.418142 7.65352 1.51706L12.7292 10.3083C13.3636 11.4072 12.8445 12.3063 11.5756 12.3063H1.42434Z"
				fill="#FF629A"
			/>
			<path
				d="M12.7292 10.3082L7.65356 1.51697C7.33636 0.967485 6.91814 0.693557 6.5 0.693604V12.3062H11.5757C12.8446 12.3062 13.3637 11.4071 12.7292 10.3082Z"
				fill="#DE3D76"
			/>
			<path d="M6.50028 8.12761H5.57171L5.10742 4.41333H6.50028L6.96456 6.27047L6.50028 8.12761Z" fill="white" />
			<path d="M7.42857 8.12761H6.5V4.41333H7.89286L7.42857 8.12761Z" fill="white" />
			<path d="M6.49986 10.9134H5.57129V9.05627H6.49986L6.96415 9.98485L6.49986 10.9134Z" fill="white" />
			<path d="M7.42857 9.05627H6.5V10.9134H7.42857V9.05627Z" fill="white" />
		</g>
		<defs>
			<clipPath id="clip0_1539_948">
				<rect width="13" height="13" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export const containerStyle = css`
	padding: 26rem;
`;

const steps = [
	{ id: "test4", title: "Click on element", isRunning: true },
	{ id: "test1", title: "Click on element", isFailed: true },
	{ id: "test2", title: "Click on element" },
	{ id: "test3", title: "Click on element" },
	{ id: "test5", title: "Click on element" },
];

export function Steps(): JSX.Element {
	const [selected, setSelected] = React.useState(new Set());

	const toggleAllSteps = React.useCallback(
		(checked) => {
			if (checked) {
				setSelected(new Set([...steps.map((step) => step.id)]));
			} else {
				setSelected(new Set());
			}
		},
		[selected.size],
	);

	const toggleStep = React.useCallback(
		(index) => {
			const selectedSteps = new Set(selected);
			console.log(selected);
			if (selected.has(index)) {
				selectedSteps.delete(index);
			} else {
				selectedSteps.add(index);
			}

			setSelected(selectedSteps);
		},
		[selected],
	);

	return (
		<div
			css={css`
				border-top: 1rem solid #303235;
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					padding: 14rem 26rem;
				`}
			>
				<Checkbox isSelected={steps.length === selected.size} callback={toggleAllSteps} />

				<Text
					CSS={css`
						font-family: Cera Pro;
						font-size: 15px;
						flex-grow: 1;
						margin: 0rem 8rem;
					`}
				>
					{steps.length} Steps
				</Text>
				<Conditional showIf={!!selected.size}>
					<div
						css={css`
							box-sizing: border-box;
							position: relative;
							display: block;
						`}
					>
						<Dropdown
							dropdownCSS={css`
								width: 160rem;
								transform: translate(-80%, -40%);
							`}
							component={
								<>
									<TextBlock
										css={css`
											padding: 6rem 16rem;
										`}
									>
										Create template
									</TextBlock>
								</>
							}
						>
							<MoreIcon />
						</Dropdown>
					</div>
				</Conditional>
			</div>
			<div
				className="custom-scroll"
				css={css`
					overflow-y: auto;
					padding: 18rem 22rem;
					padding-top: 0rem;
					height: 25vh;
				`}
			>
				{steps.map((step) => (
					<Step
						isSelectAllType={false}
						key={step.id}
						isRunning={step.isRunning}
						isFailed={step.isFailed}
						isSelected={selected.has(step.id)}
						callback={() => toggleStep(step.id)}
						title={step.title}
						subtitle="p > a"
					/>
				))}
			</div>
		</div>
	);
}

function Step({
	title,
	subtitle,
	isRunning,
	isFailed,
	...props
}: CheckboxProps & { title: string; subtitle: string; isRunning?: boolean; isFailed?: boolean }): JSX.Element {
	return (
		<div
			css={[
				css`
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					box-sizing: border-box;
					border-radius: 6px;
					padding: 3rem 12rem;
					margin: 6rem 0rem;
				`,
				isRunning &&
					css`
						border: 1px solid rgba(255, 255, 255, 0.1);
						border-bottom: 4rem solid #a6ba86;
					`,
			]}
		>
			<Checkbox {...props} />
			<div
				css={css`
					margin: 5rem;
					padding: 4rem;
					flex: 1 0 50%;
				`}
			>
				<TextBlock>{title}</TextBlock>
				<TextBlock>{subtitle}</TextBlock>
			</div>
			<Conditional showIf={isFailed}>
				<TextBlock
					CSS={css`
						display: block;
						flex: 0 1 100%;
						font-family: Gilroy;
						font-style: normal;
						font-weight: 400;
						font-size: 13px;
						line-height: 13px;
						color: #de3d76;
						padding: 6rem;
					`}
				>
					<WarningIcon /> This step failed
				</TextBlock>
			</Conditional>
		</div>
	);
}
