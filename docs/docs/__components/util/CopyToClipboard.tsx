import { css } from "@emotion/css";
import React, { memo, useEffect, useState } from "react";


export const copyToClipboard = (text) => {
    if (window.clipboardData?.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
    }

    if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
            return prompt("Copy to clipboard: Ctrl+C, Enter", text);
        } finally {
            document.body.removeChild(textarea);
        }
    }
};



export const CopyToClipboard = ({ hover,copy="npx crusher.dev" }) => {
    const [copied, setCopied] = useState(false);

    const [internalHover, setHover] = useState(false);
    const listener = () => {
        copyToClipboard(copy);
        setCopied(true);
    };

    useEffect(() => {
        if (hover || internalHover) {
            document.body.addEventListener("click", listener);
        } else {
            document.body.removeEventListener("click", listener);
        }
        setCopied(false);
    }, [hover,internalHover]);
    

    
    return (
        <React.Fragment>
            <div className={clipboardIconContainerStyle}
                
            >
                <ClipboardIcon 
                onMouseOver={setHover.bind(this,true)}
                onMouseOut={setHover.bind(this,false)}
                className={"copy-icon"} className={clipboardIconStyle} />
            </div>

                {(hover || internalHover) && (
                    <div className={hoverCss} id="copy-clipboard">
                        {copied ? "✅ Copied!" : "📋  Copy to clipboard"}
                    </div>
                )}
        
        </React.Fragment>
    );
};


const hoverCss = css`
    position: absolute;
    top: calc(0% - 48px);
    right: calc(0% + 0px);
    font-size: 13.8px;
    background: #0b0b0c;
    padding: 08px 16px;
    border: 0.5px solid #57575745;
    border-radius: 10px;
`;

const clipboardIconContainerStyle = css`
    margin-left: auto;
    user-select: none;
    padding: 6px;
    cursor: pointer;
`;
const clipboardIconStyle = css`
    width: 12px;
    height: 12px;
`;

export const ClipboardIcon = (props) => (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M11.112 0H4.478a.858.858 0 0 0-.857.857V2.87h3.901c.905 0 1.64.735 1.64 1.64v3.838h1.95a.858.858 0 0 0 .857-.857V.857A.858.858 0 0 0 11.112 0Z" fill="snow" fillOpacity={0.22} />
        <path d="M7.522 3.652H.889a.858.858 0 0 0-.858.858v6.633c0 .473.385.857.858.857h6.633a.858.858 0 0 0 .857-.857V4.51a.858.858 0 0 0-.857-.858Z" fill="snow" fillOpacity={0.22} />
    </svg>
);


