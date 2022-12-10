import { Button, Logo, Text, TextBlock } from "@dyson/components/atoms"
import { Heading } from "@dyson/components/atoms/heading/Heading"
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip"
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1"
import { css } from "@emotion/react"
import { NextIcon } from "electron-app/src/_ui/constants/icons"
import { HelpContent } from "../../containers/common/stickyFooter"
import { CompactAppLayout } from "../../layout/CompactAppLayout"

 
export const OnboardingWrapper = ()=>{
    return (
        <CompactAppLayout showHeader={false} css={css`background: #0C0C0C;`}>
            <div css={wrappeCSS} className="flex flex-col justify-between">
                <div className="flex justify-between items-center mt-16">
                    <div>
                        <Heading size={1} fontSize={16} color="#B9B9B9">about crusher</Heading>
                        <TextBlock color={"#707070"} fontSize={13} className="mt-8">crusher is all-in-one tool for automation testing</TextBlock>
                    </div>
                    <div className="flex items-center">
                        <Logo height={20} showOnlyIcon={true} isMonochrome={true} className="mr-8"/>
                        <TextBlock color="#949393" fontSize={13} weight={600}>v0.5</TextBlock>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-16">
                    <TextBlock color={"#707070"} fontSize={13} className="mt-8">+ with open source</TextBlock>

                    <Button>
                        <div className="flex items-center">
                            <TextBlock color="#000000" weight={600} className="mt-2 mr-8">next</TextBlock>
                            <NextIcon/>
                        </div>
                    </Button>

                </div>
                <OnboardingFooter/>
            </div>
        </CompactAppLayout>
    )
}

const progressBar = css`
width: 80px;
geight: 8px;

background: #222222;
border: .5px solid #181818;
border-radius: 4px;

#progress{
    width: 20%;
    height:8px;
    background: linear-gradient(180deg, #8D8D8D 0%, #545454 100%);
    border-radius: 3px 0px 0px 3px;
    background: linear-gradient(180deg, #A3D140 0%, #2E7B0A 100%);
}
`

const wrappeCSS = css`
    max-width: 646px;
    height: 100%;
    padding: 26px 20px;
    margin: 0 auto;
`

function OnboardingFooter() {
    return <div className="flex justify-between items-center">
        <HoverCard content={<HelpContent />} placement="top" type="hover" padding={8} offset={0}>
            <Text color="#585858" fontSize={13} onClick={(e) => { e.stopPropagation(); e.preventDefault() } }>
                docs & help
            </Text>
        </HoverCard>

        <div css={progressBar}>
            <div id="progress"></div>
        </div>
    </div>
}

