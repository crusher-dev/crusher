import { SettingsLayout } from "@ui/layout/SettingsBase";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { css } from '@emotion/react';
import { TextBlock } from 'dyson/src/components/atoms/textBlock/TextBlock';
import { Button, Input } from 'dyson/src/components/atoms';


export const ProjectSettings = () => {
	return (
		<SettingsLayout>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Heading type={1} fontSize={20} className={"mb-8"}>
					Overview
				</Heading>
				<TextBlock fontSize={13}>
					Make sure you have selected all the configuration you want
				</TextBlock>
				<hr css={basicHR} className={"mt-36"}/>

				<Heading type={2} fontSize={16} className={"mb-24 mt-38"}>
					Project name
				</Heading>
				<div>
					<Input placeholder={"Name of the project"} css={css`height: 42rem;`}/>
					<Button bgColor={"disabled"} css={css`width: 82rem;`} className={"mt-12"}>Save</Button>
				</div>
				<hr css={basicHR} className={"mt-54"}/>
				<Heading type={2} fontSize={16} className={"mb-12 mt-56"}>
					Delete this workspace
				</Heading>
				<TextBlock fontSize={13} className={"mb-24"}>
					Make sure you have selected all the configuration you want
				</TextBlock>
				<Button bgColor={"danger"} css={css`width: 164rem;`}>
					Delete project
				</Button>
			</div>
		</SettingsLayout>
	);
};

const maxWidthContainer = css`
	width: 680rem;
	margin: 0 auto;
	`

const basicHR = css`
  background: rgba(255, 255, 255, 0.015);
  border-top: 1px solid rgba(196, 196, 196, 0.06);
	`