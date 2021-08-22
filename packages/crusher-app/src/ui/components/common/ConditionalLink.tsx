import { LinkProps } from "next/link";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

const ConditionalLink = (props: PropsWithChildren<LinkProps> & { disabled: boolean }) => {
	if (props.disabled) return <>{props.children}</>;

	return <Link {...props}>{props.children}</Link>;
};

export { ConditionalLink };
