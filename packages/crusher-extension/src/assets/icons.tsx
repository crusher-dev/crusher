import React from "preact/compat";

interface NavigateIconProps {
    onClick: () => any,
    disabled: boolean;
};

const NavigateBackIcon = (props: NavigateIconProps) => {
    const {disabled, onClick} = props;

    return (
            <svg fill={!disabled ? "#fff" : "#5F6368"} viewBox="0 0 24 24" width={24} height={24} onClick={onClick}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
    );
}

const NavigateForwardIcon = (props: NavigateIconProps) => {
    const {disabled, onClick} = props;

    return (
        <svg fill={!disabled ? "#fff" : "#5F6368"} style={{transform: "rotate(180deg)"}} viewBox="0 0 24 24" width={24} height={24} onClick={onClick}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
    );
}

const NavigateRefreshIcon = (props: NavigateIconProps) => {
    const {disabled, onClick} = props;

    return (
        <svg fill={!disabled ? "#fff" : "#5F6368"} viewBox="0 0 24 24" width="24" height="24" onClick={onClick}>
            <g>
                <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </g>
        </svg>
    );
}
export {NavigateBackIcon, NavigateForwardIcon, NavigateRefreshIcon};
