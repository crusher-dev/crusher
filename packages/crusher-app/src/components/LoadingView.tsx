import { CenterLayout, BlankBase } from "dyson/src/components/layouts/"
import { Logo } from "dyson/src/components/atoms"
import { CrusherLogo } from "./Logo"
export const LoadingView = () => {
    return <BlankBase>
        <CenterLayout>
            <div>
                <Logo ImgEelement={<CrusherLogo />} onlyIcon={true} height={"small"} />
                Firing up all the booster
            </div>
        </CenterLayout>
    </BlankBase>
}