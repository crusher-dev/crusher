import { css } from "@emotion/react";
import React from "react";
import { useCallback, useMemo, useState } from "react";
import { useEffect } from "react";

import useSWR from "swr";

import { Button } from "dyson/src/components/atoms";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";
import { OverlayTransparent } from "dyson/src/components/layouts/OverlayTransparent/OverlayTransparent";

import { RELEASE_API } from "@constants/api";
import { LINUX_INFO, OS, OS_INFO } from "@constants/app";
import { AppleSVG, LoadingSVG } from "@svg/dashboard";
import { getOSType } from "@utils/common";
import CreateTestPrompt from "../tests/CreateTestPrompt";

/*
	@Note - Extract component overlay to dyson
 */
export function Download({ onClose }: { onClose: Function }) {
	const [time, setTime] = useState(2);

	return (
		<OverlayTransparent onClose={onClose}>
			<CenterLayout>
				<CreateTestPrompt css={ css`margin-top: -160rem;`} />

			</CenterLayout>
		</OverlayTransparent>
	);
}

const downloadSection = css`
	color: #d0d0d0 !important;
`;

export default Download;
