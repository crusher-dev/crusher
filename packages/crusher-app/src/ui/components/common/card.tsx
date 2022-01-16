import { css } from "@emotion/react";
import React from "react";

interface ICardProps {
  type: "focus" | "normal";
  children?: any;
}

const Card = (props: any) => {
  return (
    <div css={getCardStyle(props.type)} {...props}>
      {props.children}
    </div>
  )
}

function getCardStyle(type: ICardProps["type"]) {
  if (type === "focus") {
    return focusCard;
  } else {
    // default
    return normalCard;
  }
}

const normalCard = css`
	border: 1px solid rgba(255, 255, 255, 0.09);
	border-radius: 2px;
`;

const focusCard = css`
	border: 1px solid rgba(104, 164, 255, 0.93);
	border-radius: 2px;
	background: #0a0b0c;
`;

export { Card };