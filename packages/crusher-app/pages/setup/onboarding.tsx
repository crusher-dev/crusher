import React from "react";
import { CrusherOnboarding } from "@ui/containers/onboarding";
import { css } from "@emotion/react";
 
export default CrusherOnboarding;

const YesNoButtons = ({className, selected, callback, ...props} : { className?: any, selected: any, callback: any }) => {

    const handleSelect = React.useCallback((value) => {
        callback(value);
    }, []);

    return (
        <div css={yesNoButtonContainerCss} className={`${className}`} {...props}>
            <div css={[yesNoButtonCss, selected === "YES" ? selectedButtonCss : undefined]} onClick={handleSelect.bind(this, "YES")}>
                {selected === "YES" ? (<SelectedIcon css={selectedIconCss}/>) : ""}
                <span>Yes</span>
            </div>
            <div css={[yesNoButtonCss, selected === "NO" ? selectedButtonCss : undefined]}  onClick={handleSelect.bind(this, "NO")}>
                {selected === "NO" ? (<SelectedIcon css={selectedIconCss}/>) : ""}
                <span>No</span>
            </div>
        </div>
    )
};

const selectedIconCss = css`width: 12px; height: 12px; position: relative; top: 1.4px;`;

const yesNoButtonContainerCss = css`
    display: flex;
    gap: 12px;
`;

const yesNoButtonCss = css`
    background: linear-gradient(0deg, #151516, #151516), #4D4D4D;
    border: 0.5px solid #9A9A9A;
    border-radius: 23423px;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    text-align: center;

    color: #FFFFFF;
    padding: 6px 4px;
    width: 116px;
    display: flex;
    justify-content: center;

    :hover {
        opacity: 0.8;
    }
`;

const SelectedIcon = (props) => (
    <svg
      viewBox={"0 0 12 12"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 6a6 6 0 1 1 12 0A6 6 0 0 1 0 6Zm8.224-1.624a.6.6 0 0 1 0 .848l-2.21 2.21a.87.87 0 0 1-1.229 0l-1.01-1.01a.6.6 0 1 1 .85-.848l.775.775 1.976-1.975a.6.6 0 0 1 .848 0Z"
        fill="#fff"
      />
    </svg>
  )

  
const selectedButtonCss = css`
    background: rgba(174, 100, 209, 0.9);
    border-color: rgba(174, 100, 209, 1);
    gap: 8px;
    :hover {
        opacity: 1;
    }
`;
