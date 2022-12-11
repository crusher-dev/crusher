
import { TextBlock } from "@dyson/components/atoms"
import { Heading } from "@dyson/components/atoms/heading/Heading"
import { css } from "@emotion/react"
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { ONBOARDING_STAGE_ATOM } from "..";
import { CTABar, HeaderBlock } from "./Common";

const headingItems = [
    {
        heading: (<>an 
            <span css={css`color: hsl(86, 100%, 63%); weight: 900;`}> IDE/framework</span> {" "}
            to create test</>),
            desc: "alternative to cypress, selenim, etc with low-code",
            emoji: '🚥'
    },  {
        heading: (<> 
            <span css={css`color: #3FBAFF; weight: 900;`}>runner</span>  {" "}
            to run test</>),
            desc: "alternative to cypress, selenim, etc with low-code",
            emoji: '🧰'
    },
    {
        heading: (<> 
            <span css={css`color: #e650ff; weight: 900;`}>app</span>  {" "}
             with batteries to collbaorate</>),
            desc: "alternative to cypress, selenim, etc with low-code",
            emoji: '🏎️'
    }
]

export const WelcomMessageBlock = ()=>{
    const [_, setOnboarding] = useAtom(ONBOARDING_STAGE_ATOM)
    return (
        <div>
         <HeaderBlock title="know about crusher" desc={"crusher is all-in-one tool for automation testing"}/>
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1  }}
    css={box} className="mt-32 py-32 px-40">
            {
                headingItems.map(({heading,emoji,desc})=>{
                    return ( <div>
                        <div className="flex justify-between items-start">
                            <div>  
                                <Heading fontSize={15} showLineHeight={false} color="#CBCBCB" weight={600}>{heading}</Heading>
                                <TextBlock showLineHeight={false} color="#6D6D6D" className="mt-12">{desc}</TextBlock>
                            </div>
                            <TextBlock css={css`font-family: 'EmojiMart1';`} fontSize={20}>{emoji}</TextBlock>
                        </div>
                        <hr className="mt-24 mb-24" css={ruleCSS}/>
                    </div>)
                })
            }

            
    </motion.div>
    <CTABar onClick={setOnboarding.bind(this,1)}/>
    </div>)

}

const ruleCSS = css`
background: rgba(0, 0, 0, 0.11);
border-color: rgb(29 29 29 / 91%);
`

const box = css`

border: 0.4px solid rgba(255, 255, 255, 0.05);
backdrop-filter: blur(8.5px);
width: 580rem;
margin-left: auto; margin-right: auto;
border-radius: 18rem;
div:nth-child(3) > hr{
    display: none;
}
`