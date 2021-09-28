import { css } from "@emotion/react";
import ImageSlider from "react-image-comparison-slider";
import { useCallback, useMemo, useState } from "react";
import { hashCode } from "@utils/helpers";

const compareImages = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const compareSection = css`
	img,
	video {
		max-width: none !important;
		height: auto !important;
	}
`;
export function CompareImage({ leftImage, rightImage }) {
	const hash = useMemo(() => {
		return hashCode(leftImage);
	}, []);

	const [resolution, setResolution] = useState({
		height: 4,
		width: 4,
	});

	useMemo(() => {
		setInterval(() => {
			const selected = document.querySelector(`#compare-${hash} img`);

			const imageLoadFunction = (e) => {
				const height = e.target.naturalHeight;
				const width = e.target.naturalWidth;

				const aspectRatio = width / height;

				const optimalHeight = height > 700 ? 700 : height;
				setResolution({
					height: optimalHeight,
					width: optimalHeight * aspectRatio,
				});

				selected.removeEventListener("load", imageLoadFunction);
			};

			if (selected) {
				selected.addEventListener("load", imageLoadFunction);
			}
		}, 300);
	}, []);

	const Component = useCallback(() => {
		return (
			<div style={{ width: resolution.width, height: resolution.height, maxWidth: "100%" }}>
				<ImageSlider image1={leftImage} image2={rightImage} sliderWidth={3} sliderColor="#7068f2" handleColor="#7068f2" handleBackgroundColor="white" />
			</div>
		);
	}, [resolution.height]);

	return (
		<div>
			<div css={compareSection}>
				<div css={compareImages} id={`compare-${hash}`}>
					<div className={"flex justify-between text-14 mt-24 mt-8 mb-20"}>
						<div>Before</div>
						<div>After</div>
					</div>
					<Component />
				</div>
			</div>
		</div>
	);
}

export default CompareImage;
