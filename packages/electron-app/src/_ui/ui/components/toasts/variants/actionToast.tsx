import * as React from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, slate, green } from '@radix-ui/colors';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { CloseIcon, CorrectCircleIcon, EditIconV4 } from '../../../../constants/icons';
import { css } from '@emotion/react';
import { HoverButton } from '../../hoverButton';
import { TextBlock } from '@dyson/components/atoms';
import { FailedCheckboxIcon } from '../../../../constants/old_icons';


const VIEWPORT_PADDING = 25;

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: 'translateX(0)' },
});

const swipeOut = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: 'fixed',
  bottom: "16rem",
  left: "50%",
  display: 'flex',
  flexDirection: 'column',
  padding: VIEWPORT_PADDING,
  gap: 10,
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 2147483647,
  outline: 'none',
});

const StyledToast = styled(ToastPrimitive.Root, {
  backgroundColor: '#0D0D0D',
  borderRadius: 12,
  border: '0.6px solid #222225',
  boxShadow: '0px 0px 0px 5px rgb(0 0 0 / 14%)',

  display: 'grid',
  gridTemplateAreas: '"title action"',
  gridTemplateColumns: 'auto max-content',
  columnGap: 15,
  alignItems: 'center',

  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-state="open"]': {
      animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    '&[data-state="closed"]': {
      animation: `${hide} 100ms ease-in`,
    },
    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))',
    },
    '&[data-swipe="cancel"]': {
      transform: 'translateX(0)',
      transition: 'transform 200ms ease-out',
    },
    '&[data-swipe="end"]': {
      animation: `${swipeOut} 100ms ease-out`,
    },
  },
});

const StyledTitle = styled(ToastPrimitive.Title, {
  gridArea: 'title',
  fontFamily: "Gilroy",
  letterSpacing: "0.03em",
  fontWeight: 500,
  color: `#BCBCBC`,
  fontSize: "14rem",
  padding: 12,
  paddingLeft: 16,
  paddingRight: 16,
});

const StyledDescription = styled(ToastPrimitive.Description, {
  gridArea: 'description',
  margin: 0,
  color: slate.slate11,
  fontSize: 15,
  lineHeight: 1.3,
});

const StyledAction = styled(ToastPrimitive.Action, {
  gridArea: 'action',
  height: "100%",
});

// Exports
export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = StyledViewport;
export const Toast = StyledToast;
export const ToastTitle = StyledTitle;
export const ToastDescription = StyledDescription;
export const ToastAction = StyledAction;
export const ToastClose = ToastPrimitive.Close;

// Your app...

const ActionToast = ({ open, setOpen, duration, message, actions}) => {
    React.useEffect(() => {
      const interval = setTimeout(() => {
        setOpen(false);
      }, duration);

      return () => clearInterval(interval);
    }, []);
    return (
        <Toast open={open} onOpenChange={setOpen}>
            <ToastTitle>
                {message}
            </ToastTitle>
            {actions ? (<ToastAction onClick={(e) => e.preventDefault()} asChild  altText="Goto schedule to undo">
                {actions}
            </ToastAction>): ""}
      </Toast>
    );
}



export { ActionToast };
