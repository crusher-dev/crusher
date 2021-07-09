import React from 'react';

export type HEIGHT_NAMES = "small" | "medium" | "large";
export interface LogoProps {
  onlyIcon: boolean;
  imgEelement: JSX.Element
  monochrome?: boolean;
  height: HEIGHT_NAMES;
  /**
   * Emotion CSS style if any
   */
  css?: [string] | string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Unified button component for Dyson UI system
 */
export const Logo: React.FC<LogoProps> = ({
  imgEelement,
  height,
  ...props
}) => {
  return (
    <div className={`${getClassNameByHeight(height)}`}>
      {imgEelement}
    </div>
  );
};

const getClassNameByHeight = (height: HEIGHT_NAMES) => {
  switch (height) {
    case "small":
      return "h-24";
    case "medium":
      return "h-28";
    case "large":
      return "h-32";
  }
}
