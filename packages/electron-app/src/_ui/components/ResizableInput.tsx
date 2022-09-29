import React, { useEffect, useState, useRef } from "react";
import { css } from "@emotion/react";
import Input from "@dyson/components/atoms/input/Input";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";

const ResizableInput = React.forwardRef(({ isEditingProp = false, className, value, ...props }, ref) => {
  const [width, setWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(isEditingProp)
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

  React.useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => {
        ref.current.focus();
        ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
      });
    }
  }, [isEditing]);

  React.useEffect(() => {
    setIsEditing(isEditingProp)
  }, [isEditingProp]);

  if (!isEditing) {
    return (<div title="click to edit the name" css={labelCSS} onDoubleClick={setIsEditing.bind(this, true)}>
      {value}
    </div>)
  }
  return (
    <OnOutsideClick onClick={() => {
      setIsEditing(false)
    }}>
      <Input
        onReturn={() => {
          setIsEditing(false)
        }}
        onBlur={() => {
          setIsEditing(false)
        }} title="" initialValue={value} size="small" className={`${className}`} css={inputCss} ref={ref} type="text" {...props} />

    </OnOutsideClick>
  );
});

const labelCSS = css`
  padding-left: 12px;
  font-size: 12px;
  padding-top: 3px;
`


const inputCss = css`
min-width: fit-content;

input{
  padding-right 8px !important;
width: 200px;
margin-left: 2px;
height: 28px;
}
`;
export { ResizableInput };