import React from "react";
import { css } from "@emotion/react";
import { GreenDotIcon } from "electron-app/src/_ui/constants/old_icons";
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";
import { setEnvironment } from "electron-app/src/ipc/perform";
import { getCurrentProjectMetadata } from "electron-app/src/store/selectors/projects";
import { useSelector } from "react-redux";

 function HelpContent({ environments, selected, setSelected, ...props }) {
	return (
		<div className="pt-3 pb-6" {...props}>

                {
                    environments.map((env, index) => {
                        return (
                            <div key={index} onClick={setSelected.bind(this, env)} css={linkCSS}>
                                <span>{env}</span>
                                {selected === env && <GreenDotIcon css={dotCss} className={"ml-auto"}/>}
                            </div>
                        );
                    })
                }
		</div>
	);
}

const environments = ["development", "production"];

export const EnvironmentStatus = ({className}) => {
    const projectMetaData = useSelector(getCurrentProjectMetadata);
    const environmentsArr = projectMetaData?.environments ? Object.keys(projectMetaData.environments) : [];

    const [selected, setSelected] = React.useState("development");

    const handleChangeEnvironment = (val) => {
        setEnvironment(val);
        setSelected(val);
    }


    return (
        <HoverCard content={<HelpContent setSelected={handleChangeEnvironment} environments={environmentsArr} selected={selected} />} placement="top" type="hover" padding={8} offset={0}>
            <div className={`flex items-center ${className}`} css={containerCss}>
                <span>{selected}</span>
                <GreenDotIcon css={dotCss} className={"ml-8"}/>
            </div>
        </HoverCard>
 
    )
}

const containerCss = css`
    position: relative;
    top: 2rem;
`;

const dotCss = css`
    width: 8px;
    position: relative;
    top: -1px;
`;

const linkCSS = css`
	display: flex;
	align-items: center;
	padding-left: 8rem;
	padding-right: 8rem;
	path {
		fill: #d1d5db;
	}
	color: #d1d5db;
	:hover {
		background: rgba(43, 43, 43, 0.5);
		color: #bc66ff;
	}
	height: 28rem;
	width: 148rem;
	border-radius: 6px;
	padding-top: 1rem;

	transition: all 0ms linear;

	path,
	* {
		transition: all 0ms;
	}
`;