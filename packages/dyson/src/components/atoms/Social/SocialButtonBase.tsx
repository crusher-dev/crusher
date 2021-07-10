import React from "react";

interface SocialBtnBaseProps {
    children: React.ReactNode
}

export const SocialBtnBase = (props: SocialBtnBaseProps) => {
    return <div className="flex items-center 
    rounded-md text-14 p-10 space-x-20" style={SocialBtnCSS}>
        {props.children}
    </div>
};

const SocialBtnCSS: React.CSSProperties = {
    backgroundColor: "#0F1214",
    borderRadius: "9px",
    border: "1px solid #292F33",
    color: "white",
    fontSize: "14rem",
    width: "fit-content",
    minHeight: "42rem"
}