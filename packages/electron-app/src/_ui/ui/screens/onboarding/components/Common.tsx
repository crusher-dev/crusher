import { Button, Logo, Text, TextBlock } from "@dyson/components/atoms"
import { Heading } from "@dyson/components/atoms/heading/Heading"
import { contentWrapper } from ".."
import { NextIcon, RerunIcon } from "electron-app/src/_ui/constants/icons"
import { css } from "@emotion/react"
import { LinkBox } from "../../../components/LinkBox"
import { useAtom } from "jotai"
import { isDevAtom, isLowCodePref } from "./SetupWProjectInfo"

export const HeaderBlock = ({title,desc})=>{
    return (
        <div className="flex justify-between items-center mt-24" css={contentWrapper}>
        <div>
            <Heading size={1} fontSize={15} color="#B9B9B9">{title}</Heading>
            <TextBlock color={"#707070"} fontSize={13.5} className="mt-10">{desc}</TextBlock>
        </div>
        <div className="flex items-center">
            <Logo height={20} showOnlyIcon={true} isMonochrome={true} className="mr-8"/>
            <TextBlock color="#949393" fontSize={11} weight={600}>v0.5</TextBlock>
        </div>
    </div>
    )
}

export const CTABar = ({onClick, isDisabled = false, btnText= "next"})=>{
    const [isDev, setIsDev] = useAtom(isDevAtom);
    const [isLowCode, setIsLowCode] = useAtom(isLowCodePref);

    
    return (
        <div className="flex justify-between items-center mt-32" css={contentWrapper}>
        <TextBlock color={"#707070"} fontSize={13} className="mt-8" css={css`letter-spacing: .9px !important;`}>💟 + with open source</TextBlock>
        <Button disabled={isDisabled} onClick={onClick}>
            <div className="flex items-center">
                <TextBlock fontSize={13} color="#fff" weight={600} className="mt-1 mr-8">{btnText}</TextBlock>
                <NextIcon/>
            </div>
        </Button>
    </div>
    )
}


export const IntegrateCTABar = ({onClick,btnText= "next"})=>{
    return (
        <div className="flex justify-between items-center mt-32" css={contentWrapper}>
        <Button onClick={onClick} bgColor={"secondary-cyan"} >
            <div className="flex items-center">
                <RerunIcon height={14} css={css`margin-left: -4rem;`}/>
                <TextBlock fontSize={13} color="#000000" weight={600} className="mt-1 ml-2">run test again</TextBlock>  
            </div>
        </Button>

        <TextBlock color="#3D3D3D" fontSize={13}>skip</TextBlock>
        <Button onClick={onClick}>
            <div className="flex items-center">
                <TextBlock fontSize={13} color="#fff" weight={600} className="mt-1 mr-8">{btnText}</TextBlock>
                <NextIcon/>
            </div>
        </Button>
    </div>
    )
}

