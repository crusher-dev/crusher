import React from "react";
import { css } from "@emotion/react";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";
import { LoadingSVG } from "@svg/dashboard";

/*
	@Note - Wrong implementation of the loading state.
						It should be implemented in the parent component.
 */
export function SubmitButton({ loading, onSubmit, text }: { loading: boolean; onSubmit: () => void; text: string }) {
	return (
		<Button
			disabled={loading}
			className={"flex items-center justify-center mt-30"}
			css={css(`
                width: 100%;
                height: 38px;
                font-weight: 400;
                background:#905CFF;

            `)}
			size={"large"}
			onClick={onSubmit}
		>
			<div className={"flex justify-center items-center"}>
				<Conditional showIf={!loading}>
					<Text fontSize={14} weight={600}>
						{text}
					</Text>
				</Conditional>
				<Conditional showIf={loading}>
					<span>
						{" "}
						<LoadingSVG color={"#fff"} height={"16rem"} width={"16rem"} />
					</span>
					<Text fontSize={14} weight={600} className={"ml-8"}>
						Loading
					</Text>
				</Conditional>
			</div>
		</Button>
	);
}
