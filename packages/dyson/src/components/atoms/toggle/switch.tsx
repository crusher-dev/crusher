import React from 'react';
import { styled } from '@stitches/react';
import { blackA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { css } from "@emotion/react";


const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 42,
  height: 24,
  backgroundColor: blackA.blackA9,
  borderRadius: '9999px',
  position: 'relative',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&:focus': { boxShadow: `0 0 0 2px black` },

});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 19,
  height: 19,
  backgroundColor: 'white',
  borderRadius: '9999px',
  boxShadow: `0 2px 2px ${blackA.blackA7}`,
  transition: 'transform 100ms',
  transform: 'translateX(3px)',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(20px)' },
});

// Exports
export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;


const SwitchComponent = (props: any) => {
  const { disabled = false, size = "small", css } = props;
  const isSmall = size === "small";

  return (
    <Switch disabled={disabled} id="s1" css={[css, switchBackground, disabled && disabledCSS,
      isSmall && smallSize.switch
    ]} {...props}>
      <SwitchThumb css={[isSmall && smallSize.thumb]} />
    </Switch>
  );
}

export default SwitchComponent;

const smallSize = {
  switch: css`
  width: 32px;
  height: 18px;
  `,
  thumb: css`
  width: 14px;
  height: 14px;
  &[data-state="checked"] {
    transform: translateX(15px);
  }

  `
}

const switchBackground = css`background: #343538;
      &[data-state="checked"]{
          background: #A843F6;
      }
`

const disabledCSS = css`
      opacity: .8;
`
export type ToggleProps = {
  checked?: boolean;
  onCheckedChange?: (state: boolean) => void;
  defaultChecked?: boolean;

  size?: 'small' | 'medium';
  disabled?: boolean;
  name?: string;
  className?: any;
} & React.DetailedHTMLProps<any, any>;