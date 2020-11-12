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

const RecordLabelIcon = () => {
    return (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path d="M10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21Z" fill="#5B76F7"/>
            <path d="M10.5 19.8569C16.1072 19.8569 20.6875 15.4616 20.9844 9.9285C20.9945 10.1177 21 10.3083 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 10.3083 0.00549698 10.1177 0.0156269 9.9285C0.312498 15.4616 4.8928 19.8569 10.5 19.8569Z" fill="#5B76F7"/>
            <path d="M10.4999 19.2976C5.64116 19.2976 1.70236 15.3588 1.70236 10.5001C1.70236 5.64132 5.64116 1.70251 10.4999 1.70251C15.3587 1.70251 19.2975 5.64132 19.2975 10.5001C19.2975 15.3588 15.3587 19.2976 10.4999 19.2976Z" fill="white"/>
            <path d="M10.4999 18.1545C15.1666 18.1545 18.9839 14.5208 19.2785 9.9285C19.2906 10.1175 19.2975 10.308 19.2975 10.5C19.2975 15.3588 15.3587 19.2976 10.4999 19.2976C5.64117 19.2976 1.70236 15.3588 1.70236 10.5C1.70236 10.308 1.70921 10.1175 1.72135 9.9285C2.01593 14.5208 5.83325 18.1545 10.4999 18.1545Z" fill="#EBE7E7"/>
            <path d="M7.86 13.482H12.896C13.1622 13.482 13.378 13.2662 13.378 13V7.96401C13.378 7.6978 13.1622 7.48201 12.896 7.48201H7.86C7.59378 7.48201 7.37799 7.6978 7.37799 7.96401V13C7.37799 13.2662 7.59381 13.482 7.86 13.482Z" fill="#5B76F7"/>
        </svg>
    );
}

export {NavigateBackIcon, NavigateForwardIcon, NavigateRefreshIcon, RecordLabelIcon};
