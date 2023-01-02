import React from "react";
import { css, SerializedStyles } from "@emotion/react";

export type TextProps = {
	/**
	 * Emotion CSS style if any
	 */
	fontSize: number;
	leading?: string;
	weight?: number;
	letterSpacing?: boolean;
	CSS?: SerializedStyles;
	color?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, any>;

const TextDefaultProps = {
	fontSize: 12,
	showLineHeight: false,
	weight: 400,
	color: "#fff",
};

const getLetterSpacing = (fontSize: number) => {
	if (fontSize < 12) {
		return { letterSpacing: `.5px` };
	}

	if (fontSize < 13) {
		return { letterSpacing: `.4px` };
	}

	if (fontSize < 14) {
		return { letterSpacing: `.35px` };
	}
	if (fontSize <= 15) {
		return { letterSpacing: `.3px` };
	}

	return { letterSpacing: `0` };
};
/**
 * Crusher Text component.
 */
export const Text: React.FC<TextProps> = React.forwardRef((props: TextProps,ref) => {
	const { children, fontSize, weight, className, color, letterSpacing = true, ...otherProps } = props;
	return (
		<span
			className={`font-gilroy font-${weight} ${className}`}
			ref={ref}
			css={css`
				font-size: ${fontSize}rem;
				color: ${color};
				${otherProps.onClick && `cursor:default;`}
				letter-spacing: ${!!letterSpacing ? getLetterSpacing(fontSize).letterSpacing : "0"}
			`}
			{...otherProps}
		>
			{children}
		</span>
	);
});

Text.defaultProps = TextDefaultProps;
