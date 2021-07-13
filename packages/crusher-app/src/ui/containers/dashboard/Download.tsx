import { css } from '@emotion/react';
import { CenterLayout } from 'dyson/src/components/layouts';
import { Button } from 'dyson/src/components/atoms';
import { AppleSVG,  LoadingSVG } from '@svg/dashboard';
import { OverlayTransparent } from 'dyson/src/components/layouts/OverlayTransparent/OverlayTransparent';


/*
	@Note - Extract component overlay to dyson
 */
export function Download() {
	return <OverlayTransparent>
		<CenterLayout>
			<div css={downloadSection} className={"flex flex-col items-center pb-16"}>
				<div><LoadingSVG height={28}/></div>
				<div className={"font-cera text-15 font-500 mt-24"}>
					Opening test creator for you
				</div>
				<div className={"mt-68 text-16 font-600"}>
					If it doesn’t open, download and open test creator
				</div>
				<Button className={"mt-28"} css={css`width: 182rem;`}>
					<div className={"flex items-center"}>
						<AppleSVG className={"mr-12"}/><span className={"mt-2"}>Download dmg</span>
					</div>
				</Button>
				<div className={"mt-28 underline text-13"}>View downloads for other platform</div>
			</div>
		</CenterLayout>
	</OverlayTransparent>;
}

const downloadSection = css`
   color: #D0D0D0 !important;
`