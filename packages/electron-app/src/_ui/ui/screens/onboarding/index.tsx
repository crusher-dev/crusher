import { Text, TextBlock } from "@dyson/components/atoms"
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip"
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1"
import { css } from "@emotion/react"
import { HelpContent } from "../../containers/common/stickyFooter"
import { CompactAppLayout } from "../../layout/CompactAppLayout"
 
export const OnboardingWrapper = ()=>{
    return (
        <CompactAppLayout showHeader={false} css={css`background: #0C0C0C;`}>
            <div css={wrappeCSS} className="flex flex-col justify-between">
                <div>top bar</div>

                <div className="flex justify-between items-center">
                    <HoverCard content={<HelpContent />} placement="top" type="hover" padding={8} offset={0}>
                        <Text color="#585858" fontSize={13} onClick={(e)=>{e.stopPropagation();e.preventDefault()}}>
                                docs & help
                                </Text>
                    </HoverCard>

                    <div css={progressBar}>
                        <div id="progress"></div>
                    </div>
                </div>
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
