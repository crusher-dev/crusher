import React from 'react';
export interface LogoProps {
  onlyIcon: boolean;
  monochrome?: boolean;
  height: 'small'|'medium'|'large';
  /**
   * Emotion CSS style if any
   */
  css?: [string]|string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Unified button component for Dyson UI system
 */
export const Button: React.FC<LogoProps> = ({
  type = "primary",
  bgColor = 'blue',
  size="medium",
  ...props
}) => {
  const mode = type==="primary" ? 'storybook-button--primary' : 'storybook-button--secondary';

  return (
    <button
      type="button"
      className={['storybook-button', 'mt-10',`storybook-button--${size}`, mode].join(' ')}
      {...props}
    >
    </button>
  );
};
