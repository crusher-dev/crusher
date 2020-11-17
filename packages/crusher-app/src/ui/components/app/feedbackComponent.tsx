import React, {useState} from "react";
import {css} from "@emotion/core";

const normalImageUrl = "/svg/dashboard/feedback.svg"
const hoverImageUrl = "/svg/dashboard/feedback_hover.svg"
export const FeedbackComponent = ()=>{
    const [imgUrl, setImgUrl] = useState(normalImageUrl)
    return(
        <img src={imgUrl} css={feedbackCss} onMouseEnter={setImgUrl.bind(this,hoverImageUrl)} onMouseLeave={setImgUrl.bind(this,normalImageUrl)}/>
    )
}
const feedbackCss = css`
    position: fixed;
    bottom: 0;
    right: 0;
    height: 6rem;
    width: 10rem;
    cursor: pointer;
}
`;