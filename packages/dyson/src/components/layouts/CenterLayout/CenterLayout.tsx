import React from "react";

export interface CenterLayoutProps {
	children: React.ReactNode;
}

/**
 * Just a Layout which centers its children
 */
export const CenterLayout: React.FC<CenterLayoutProps> = ({ children ,...props}) => {
	return <div className={`flex justify-center items-center h-full ${props.className}`}>{children}</div>;
};
