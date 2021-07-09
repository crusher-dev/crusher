import React from 'react';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  type?: 'primary'|'secondary'|'tertiary';
  /**
   * What background color to use
   */
  bgColor?: 'blue'|'pink'|'green'|'tertiary-strong'|'tertiary-medium'|'tertiary-light';
  /**
   * Size of the component
   */
  size?: 'small'|'medium'|'large';

  /**
   * Disabled;
   */
  disabled?: boolean;
  /**
   * Emotion CSS style if any
   */
  css?: [string]|string;
  /**
   * Button contents
   */
  children: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Unified button component for Dyson UI system
 */
export const Button: React.FC<ButtonProps> = ({
  type = "primary",
  bgColor = 'blue',
  size="medium",
  children,
  ...props
}) => {
  const mode = type==="primary" ? 'storybook-button--primary' : 'storybook-button--secondary';

  return (
    <button
      type="button"
      className={['storybook-button', 'mt-10',`storybook-button--${size}`, mode].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};
