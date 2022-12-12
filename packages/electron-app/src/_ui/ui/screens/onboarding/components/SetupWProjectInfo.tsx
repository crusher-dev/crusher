
import { Button, TextBlock } from "@dyson/components/atoms"
import { Heading } from "@dyson/components/atoms/heading/Heading"
import { css } from "@emotion/react"
import { goFullScreen, performReplayTest, performSteps } from "electron-app/src/ipc/perform";
import { motion } from "framer-motion";
import { useAtom,atom } from "jotai";
import { useNavigate } from "react-router-dom";
import { ONBOARDING_STAGE_ATOM } from "..";
import { CTABar, HeaderBlock } from "./Common";

import React from "react";
import { updateUserMetaRequest } from "electron-app/src/api/user/user.requests";
import axios from "axios";
import { updateProjectMeta } from "electron-app/src/api/projects/integrations";
import { useUser } from "electron-app/src/_ui/hooks/user";
import { useStore } from "react-redux";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { devices } from "electron-app/src/devices";

export const isDevAtom = atom(null)
export const isLowCodePref = atom(null)
const DevBox = ()=>{
    const [isDev, setIsDec] = useAtom(isDevAtom)
    
    return (
        <div className="flex" css={css`gap: 8px;`}>
            <Button size="x-small" bgColor={isDev === true ? "tertiary-white" : "tertiary-dark"} onClick={setIsDec.bind(this,true)}>yes</Button>
             <Button size="x-small" bgColor={isDev === false ? "tertiary-white" : "tertiary-dark"} onClick={setIsDec.bind(this,false)}>no</Button>
        </div>
    )
}

const TestingPreference = ()=>{
    const [isLowCode, setIsDec] = useAtom(isLowCodePref)
    
    return (
        <div className="flex" css={css`gap: 8px;`}>
            <Button size="x-small" bgColor={isLowCode === true ? "tertiary-white" : "tertiary-dark"} onClick={setIsDec.bind(this,true)}>code</Button>
             <Button size="x-small" bgColor={isLowCode === false ? "tertiary-white" : "tertiary-dark"} onClick={setIsDec.bind(this,false)}>low-code</Button>
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
        id: "isDev",
        heading: (<>are you a dev?</>),
            desc: "we'll customize your experience",
            formComponent: <DevBox/>
    },  {
        id: "testingPreference",
        heading: (<>testing preference</>),
            desc: "you can change it later",
            formComponent: <TestingPreference/>
    },
]

const recorderDevices = devices
	.filter((device) => device.visible)
	.map((device) => ({
		device: device,
		value: device.id,
		label: device.name,
	}));

export const PROJECT_INFO = ()=>{
    const { userInfo, mutate } = useUser();

    const [_, setOnboarding] = useAtom(ONBOARDING_STAGE_ATOM);
    const [isDev, setIsDev] = useAtom(isDevAtom)
    const [isLowCode, setIsLowCode] = useAtom(isLowCodePref)

    const navigate = useNavigate()
    const store = useStore();

    const handleCreateTest = React.useCallback(async () => {
        await axios(updateProjectMeta({
            isDev,
            isLowCode,
            ONBOARDING_COMPLETED: true,
        })());
        const currentProjectId = getCurrentSelectedProjct(store.getState() as any);
        const currentProject = userInfo.projects.find((project) => project.id === currentProjectId);
        if (currentProject) {
            currentProject.meta = {
                ...currentProject.meta,
                isDev,
                isLowCode,
                ONBOARDING_COMPLETED: true,
            };
        }
        mutate({
            ...userInfo
        }, false);
        navigate("/recorder");
        goFullScreen();

        performSteps([
            {
                type: "BROWSER_SET_DEVICE",
                payload: {
                    meta: {
                        device: recorderDevices[0].device,
                    },
                },
                time: Date.now(),
            },
            {
                type: "PAGE_NAVIGATE_URL",
                payload: {
                    selectors: [],
                    meta: {
                        value: "https://i8svx9.sse.codesandbox.io/?step=3",
                    },
                },
                status: "COMPLETED",
                time: Date.now(),
            },
        ]);
    }, [isDev, isLowCode]);

    const isSubmitDisabled = isDev === null || isLowCode === null;


    return (
        <div>
         <HeaderBlock title="setup project" desc={"you'll be able to create test after this"}/>
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1  }}
    css={box} className="mt-32 py-32 px-40 mb-44">
            {
                formItems.map(({heading,formComponent,desc}, index)=>{
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
                        {index !== formItems.length - 1 ? <hr className="mt-24 mb-24" css={ruleCSS}/> : null}
                    </div>)
                })
            }

            
    </motion.div>
    <CTABar isDisabled={isSubmitDisabled} onClick={handleCreateTest.bind(this)} btnText="setup project"/>
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