import { css, SerializedStyles } from "@emotion/react";
import React, { ReactPropTypes } from "react";

export type VideoProps = {
	/**
	 * Emotion CSS style if any
	 */
	css?: SerializedStyles;
	url: string;
	autoPlay: boolean;
} & ReactPropTypes;

const VideoComponentSource = {
	autoPlay: false,
};

/**
 * Crusher Video component.
 */
export const VideoComponent: React.FC<VideoProps> = ({ url, autoPlay, css, ...props }) => {
	return (
		<div className="rounded-10" css={[videoStyle, css]}>
			<video controls height={"100%"} autoPlay={autoPlay} {...props}>
				<source src={url} type="video/mp4" />
				Your browser does not support HTML video.
			</video>
		</div>
	);
};

const videoStyle = css`
	background-color: #191e22;
	height: 400rem;
	width: 544rem;
	overflow: hidden;

	video {
		height: inherit !important;
	}
`;

VideoComponent.defaultProps = VideoComponentSource;
