import React from "react";
import { css } from '@emotion/react';

export type HeadingProps = {
	type: 1 | 2 | 3 | 4 | 5| 6,
	fontSize: string,
	leading: boolean,
	weight: number,
	color: string
}  & React.DetailedHTMLProps<any, any>;

const HeadingDefaultProps = {
	type: 1,
	fontSize: 16,
	leading: false,
	weight: 700,
	color: "#fff"
};

 type BaseHeading = {
	 size: 1 | 2 | 3 | 4 | 5| 6,
}  & React.DetailedHTMLProps<any, any>;

const HeadingElement = ({size, children, ...props}:BaseHeading)=>{

	if(size === 1){
		return <h1 {...props}>{children}</h1>
	}
	if(size === 2){
		return <h2 {...props}>{children}</h2>
	}
	if(size === 3){
		return <h3 {...props}>{children}</h3>
	}
	if(size === 4){
		return <h4 {...props}>{children}</h4>
	}
	if(size === 5){
		return <h5 {...props}>{children}</h5>
	}
		return <h6 {...props}>{children}</h6>
}

/**
 * Crusher Text component.
 */
export const Heading: React.FC<HeadingProps> = (props: HeadingProps) => {
	const {type, children, fontSize, leading ,weight, color, ...otherProps} = props;
	return (

			<HeadingElement size={type} className={`font-cera font-${weight}`} css={css`
font-size: ${fontSize}rem; color: ${color};`} {...otherProps}>
				{children}
			</HeadingElement>
	);
};

Heading.defaultProps = HeadingDefaultProps;
