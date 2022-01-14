import { Input } from "@dyson/components/atoms";
import { Toggle } from "@dyson/components/atoms/toggle/toggle";
import { Conditional } from "@dyson/components/layouts";
import { css } from "@emotion/react";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { CrossIcon, InspectElementIcon } from "electron-app/src/ui/icons";
import { selectors } from "playwright";
import React from "react";
import { useDispatch } from "react-redux";
import { SELECTOR_TYPE } from "unique-selector/src/constants";

function getSelectors(action: iAction) {
    if(!action.payload.selectors) return "";

    return action.payload.selectors.map((selector, index) => {
        return selector.value;
    }).join("\n");
}
const StepInfoEditor = ({action, actionIndex, ...props}: {action: iAction; actionIndex: number;}) =>  {
    const [isOptional, setIsOptional] = React.useState(!!action.payload.isOptional);
    const [isStepNameEditable, setIsStepNameEditable] = React.useState(false);
    const [stepName, setStepName] = React.useState(action.name ? action.name : "Enter step name");
    const [stepSelectors, setStepSelectors] = React.useState(getSelectors(action));
    const stepNameRef: React.Ref<HTMLInputElement> = React.useRef(null);

    const dispatch = useDispatch();

    const handleInputBlur = () => {
        setIsStepNameEditable(false);
        dispatch(updateRecordedStep({
            ...action,
            name: stepNameRef.current.value
        }, actionIndex));
    };
    
    const handleSelectorsSave = (e) => {
        dispatch(updateRecordedStep({
            ...action,
            payload: {
                ...action.payload,
                selectors: e.target.value.split("\n").map((a) => {
                    return {type: SELECTOR_TYPE.PLAYWRIGHT, value: a.trim(), uniquenessScore: 1};
                })
            }
        }, actionIndex));
    };

    const handleOptionalToggle = (state) => {
        setIsOptional.bind(this, state)

        dispatch(updateRecordedStep({
            ...action,
            payload: {
                ...action.payload,
                isOptional: state
            }
        }, actionIndex));
    };

    const handleUpdateInputText = (newText) =>{
        dispatch(updateRecordedStep({
            ...action,
            payload: {
                ...action.payload,
                meta: {
                    ...action.payload.meta,
                    value: {
                        ...action.payload.meta.value,
                        value: newText
                    }
                }
            }
        }, actionIndex));
    }

    return (
        <div
        css={css`
            min-width: 325rem;
            padding-bottom: 8rem;
            position: fixed;
            border-radius: 8rem;
            background: #111213;
            border: 1px solid #272727;
            transform: translateX(calc(-100% - 1rem));
            font-family: Cera Pro;
            bottom: 0%;
        `}
    >
        <div className={"font-600 text-15 flex p-12 pt-8 pb-8 pl-8 mt-6"}>
            <div onDoubleClick={() => {
                setIsStepNameEditable(true);
                setTimeout(() => {
                    stepNameRef.current.focus();
                });
            }}>
            <input
                ref={stepNameRef}
                css={[css`font-size: 13.75rem; padding: 4rem 4rem; border: none; background: transparent; font-weight: 400; border: 1px solid transparent; :hover {opacity: 0.9} `, isStepNameEditable && css`border: 1px solid rgba(196, 196, 196, 0.2);`]}
                value={stepName}
                onChange={(e) => setStepName(e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={(e) => {
                    if(e.keyCode === 13) {
                        handleInputBlur();
                    }
                }}
                disabled={!isStepNameEditable}
            />
            </div>
            <CrossIcon width={10} height={10} css={css`margin-left: auto; margin-top: 4rem; `} />
        </div>

        <div css={css`font-family: Gilroy; font-size: 12.8rem`} className={"p-12"}>
            <Conditional showIf={action.type === ActionsInTestEnum.ADD_INPUT}>
                <div className={"flex mt-8 mb-16"} css={css`align-items: center;`}>
                    <span>Input Text</span>
                    <Input
                                css={[inputStyle, css`min-width: 207rem;`]}
                                placeholder={"Enter frontend endpoint"}
                                size={"medium"}
                                initialValue={action.payload.meta?.value?.value}
                                onReturn={handleUpdateInputText.bind(this)}
                                onBlur={(e) => {handleUpdateInputText(e.target.value)}}
                    />
                </div>
            </Conditional>
            <div className={"mt-8"}>
                <span>Selectors</span>
                <div css={css`flex: 1; margin-top: 8rem; position: relative;`}>
                    <textarea
                    css={css`font-size: 12rem`}
                        placeholder={"Selector come here"}
                        onChange={(e) => setStepSelectors(e.target.value)}
                        onKeyDown={(e) => { if(e.keyCode === 13) { handleSelectorsSave(e) } }}
                        css={[textAreaStyle, scrollBarStyle]}
                        value={stepSelectors}
                    />
                    <InspectElementIcon css={css`width: 16rem; height: 16rem; position: absolute; right: 7rem; bottom: 9rem; :hover { opacity: 0.8 }`} />
                </div>
            </div>

            <div className={"flex mt-28"} css={css`align-items: center;`}>
                <span>Mark as optional</span>
                <Toggle css={css`zoom: 0.8; margin-left: auto;`} isOn={isOptional} callback={handleOptionalToggle} />
            </div>
        </div>
    </div>
    );
}


const textAreaStyle = css`
    width: 100%;
    height: 100rem;
    background: rgba(0, 0, 0, 0.34);
    border: 1px solid rgba(196, 196, 196, 0.2);
    border-radius: 4rem;
    resize: none;
    padding: 8rem;
    line-height: 20rem;
    font-size: 12rem;
`;

const scrollBarStyle = css`
	::-webkit-scrollbar {
		display: none;
	}
`;

const inputStyle = css`
	background: #1A1A1C;
	border-radius: 6rem;
	border: 1rem solid #43434F;
	font-family: Gilroy;
	font-size: 13.75;
	min-width: 358rem;
	color: #fff;
	outline: nonet;
	margin-left: auto;

    input {
        padding: 8rem;
        :focus {
            border-color: transparent;
        }
    }
`;

export { StepInfoEditor };