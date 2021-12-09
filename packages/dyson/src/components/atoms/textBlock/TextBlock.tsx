import React from "react";
import { css, SerializedStyles } from "@emotion/react";

export type TextBlockProps = {
	fontSize?: number;
	leading?: boolean;
	weight?: number;
	CSS?: SerializedStyles;
	color?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, any>;

const TextDefaultProps = {
	fontSize: 12,
	leading: false,
	weight: 400,
	color: "#fff",
};
/**
 * Crusher Text component.
 */
export const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
	const { children, fontSize, weight, color, className, ...otherProps } = props;
	return (
		<div
			className={`font-gilroy font-${weight} ${className}`}
			css={[
				css`
					font-size: ${fontSize}rem;
					color: ${color};
				`,
				otherProps.CSS,
			]}
			{...otherProps}
		>
			{children}
		</div>
	);
};

TextBlock.defaultProps = TextDefaultProps;
