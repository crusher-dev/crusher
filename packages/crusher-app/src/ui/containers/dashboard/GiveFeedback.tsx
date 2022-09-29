import React from "react";
import { Chat } from "@svg/dashboard";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";

import { HoverCard } from "dyson/src/components/atoms/tooltip/Tooltip1";
import { css } from "@emotion/react";
import dynamic from 'next/dynamic'
import { useAtom } from "jotai";
import { userAtom } from "@store/atoms/global/user";
import { useRouter } from "next/router";
const DropdownContent = dynamic(() => import('dyson/src/components/sharedComponets/FeedbackContainer'), {
    ssr: false,
})

export function GiveFeedback() {
    const [user] = useAtom(userAtom)
    const { asPath } = useRouter()

    return (
        <HoverCard wrapperCSS={wrapperCSS} css={userDropdownCSS} content={<DropdownContent
            user={user}
            asPath={asPath}
        />} placement="top-start" type="click" padding={2} offset={0}>

            <div className="flex items-center pt-1" css={feedbackCSS}>
                <Chat className="mr-8" />
                <TextBlock fontSize={12} color="#838383">
                    Give feedback
                </TextBlock>
            </div>
        </HoverCard>
    );
}

const wrapperCSS = css`
    padding-bottom: 10rem;
    padding-left: 20rem;
    min-height:320rem;
    
`

const userDropdownCSS = css`
	margin-left: -12re,;

    padding: 24rem;

    width: 356rem;

 border-radius: 14rem;
`
export const feedbackCSS = css`
	:hover {
		div,
		span {
			color: #fff;
		}
		path {
			fill: #fff;
		}
	}
`;

