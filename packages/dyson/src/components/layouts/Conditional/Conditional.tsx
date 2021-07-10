import React from "react";

export interface ConditionalProps {
	children: React.ReactNode;
	showIf: boolean;
}

/**
 * A smart way to wrap condition.
 */
export const Conditional: React.FC<ConditionalProps> = ({ children, showIf }) => {
	if (!showIf) return null;
	return <div className="flex justify-center items-center h-full">{children}</div>;
};
