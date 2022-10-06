import { css } from "@emotion/react";
import React from "react";
import { ListBox } from "../../molecules/SelectableList";
import { BuildListItem } from "./item";

interface IContextNenuItem{ 
    id: string;
    label: string;
    shortcut: any;
}

interface IProps {
    builds: Array<{
        id: string;
        status: string;
        gitInfo?: {
            commit?: string;
            branch?: string;    
        };
        host?: string;
        config?: string;
        createdAt: any;
        triggeredBy: string;
    }>;
}

const PillButton = ({children, className, ...props}) => {
    return (
        <div css={pillButtonCss} className={`flex items-center justify-center py-4 px-12 ${className}`} {...props}>
            {children}
        </div>
    )
};

const pillButtonCss = css`
    font-size: 13rem;
    letter-spacing: 0.03em;
    color: rgba(255, 255, 255, 0.35);
    background: rgba(217, 217, 217, 0.03);
    border: 0.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 12rem;

    :hover {
        background: rgba(255,255,255,0.07);
    }
`;

const BuildsList = ({ builds, viewTestCallback }: IProps) => {
    const items = React.useMemo(() => {
        if (!builds) return null;
        return builds.map((build) => {
            return {
                id: build.id,
                content: (isItemSelected: boolean) => (
                    <BuildListItem viewTestCallback={viewTestCallback} build={build} key={build.id}/>
                ),
            };
        });
    }, [builds]);

    return (
        <div>
            <div className="flex items-center px-56">
                <div>recent builds</div>
                <div  className={"flex ml-16"}>
                    <PillButton>show mine</PillButton>
                    <PillButton className={"ml-16"}>local build</PillButton>
                </div>

            </div>
            <div className="mt-16">
                <ListBox
                            // contextMenu={contextMenu}
                            selectedHeaderActions={() => null}
                            items={items}
                            showHeader={false}
                        />
            </div>
         
        </div>
       
    );

};

export { BuildsList };