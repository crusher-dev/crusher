import ReactCompareImage from 'react-compare-image';
import { css } from '@emotion/react';

const compareImages = css`
	width: 520px;
	max-height: 900px;
`

const compareSection = css`
  background: #181B1E;
  border-radius: 12px;
  overflow: hidden;
  //max-height: 900px;
	display: flex;
	justify-content: center;
  margin: 12px 0 80px 0;
	width: 100%;
	height: 40px;
`
export function CompareImage({leftImage,rightImage}) {
	return (
		<div>
			<div className={"flex justify-between text-14 mt-24 mt-8"}>
				<div>Before</div>
				<div>After</div>
			</div>
			<div css={compareSection}>


				<div css={compareImages}>
					<ReactCompareImage sliderLineColor={"#6074DE"} hover leftImage={leftImage} rightImage={rightImage} aspectRatio={"taller"} />
				</div>
			</div>
		</div>
	);
}

export default CompareImage;