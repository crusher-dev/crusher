import { keyframes } from '@stitches/react';
import { slate } from '@radix-ui/colors';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { css } from '@emotion/react';
import { useEffect } from "react";
import { ThunderSVG } from '../../../icons/ThunderSVG';
import { PointerIcon } from '../../../icons/PointerIconSVG';
import { MenuIcon } from '../../../icons/MenuIconSVG';

const VIEWPORT_PADDING = 25;

const animations = {
    hide: keyframes({
        '0%': { opacity: 1 },
        '100%': { opacity: 0 },
    }),
    slideIn: keyframes({
        from: { transform: `translateY(calc(100% + ${VIEWPORT_PADDING}px))` },
        to: { transform: 'translateY(0)' },
    }),
    swipeOut: keyframes({
        from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
        to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
    })
}

const BaseDialogToast = ({ open, setOpen, duration, children, className, ...props }) => {
    useEffect(() => {
        const interval = setTimeout(() => {
          setOpen(false);
        }, duration);
    
        return () => clearInterval(interval);
      }, []);

    return (
        <ToastPrimitive.Root open={open} className={`${className}`} css={toastCss} {...props}>
            <div>
            {children}
            </div>
        </ToastPrimitive.Root>
    )
};

const toastCss = css`
    background: #0D0D0D;
    border-radius: 12rem;
    border: 0.6px solid #222225;
    box-shadow: 0px 0px 0px 5px rgb(0 0 0 / 14%);
    display: grid;
    grid-template-areas: "title action";
    grid-template-columns: auto max-content;
    align-items: center;
    min-width: 420rem;
    overflow: hidden;
    @media (prefers-reduced-motion: no-preference) {
        &[data-state="open"] {
            animation: ${animations.slideIn()} 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        &[data-state="closed"] {
            animation: ${animations.hide()} 100ms ease-in;
        }
        &[data-swipe="move"] {
            transform: translateX(var(--radix-toast-swipe-move-x));
        }
        &[data-swipe="cancel"] {
            transform: translateX(0);
            transition: transform 200ms ease-out;
        }
        &[data-swipe="end"] {
            animation: ${animations.swipeOut()} 100ms ease-out;
        }
    }
`;

const BaseDialogTitle = ({ children, className, ...props }) => {
    return (
        <ToastPrimitive.Title className={`${className}`} css={titleCss} {...props}>
            {children}
        </ToastPrimitive.Title>
    );
};

const titleCss = css`
    font-family: Gilroy;
    letter-spacing: 0.03em;
    padding: 12rem;

    display: flex;
    align-items: center;
    padding: 16rem 16rem 10rem 12rem;
    font-weight: 600;
    font-size: 14rem;
    color: #FFFFFF;
`;

const BaseDialogDescription = ({ children, className, ...props }) => {
    return (
        <ToastPrimitive.Description className={` pl-24 pb-16 ${className}`} css={descriptionCss} {...props}>
            {children}
        </ToastPrimitive.Description>
    );
};

const descriptionCss = css`
    grid-area: description;
    margin: 0;
    color: rgba(156, 156, 156, 1);
    font-size: 12rem;
    line-height: 20rem;
    font-weight: 600;
`;

const BaseDialogActions = ({ children, className, ...props }) => {
    return (
        <div className={`flex ${className}`} css={actionsCss} {...props}>
            {children}
        </div>
    );
};

const actionsCss = css`
    border-top: 0.5px solid rgba(255, 255, 255, 0.05);
`;

const BaseDialogAction = ({ type, children, className, ...props }) => {
    if(type === "retry") {
        return (
            <div className={`flex justify-center ${className}`} css={actionCss} {...props}>
                 retry
            </div>
        );
    };

    if(type === "auto-fix") {
        return (
            <div className={`flex justify-center ${className}`} css={[actionCss, css`flex: 1.5;`]} {...props}>
                    <ThunderSVG css={thunderIconCss}/>
                    <span className={"ml-8"}>Auto-fix</span>
            </div>
        );
    }

    if(type === "link") {
        return (
            <div className={`flex justify-center items-center ${className}`} css={actionCss} {...props}>
                    <span>docs</span>
                    <PointerIcon className={"ml-4"} css={pointerIconCss}/>
            </div>
        );
    }

    if(type === "options") {
        return (
            <div className={`flex justify-center ${className}`} css={[actionCss, css`flex: 0; min-width: 40rem;`]} {...props}>
                    <MenuIcon css={optionsIconCss}/>
            </div>
        );
    }

    return (
        <div className={`flex justify-center ${className}`} css={actionCss} {...props}>
            {children}
        </div>
    );
};

const actionCss = css`
    flex: 1;
    grid-area: action;
    letter-spacing: 0.03em;

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

const thunderIconCss = css`
  width: 10rem;
  height: 12rem;
  position: relative;
  top: -1rem;
`;

const pointerIconCss = css`
	width: 7.3rem;
	height: 7.1rem;
`;

const optionsIconCss = css`
  width: 12rem;
  height: 8rem;
`;

export {
    BaseDialogToast,
    BaseDialogTitle,
    BaseDialogDescription,
    BaseDialogActions,
    BaseDialogAction,
};