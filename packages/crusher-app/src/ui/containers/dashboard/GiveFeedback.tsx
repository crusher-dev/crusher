import React, { useState } from "react";
import { AngryFace, Chat, CryFace, ExcitedFace, HappyFace } from "@svg/dashboard";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { feedbackCSS } from "../../layout/DashboardBase";
import { HoverCard } from "dyson/src/components/atoms/tooltip/Tooltip1";
import { css } from "@emotion/react";
import { Button } from "dyson/src/components/atoms";

export function GiveFeedback() {
    return (
        <HoverCard wrapperCSS={wrapperCSS} css={userDropdownCSS} content={<DropdownContent />} placement="top-start" type="click" padding={2} offset={0}>

            <div className="flex items-center pt-1" css={feedbackCSS}>
                <Chat className="mr-8" />
                <TextBlock fontSize={12} color="#838383">
                    Give feedback
                </TextBlock>
            </div>
        </HoverCard>
    );
}

const emojiMap = [
    { label: 'happy', emoji: HappyFace },
    { label: 'excited', emoji: ExcitedFace },
    { label: 'angry', emoji: AngryFace },
    { label: 'cry', emoji: CryFace },
]

function DropdownContent() {

    const [selectedEmoji, setSelectedEmoji] = useState(null)
    return (
        <div className={"flex flex-col justify-between h-full"}>

            <div>
                <div className="flex justify-between">
                    <TextBlock color="#454545" showLineHeight={true}>
                        your current mood?
                    </TextBlock>
                    <div className="flex" css={emojiBox}>
                        {emojiMap.map(({ emoji, label }) => {
                            const Emoji = emoji;
                            const isSelected = label === selectedEmoji;
                            return (
                                <Emoji css={[emojiCSS, isSelected && selectedEmojiCSS]} onClick={setSelectedEmoji.bind(this, label)} />
                            )
                        })}

                    </div>

                </div>
                <textarea css={textareaCSS} className={"mt-20 mb-20"} placeholder="what’s your feedback? 🥪" />
                <div className="flex justify-between">
                    <Button bgColor={"tertiary"} css={cancel}>
                        <div className={"flex items-center"}>

                            <span className="mt-1">
                                cancel
                            </span>
                        </div>
                    </Button>

                    <Button bgColor={"tertiary"} css={[cancel, submit]}>
                        <div className={"flex items-center"}>

                            <span className="mt-1">
                                submit
                            </span>
                        </div>
                    </Button>
                </div>
            </div>
            <TextBlock color="#454545" showLineHeight={true} className="mt-20">
                for expedited response, <br />
                join #support on discord, github
            </TextBlock>
        </div >
    );
}

const emojiBox = css`
    gap: 12rem;
`
const selectedEmojiCSS = css`
opacity: 1;
`

const emojiCSS = css`
    zoom: 1.2;
    opacity: .65;
    :hover{
        opacity: 1;
    }
`
const textareaCSS = css`
width: 301rem;
height: 120rem;
left: 28rem;
top: 68rem;

background: rgba(217, 217, 217, 0.04);
border: 0.5rem solid #232323;
border-radius: 12rem;

padding: 14rem;
`

const submit = css`

background: #A742F7;
border: 1rem solid #7D41AD;
border-radius: 8rem;

:hover{
	background: #A742F7;
	filter: brighntess(.7);
	border: 1rem solid #7D41AD;
}
`

const cancel = css`
	padding: 0 10rem;

	font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13rem;

color: #FFFFFF;

width: max-content;


background: #101010;
border: 0.5rem solid rgba(94, 94, 94, 0.16);
border-radius: 8rem;

:hover{
    color: #fff;
    background: #1D1D1D;
	filter: brighntess(.7);
	border: 0.5rem solid rgba(94, 94, 94, 0.16);
}
`

const wrapperCSS = css`
    padding-bottom: 10rem;
    padding-left: 20rem;
`

const userDropdownCSS = css`
	margin-left: -12re,;

    padding: 28rem;

    width: 356rem;

 border-radius: 14rem;
`