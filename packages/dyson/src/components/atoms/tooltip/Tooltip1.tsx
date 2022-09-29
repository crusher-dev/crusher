import ReactDOM from "react-dom";
import { css, SerializedStyles } from "@emotion/react";
import { useFloating, shift, offset } from "@floating-ui/react-dom";
import React, { ReactElement, useState, useEffect, useMemo, useRef, SyntheticEvent, useCallback } from "react";


export type TooltipWrapperProps = {
    type?: "click" | "hover";
    placement:
    | "top-start"
    | "top-end"
    | "right-start"
    | "right-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "left"
    | "bottom"
    | "top"
    | "right";
    autoHide?: boolean;
    callback?: Function;
    content: ReactElement;
    children: any;
    padding: number;
    offset: number;
    timer?: any;
    wrapperCSS?: SerializedStyles;
    css?: SerializedStyles;
} & React.DetailedHTMLProps<any, any>;

export const TooltipBox = ({ children, className = "tooltip-box", el = "div" }) => {
    const [container] = React.useState(() => {
        return document.createElement(el);
    });

    React.useEffect(() => {
        container.classList.add(className);
        document.body.appendChild(container);
        return () => {
            document.body.removeChild(container);
        };
    }, []);

    return ReactDOM.createPortal(children, container);
};

/**
 * Unified tolltip component for Dyson UI system
 */
export const HoverCard: React.FC<TooltipWrapperProps> = ({ children, state, onStateChange, autoHide = "true", timer = 0, placement, type, content, padding = 0, className, disabled = false, ...props }) => {
    const [show, setShow] = useState(false);
    const { offset: offsetWrapper = 8 } = props;
    const { x, y, reference, floating, update, strategy, refs } = useFloating({
        placement,
        strategy: "fixed",
        middleware: [shift(), offset(offsetWrapper)],
    });


    const { wrapperCSS, callback } = props;
    const eventListener = () => {
        if (type === "hover") {
            return {
                onMouseOver: () => {
                    setShow(true);
                    !!callback && callback(true);
                },
                onMouseLeave: (e) => {
                    const isElement = e.relatedTarget instanceof Element;
                    const movedToToolip = (isElement && refs.floating?.current?.contains(e.relatedTarget)) || refs.floating.current === e.relatedTarget;
                    if (movedToToolip) return;
                    if (autoHide) {
                        setShow(false);
                        !!callback && callback(false);
                    }
                },
            };
        }

        return {
            onClick: (e) => {
                setShow(true);
                !!callback && callback(true);
            },
        };
    };

    const ClonedElement = useCallback(() => {
        return React.cloneElement(children, {
            ref: reference,
            ...eventListener(),
        });
    }, [children]);

    // Show/Hide if props is updated
    useEffect(() => {
        setShow(state);
    }, [state]);

    useEffect(() => {
        // callback && callback(show);
        update();
        if (type !== "click" || autoHide === false) return;
        const handleClick = (e: any) => {
            const isChildrenClick = refs.reference?.current?.contains(e.target) || refs.reference.current === e.target;
            const isTooltipClick = refs.floating?.current?.contains(e.target) || refs.floating.current === e.target;

            if (isChildrenClick || isTooltipClick) {
                return
            }
            else {
                setShow(false);
                !!callback && callback(false);
            }

        };
        window.addEventListener("click", handleClick, { capture: true });

        return () => {
            window.removeEventListener("click", handleClick, { capture: true });
        };
    }, [callback, show]);



    return (
        <React.Fragment>
            <ClonedElement />
            {show && !disabled && (
                <TooltipBox>
                    <div
                        css={[tooltipWrapper(padding), wrapperCSS]}
                        ref={floating}
                        style={{
                            position: strategy,
                            top: y ?? "",
                            left: x ?? "",
                        }}
                        onMouseOver={eventListener().onMouseOver}
                        onMouseLeave={eventListener().onMouseLeave}
                    >
                        <div css={[tooltipBox, props.css]} className={className}>
                            {content}
                        </div>
                    </div>
                </TooltipBox>
            )}
        </React.Fragment>
    );
};

const tooltipWrapper = (padding) => css`
	position: fixed;
	z-index: 123123123;
	padding: 0px;
	-webkit-animation: fadeIn 1s;
	animation: fadeIn 0.25s;
	padding: ${padding}px;
	@-webkit-keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

const tooltipBox = css`

	 border-radius: 10rem;


	color: #D1D5DB;
	padding: 8rem;
	font-size: 13.4rem;
	letter-spacing: .2px;


	position: relative;


background: #0D0E0E;
border: 1px solid #1C1C1C;
box-shadow: 0px -1px 9px #000000;
border-radius: 10px;




`;
