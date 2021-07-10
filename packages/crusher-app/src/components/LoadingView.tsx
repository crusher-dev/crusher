import {css} from "@emotion/core"
import { CenterLayout, BlankBase } from "dyson/src/components/layouts/"
import { Logo } from "dyson/src/components/atoms";

const backgroundForBase = css`
 background: url("/assets/img/background/background_dark.jpg");
    background-size:contain;
`

export const LoadingView = () => {
    return <BlankBase css={backgroundForBase}>
        <CenterLayout>
            <div className="flex flex-col justify-center items-center">
                <Logo showOnlyIcon={true} height={42}/>
                Firing up all the boosters
            </div>
        </CenterLayout>
    </BlankBase>
}