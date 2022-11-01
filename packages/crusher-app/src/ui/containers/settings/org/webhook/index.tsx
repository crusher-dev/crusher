import { getIntegrations } from "@constants/api";
import { css } from "@emotion/react";
import { useProjectDetails } from "@hooks/common";
import { sendSnackBarEvent } from "@utils/common/notify";
import { Button, TextBlock } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import Input from "dyson/src/components/atoms/input/Input";
import { Conditional } from "dyson/src/components/layouts";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { updateWebhookUrl } from "./api";

export const WebHookIntegration = () => {
	const { currentProject: project } = useProjectDetails();
	const { data: integrations } = useSWR(getIntegrations(project?.id));
	const [webhookUrl, setWebhookUrl] = useState(null);

	const [added, setAdded] = useState(false);
	const [isEditable, setIsEditable] = useState(false);

	useEffect(() => {
		if (integrations?.webhook) {
			setWebhookUrl(integrations.webhook);
			setAdded(true);
		}
	}, [integrations]);

	const handleSaveWebhook = () => {
		setIsEditable(false);
		updateWebhookUrl(webhookUrl, project.id)
			.then(() => {
				sendSnackBarEvent({
					type: "success",
					message: "Webhook saved successfully",
				});
			})
			.catch(() => {
				sendSnackBarEvent({
					type: "error",
					message: "Failed to save webhook",
				});
			});
	};

	return (
		<div className={"justify-between items-start mt-24 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div className={"flex"}>
					<div className={"ml-44"}>
						<Heading type={2} fontSize={"14"} className={"mb-8"}>
							Webhook
						</Heading>
						<TextBlock fontSize={12} color={"#787878"}>
							Get alerts on test fail and important evens
						</TextBlock>
					</div>
				</div>
				<Conditional showIf={added}>
					<div className="flex items-center">
						<Input
							disabled={!isEditable}
							size={"medium"}
							initialValue={webhookUrl}
							css={webhookInputCss(!isEditable)}
							onChange={(evt) => setWebhookUrl(evt.target.value)}
							onReturn={handleSaveWebhook.bind(this)}
							size="small"
							placeholder="enter webhook"
						/>
						<Conditional showIf={isEditable}>
							<Button disabled={webhookUrl && webhookUrl.length < 1} onClick={handleSaveWebhook} size="small" className="ml-4">
								save
							</Button>
						</Conditional>
						<Conditional showIf={!isEditable}>
							<Button
								disabled={false}
								onClick={() => {
									setIsEditable(true);
								}}
								size="small"
								className="ml-4"
							>
								edit
							</Button>
						</Conditional>
					</div>
				</Conditional>
				<Conditional showIf={!added}>
					<div className="flex items-center">
						<Button
							placeholder="enter the URl"
							onClick={() => {
								setAdded(true);
								setIsEditable(true);
							}}
							size="small"
							className="ml-4"
						>
							+ Add
						</Button>
					</div>
				</Conditional>
			</div>
		</div>
	);
}

const webhookInputCss = (isDisabled: boolean) => css`
	input {
		cursor: ${isDisabled ? "not-allowed" : "auto"};
	}
`;