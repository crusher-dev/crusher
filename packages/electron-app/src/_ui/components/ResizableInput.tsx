import React, {useEffect, useState, useRef} from "react";
import { css } from "@emotion/react";

const ResizableInput = React.forwardRef(({className, value, ...props}, ref) => {
    const [width, setWidth] = useState(0);
    const span = useRef();

    useEffect(() => {
      requestAnimationFrame(() => {
        setWidth(span.current.offsetWidth);
      });
    }, [value]);
  
    // set width when span is set
    useEffect(() => {
      if (span && span.current) {
        setWidth(span.current.offsetWidth);
      }
    }, [span]);
  
    return (
      <>
        <span css={hideCss} ref={span}>{value}</span>
        <input className={`${className}`} css={inputCss} ref={ref} type="text" value={value} style={{ width }} {...props} />
      </>
    );
});

const hideCss = css`  position: absolute;
opacity: 0;
z-index: -100;
white-space: pre;`;

const inputCss = css`
  box-sizing: content-box;
`;
export { ResizableInput };