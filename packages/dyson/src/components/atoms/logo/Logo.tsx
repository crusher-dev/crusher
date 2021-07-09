import React from 'react';

export enum HEIGHT_NAMES {
  small = "small",
  medium = "medium",
  large = "large"
};
export interface LogoProps {
  onlyIcon: boolean;
  monochrome?: boolean;
  height: HEIGHT_NAMES;
  ImgEelement: JSX.Element
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
  ImgEelement,
  height,
  ...props
}) => {
  return (
    <div className={`${getClassNameByHeight(height)}`}>
      {ImgEelement}
    </div>
  );
};

const getClassNameByHeight = (height: HEIGHT_NAMES) => {
  switch (height) {
    case HEIGHT_NAMES.small:
      return "h-24";
    case HEIGHT_NAMES.medium:
      return "h-28";
    case HEIGHT_NAMES.large:
      return "h-32";
  }
}
