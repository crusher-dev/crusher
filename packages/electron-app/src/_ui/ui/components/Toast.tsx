import * as React from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, slate, green } from '@radix-ui/colors';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { CloseIcon, CorrectCircleIcon, EditIconV4 } from '../../constants/icons';
import { css } from '@emotion/react';
import { HoverButton } from './hoverButton';
import { TextBlock } from '@dyson/components/atoms';
import { FailedCheckboxIcon } from '../../constants/old_icons';

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
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',

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
const Box = styled('div', {});
const Button = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    size: {
      small: {
        fontSize: 12,
        padding: '0 10px',
        lineHeight: '25px',
        height: 25,
      },
    },
    variant: {
      violet: {
        backgroundColor: 'white',
        color: violet.violet11,
        boxShadow: `0 2px 10px ${blackA.blackA7}`,
        '&:hover': { backgroundColor: mauve.mauve3 },
        '&:focus': { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: green.green2,
        color: green.green11,
        boxShadow: `inset 0 0 0 1px ${green.green7}`,
        '&:hover': { boxShadow: `inset 0 0 0 1px ${green.green8}` },
        '&:focus': { boxShadow: `0 0 0 2px ${green.green8}` },
      },
    },
  },

  defaultVariants: {
    variant: 'violet',
  },
});

const ToastDemo = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <ToastProvider swipeDirection="right">
      <Toast duration={1000 * 60 * 60 * 60} open={open} onOpenChange={setOpen}>
        <ToastTitle>
          <div className={"flex items-center"}>
            <FailedCheckboxIcon css={correctIconCss} />
            <span className={"ml-10"}>couldn't find element</span>
          </div>
        </ToastTitle>
        <ToastAction onClick={(e) => e.preventDefault()} asChild altText="Goto schedule to undo">
          <div className={"flex items-center"}>
            <div className={"flex items-center"} css={actionCss}>
                <div className="px-12 flex items-center">
                  <EditIconV4 css={editIcoNCss}/>
                  <TextBlock css={actionTextCss} fontSize={14} color={"#CC5FFF"} className={"ml-6"}>fix step</TextBlock>
                </div>
            </div>

            <div className={"px-12 pl-10"}>
              <HoverButton>
                <CloseIcon css={css`width: 8rem; height: 8rem;`} />
              </HoverButton>
            </div>

          </div>

        </ToastAction>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

const actionCss = css`height: 100%;border-width: 0px 0.5px;
border-style: solid;
border-color: rgba(255, 255, 255, 0.05);
border-radius: 0px;
:hover {
  background: rgba(255, 255, 255, 0.01);
}
`;
const actionTextCss = css`
  margin-top: 2rem;
`;
const editIcoNCss = css`
  width: 14rem;
  height: 14rem;
`;
const correctIconCss = css`
  width: 14rem;
  height: 14rem;
`;
export default React.memo(ToastDemo);