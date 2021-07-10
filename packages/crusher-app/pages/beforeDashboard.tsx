import React from "react"
import { css } from '@emotion/react';
import { BlankBase, CenterLayout } from "dyson/src/components/layouts"
import { useState } from 'react';

const HowItWorksView = () => {
    return <>
        <div className="m-8">How it works in 60 seconds?</div>
        <div className="rounded-md  h-80 w-80" css={css`background-color:#191E22`}>

        </div>
    </>
};

const OpenDashView = () => {
    return <>
        <div className="m-8 text-center">{`"We help devs ship HQ fast. We do this by eliminating
     chores and removing noise from their workflow."`}</div>
        {/* github button */}
        <div className="my-4 flex flex-col">
            Start us to show some love
            {/* replace with dyson github */}
            <button>Github</button>
        </div>
        <div className="my-4 flex flex-col">
            Join us and ship products with other devs
            {/* replace it with dyson discord */}
            <button>Discord</button>
        </div>
    </>
};

const getViewByStep = (step: number) => {
    switch (step) {
        case 0: return <HowItWorksView />;
        case 1: return <OpenDashView />;
        default: return null;
    }
}

const BeforeDashboard = () => {
    const [step, setStep] = useState(0);
    const handleNext = () => {
        setStep(step + 1);
    }
    return <BlankBase>
        <CenterLayout>
            <div className="flex flex-col items-center max-w-lg">
                {getViewByStep(step)}
                {step < 1 ? <button onClick={handleNext}>
                    Next
                </button> : <button className="my-8">
                    Open Dashboard
                </button>}
            </div>
        </CenterLayout>
    </BlankBase>
};

export default BeforeDashboard;