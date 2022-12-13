import { Button, Logo, Text, TextBlock } from "@dyson/components/atoms"
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1"
import { Conditional } from "@dyson/components/layouts"
import { css } from "@emotion/react"
import { atom, useAtom } from "jotai"
import { HelpContent } from "../../containers/common/stickyFooter"
import { CompactAppLayout } from "../../layout/CompactAppLayout"
import { PROJECT_INFO } from "./components/SetupWProjectInfo"
import { COMPLETE_INTEGRATION } from "./components/CompleteIntegration"
import { WelcomMessageBlock } from "./components/WelcomeMessageBlock"
import { useEffect } from "react";

export const ONBOARDING_STAGE_ATOM = atom(3)
    
export const OnboardingWrapper = ()=>{
    const [onboardingStage] = useAtom(ONBOARDING_STAGE_ATOM);
    return (
        <CompactAppLayout showHeader={false} css={css`background: #0C0C0C;`}>
            <div css={wrappeCSS} className="flex flex-col justify-between">
                <Conditional showIf={onboardingStage===0}>  
                    <WelcomMessageBlock/>
                </Conditional>
                <Conditional showIf={onboardingStage===1}>  
                <PROJECT_INFO/>
                </Conditional>

                <Conditional showIf={onboardingStage===3}>  
                <COMPLETE_INTEGRATION/>
                </Conditional>

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
    height:8px;
    background: linear-gradient(180deg, #8D8D8D 0%, #545454 100%);
    border-radius: 3px 0px 0px 3px;
    transition: width .6s;
}
`

const wrappeCSS = css`
    max-width: 646px;
    height: 100%;
    padding: 26px 20px;
    margin: 0 auto;
`

export const contentWrapper = css`
    width: 536px;
    margin-left: auto;  margin-right: auto;
`

function OnboardingFooter() {
    const [stage] = useAtom(ONBOARDING_STAGE_ATOM)
    return <div className="flex justify-between items-center" css={contentWrapper}>
        <HoverCard content={<HelpContent />} placement="top" type="hover" padding={8} offset={0}>
            <Text color="#585858" fontSize={13} onClick={(e) => { e.stopPropagation(); e.preventDefault() } }>
                docs & help
            </Text>
        </HoverCard>

        <div css={progressBar}>
            <div id="progress" css={css`width: ${stage*24}%;`}></div>
        </div>
    </div>
}

