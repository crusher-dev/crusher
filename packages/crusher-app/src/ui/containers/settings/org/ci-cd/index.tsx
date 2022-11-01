import { getCIIntegrationCommnad } from "@constants/api";
import { css } from "@emotion/react";
import { useProjectDetails } from "@hooks/common";
import { CopyIconSVG } from "@svg/onboarding";
import { sendSnackBarEvent } from "@utils/common/notify";
import { TextBlock } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import Input from "dyson/src/components/atoms/input/Input";
import { useCallback, useRef } from "react";
import useSWR from "swr";

export const CICDIntegration = () => {
	const { currentProject: project } = useProjectDetails();
	const { data } = useSWR(getCIIntegrationCommnad(project?.id));
	const inputRef = useRef(null);

	const copyCommand = useCallback(() => {
		inputRef.current.select();
		inputRef.current.setSelectionRange(0, 99999);
		document.execCommand("copy");
		sendSnackBarEvent({ type: "normal", message: "Copied invite link to clipboard" });
	}, inputRef.current);

	return (
		<div>
			<Heading type={1} fontSize={"16"} className={"mb-8 mt-16"}>
				CI/CD
			</Heading>
			<TextBlock fontSize={12} color={"#787878"}>
				Easily integrate and trigger tests from your CI/CD workflow
			</TextBlock>

			<Input
				size={"medium"}
				forwardRef={inputRef}
				rightIcon={
					<CopyIconSVG
						onClick={copyCommand}
						css={css`
							position: relative;
							top: -2rem;
							right: -1rem;
						`}
					/>
				}
				css={css`
					width: 400rem;
					height: 40rem !important;
					margin-top: 20rem;
					input {
						padding-right: 36rem;
					}
				`}
				value={data ?? "Loading.."}
				onFocus={copyCommand}
			/>
		</div>
	);
}