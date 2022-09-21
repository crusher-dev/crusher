import React from "react";
import { css } from "@emotion/react";
import { contentContainerScroll } from "@ui/layout/DashboardBase";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { LinkBlock } from "dyson/src/components/atoms/Link/Link";

export function TutorialContent({ setLessionIndex, lessonIndex }: any): JSX.Element {
    return <div className={"flex flex-row mt-28 justify-center"}>
        <div css={contentContainerScroll}>

            <Content
                setLessionIndex={setLessionIndex}
                heading="Creating first test"
                desc=" Crusher required apps to create and run test locally. It’s made primarily for devs, althoug people familiar with devterm like HTML, basic JS can also use it"
            />

        </div>

    </div>;
}
function Content(props) {
    const { heading, desc, setLessionIndex } = props
    return <div className="flex">
        <div css={videoBlock} className={"mr-44"}>

            <iframe width="100%" height="360" src="https://www.loom.com/embed/c6bad79bd3e74d64ad522550c04f97f8?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        </div>
        <div>
            <LinkBlock type="plain" css={tutorialBack} onClick={setLessionIndex.bind(this, null)}>go back</LinkBlock>
            <TextBlock weight={600} fontSize={18} color="#898989" className="mb-20">{heading}</TextBlock>
            <TextBlock weight={400} fontSize={13} color="#464646" showLineHeight={true} className="mb-70">
                {desc}
            </TextBlock>

            <TextBlock weight={400} fontSize={13} color="#464646" className="mb-10">
                Use Crusher With
            </TextBlock>
            <TextBlock weight={400} fontSize={13} color="#464646" className="mb-10">
                CLI
            </TextBlock>
            <TextBlock weight={400} fontSize={13} color="#464646">
                CLI
            </TextBlock>
        </div>
    </div>;
}



export const videoBlock = css`
width: 570px;
height: 360px;

overflow:hidden;

background: rgba(0, 0, 0, 0.19);
border: 1px solid #1F1F1F;
border-radius: 20px;
`
export const tutorialBack = css`
color: #5E5E5E;
font-size: 13rem;
margin-left: -12rem;
margin-top: 10rem;
margin-bottom: 12rem;
`
