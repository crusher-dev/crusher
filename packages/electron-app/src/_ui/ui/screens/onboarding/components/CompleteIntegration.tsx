
import { Button, TextBlock } from "@dyson/components/atoms"
import { Heading } from "@dyson/components/atoms/heading/Heading"
import { css } from "@emotion/react"
import { motion } from "framer-motion";
import { useAtom,atom } from "jotai";
import { ONBOARDING_STAGE_ATOM } from "..";
import { CTABar, HeaderBlock, IntegrateCTABar } from "./Common";


const isDevAtom = atom(null)
const isLowCodePref = atom(null)
const DevBox = ()=>{
    const [isDev, setIsDec] = useAtom(isDevAtom)
    
    return (
        <div className="flex" css={css`gap: 8px;`}>

        </div>
    )
}

const TestingPreference = ()=>{
    const [isLowCode, setIsDec] = useAtom(isLowCodePref)
    
    return (
        <div className="flex" css={css`gap: 8px;`}>

        </div>
    )
}

const DirSelector = ()=>{
    
    return (
        <div className="flex pointer" css={css`gap: 8px; :hover{text-decoration: underline;}`}>
            <TextBlock color="#B6B6B7">crusher</TextBlock>
        </div>
    )
}

const formItems = [
    {
        heading: (<>setup with CI?</>),
            desc: "we'll customize your experience",
            formComponent: <DevBox/>
    },  {
        heading: (<>Invite team mates</>),
            desc: "you can change it later",
            formComponent: <TestingPreference/>
    },
    {
        heading: (<>Monitor prod</>),
            desc: "run test on production",
            formComponent: <TestingPreference/>
    },
]

export const COMPLETE_INTEGRATION = ()=>{
    const [_, setOnboarding] = useAtom(ONBOARDING_STAGE_ATOM)
    return (
        <div>
          <HeaderBlock title="wooho! you have test" desc={"integrate instantly"}/>
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1  }}
    css={box} className="mt-32 py-32 px-40 mb-44">
            {
                formItems.map(({heading,formComponent,desc})=>{
                    return ( <div>
                        <div className="flex justify-between items-start">
                            <div>  
                                <Heading fontSize={15} showLineHeight={false} color="#CBCBCB" weight={600}>{heading}</Heading>
                                <TextBlock fontSize={12} showLineHeight={false} color="#6D6D6D" className="mt-12">{desc}</TextBlock>
                            </div>
                            <div>
                                {formComponent}
                            </div>
                        </div>
                        <hr className="mt-24 mb-24" css={ruleCSS}/>
                    </div>)
                })
            }

            
    </motion.div>
    <IntegrateCTABar onClick={setOnboarding.bind(this,3)} btnText="setup project"/>
    </div>)

}

const ruleCSS = css`
background: rgba(0, 0, 0, 0.11);
border-color: rgb(29 29 29 / 91%);
`

const box = css`
// background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #070909;
border: 0.4px dashed rgba(255, 255, 255, 0.05);
backdrop-filter: blur(8.5px);
width: 580rem;
margin-left: auto; margin-right: auto;
border-radius: 18rem;
div:nth-child(3) > hr{
    display: none;
}
`