import { css } from "@emotion/react"
import { LoadingSVG } from "dyson/src/components/sharedComponets/svg/emoji";

export const LoadingComponent = ({ css, className, ...props }) => {
    return (
        <div css={[loadingSVGCSS, css]} className={`flex items-center ${className}`}>
            <LoadingSVG className="mr-8" />loading...
        </div>
    )
}


const loadingSVGCSS = css`
border-radius: 8rem;
background: #0D0E0E;
border: 0.6px solid #222225;
box-shadow: 0px 0px 0px 5px rgb(0 0 0 / 34%);
color: #D1D5DB;
padding: 8rem 10rem;
font-size: 13.4rem;
letter-spacing: .2px;
background: #161719;
position: absolute;
left: 50%;

transform:  translateX( -84rem);
transform:  translateX(calc(-56rem - 28rem));

`