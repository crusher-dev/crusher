import { CenterLayout, BlankBase } from "dyson/src/components/layouts/"
import { Logo } from "dyson/src/components/atoms"
import { CrusherLogo } from "./Logo"
export const LoadingView = () => {
    return <BlankBase>
        <CenterLayout>
            <div className="flex flex-col justify-center items-center">
                <Logo imgEelement={<CrusherLogo />} onlyIcon={true} height={"small"} />
                Firing up all the booster
            </div>
        </CenterLayout>
    </BlankBase>
}