import React from "react";

type CenterLayoutProps = {
	children: React.ReactNode;
} & Record<any, any>;

/**
 * Just a Layout which centers its children
 */
export const CenterLayout: React.FC<CenterLayoutProps> = ({ children, ...props }) => (
	<div className={`flex justify-center items-center h-full w-full ${props.className}`}>{children}</div>
);
