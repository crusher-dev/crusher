import * as React from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, slate, green } from '@radix-ui/colors';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { CloseIcon, EditIconV4 } from '../../../../constants/icons';
import { css } from '@emotion/react';
import { HoverButton } from '../../hoverButton';
import { TextBlock } from '@dyson/components/atoms';
import { FailedCheckboxIcon } from '../../../../constants/old_icons';
import { LinkPointer } from '../../LinkPointer';


const VIEWPORT_PADDING = 25;

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateY(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: 'translateY(0)' },
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
  alignItems: 'center',
  minWidth: "420rem",
  overflow: "hidden",

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

const WhyIcon = (props) => (
  <svg
    viewBox={'0 0 15 15'}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.968 4.264c.846-.74 2.218-.74 3.064 0 .846.74.846 1.94 0 2.68-.147.13-.31.236-.484.32-.538.26-1.047.721-1.047 1.32v.541M14 7.5a6.5 6.5 0 1 1-12.998 0A6.5 6.5 0 0 1 14 7.5Zm-6.5 3.792h.006v.005H7.5v-.005Z"
      stroke="#585858"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MenuIcon = (props) => (
  <svg
    viewBox={"0 0 12 8"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.531.938a.656.656 0 1 1 1.313 0 .656.656 0 0 1-1.313 0Zm2.844 0A.437.437 0 0 1 3.813.5h7a.438.438 0 0 1 0 .875h-7a.437.437 0 0 1-.438-.438ZM.531 4a.656.656 0 1 1 1.313 0A.656.656 0 0 1 .53 4Zm2.844 0a.437.437 0 0 1 .438-.438h7a.438.438 0 0 1 0 .876h-7A.437.437 0 0 1 3.374 4ZM.531 7.063a.656.656 0 1 1 1.313 0 .656.656 0 0 1-1.313 0Zm2.844 0a.437.437 0 0 1 .438-.438h7a.438.438 0 0 1 0 .875h-7a.437.437 0 0 1-.438-.438Z"
      fill="#DBDBDB"
    />
  </svg>
)

const ThunderSVG = (props) => (
  <svg
    viewBox={"0 0 9 12"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.807.797a.375.375 0 0 1 .18.426l-.996 3.652h3.634a.375.375 0 0 1 .274.63l-5.25 5.626a.375.375 0 0 1-.636-.355l.996-3.651H.375a.375.375 0 0 1-.274-.631L5.351.869a.375.375 0 0 1 .456-.072Z"
      fill="#AB40FF"
    />
  </svg>
)
const RetryIcon = (props) => (
  <svg
    viewBox={"0 0 13 12"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.786 9.713A5.25 5.25 0 0 0 11.57 7.36a.438.438 0 0 0-.845-.226 4.375 4.375 0 0 1-7.32 1.962l-.61-.61m-.009 1.228.01-1.228m-.01 1.228-.608-.608m.608.608-.608-.608m.618-.62-.5-.5m.5.5h-.5v-.5m0 0h.707l-.353-.353-.354.353Zm-.118 1.12v-.5h-.5m.5.5-.5-.5m0 0-.354.353.354.354v-.707Zm9.41-1.375-.362-.097.421.113m-.06-.016.06.016m-.06-.016.06.016m-.06-.016a4.75 4.75 0 0 1-3.358 3.36A4.75 4.75 0 0 1 3.14 9.36H3.14L2.03 8.25l-.64-.64m9.696-.38a.063.063 0 0 0 .045.076l.024.001a.062.062 0 0 0 .052-.045l-.06-.017m-.06-.016.06.016M1.39 7.61h2.763a.062.062 0 1 1 0-.125H1.266m.124.125h-.087V7.7m.087-.089-.125-.125m0 0L1.24 7.46l-.062-.062v.087m.087 0h-.087m0 0h-.089l.063.063.026.026m0-.089v.089m0 0v2.886a.062.062 0 1 1 .125 0V7.699m-.125-.125.125.125m0 0 .64.64 1.108 1.11h.001a4.875 4.875 0 0 0 4.709 1.262 4.876 4.876 0 0 0 3.447-3.448m0 0 .362.096-.362-.097m0 0-.06-.016m.06.017-.06-.017m.06.016-.06-.016m-9.72-2.604Z"
      fill="#DBDBDB"
      stroke="#DBDBDB"
    />
  </svg>
)



const ActionToast = ({ open, setOpen, duration, message, actions }) => {
  React.useEffect(() => {
    const interval = setTimeout(() => {
      setOpen(false);
    }, duration);

    return () => clearInterval(interval);
  }, []);
  return (
    <Toast open={open} onOpenChange={setOpen}>
      <div>
        <div className={"flex items-center px-12 py-16 pb-8 pr-16"}>
          <ToastTitle css={css`padding: 0rem !important;`}>
            <span css={titleCss}>{message}</span>
          </ToastTitle>
          <WhyIcon css={whyIconCss} className={"ml-auto"} />
        </div>

        <ToastDescription className={"pl-38 mt-2 pb-16"} css={descriptionCss}>
          We found new value. you might need to update it<br />
          This can be because of <span css={highlightCss}>DNS</span> error
        </ToastDescription>
        <div className="flex" css={css`border-top: 0.5px solid rgba(255, 255, 255, 0.05);`}>
          <ToastAction css={actionItemCss} onClick={(e) => e.preventDefault()} asChild altText="aasdas">
            <div className={"flex justify-center"} css={actionTextCss}>
              <div  css={actionTextCss}>retry</div>
            </div>
          </ToastAction>
          <ToastAction css={[actionItemCss, css`flex: 1.5;`]} onClick={(e) => e.preventDefault()} asChild altText="aasdas">
            <div className={"flex justify-center"} css={[actionTextCss, css`color: #AB40FF;`]}>
              <ThunderSVG css={thunderIconCss}/>
              <span className={"ml-8"}>Auto-fix</span>
            </div>
          </ToastAction>
          <ToastAction css={actionItemCss} onClick={(e) => e.preventDefault()} asChild altText="aasdas">
            <LinkPointer css={css`:hover { border-radius: 0rem; }; justify-content: center; color: #676767;`}>docs</LinkPointer>
          </ToastAction>
          <ToastAction css={[actionItemCss, css`flex: 0;min-width: 40rem; height: 26rem;`]} onClick={(e) => e.preventDefault()} asChild altText="aasdas">
            <div className={"flex items-center justify-center"} css={css`height: 100%; position: relative; top: -1rem;`}><MenuIcon css={optionsIconCss}/></div>
          </ToastAction>
        </div>
      </div>


    </Toast>
  );
}

const retryIconCss = css`
  width: 13rem;
  height: 12rem;
`;
const thunderIconCss = css`
  width: 10rem;
  height: 12rem;
  position: relative;
  top: -1rem;
`;

const optionsIconCss = css`
  width: 12rem;
  height: 8rem;
`;

const actionItemCss = css`
  text-align: center;
  flex: 1;
  padding: 8rem 0rem;
  padding-bottom: 6rem;
  border-right: 0.5px solid rgba(255, 255, 255, 0.05);
  font-size: 13rem;
  font-weight: 600;

  :hover {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #151516;
  }
`;
const actionTextCss = css`
  letter-spacing: 0.03em;
`;
const whyIconCss = css`
  width: 18rem;
  height: 18rem;
  position: relative;
  top: -3rem;
`;
const highlightCss = css`
  color: rgba(210, 65, 117, 1);
`;

const titleCss = css`
    font-weight: 600;
    font-size: 16rem;
    letter-spacing: 0.03em;
    color: #FFFFFF;
    padding-bottom: 10rem;
`;
const descriptionCss = css`
    color: rgba(156, 156, 156, 1);
    line-height: 20rem;
    font-size: 12rem;
    font-weight: 600;
`;

export { ActionToast };
