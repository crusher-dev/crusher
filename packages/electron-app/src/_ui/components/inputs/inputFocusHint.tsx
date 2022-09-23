import React from "react";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms";

interface IProps {
    hint?: string;
    placeholder?: string;
    className?: string;
};
const InputFocusHint = ({ hint, placeholder, className, ...props }: IProps) => {
    const ref = React.useRef(null);

    const HintComponent = React.useMemo(() => {
        if(!hint) return null;
        return (
            <div css={hintCss}>
                {hint}
            </div>
        );
    }, [hint]);

    return (
        <Input
            placeholder={placeholder}
            css={inputCss}
            initialValue={""}
            ref={ref}
            rightIcon={HintComponent}
        />
    );
}


const inputCss = css`
	height: 36rem;
	.input__rightIconContainer {
		right: 0px;

		:hover {
			opacity: 0.8;
		}
	}
	.input__leftIconContainer {
		border-radius: 8rem 0px 0px 8rem;
		height: 85%;
		left: 1rem;
		.outsideDiv,
		.showOnClick {
			height: 100%;
		}
		/* To stop border collision */
		margin-left: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;

		.dropdown-box {
			overflow: hidden;
			width: 104rem;
			margin-left: 12rem;
			z-index: 99999;
		}
	}
	& > input {
		width: 247rem;
		/* border: 1px solid #9462ff; */
		outline-color: #9462ff;
		outline-width: 1px;
		box-sizing: border-box;
		border-radius: 8rem 0px 0px 8rem;
		height: 100%;
		padding-left: 12rem;
		padding-right: 110rem;

		background: rgba(77, 77, 77, 0.25) !important;
		border: 0.5px solid rgba(55, 55, 55, 0.23) !important;
		border-radius: 10px;

		font-family: Gilroy;
		font-style: normal;
		font-weight: 400;
		font-size: 13rem;
		letter-spacing: 0.02em;

		color: rgba(255, 255, 255, 0.67);
		::placeholder {
			color: rgba(255, 255, 255, 0.4);
		}
		
	}
	}
	.dropdown-box {
		overflow: hidden;
	}
	.input__rightIconContainer {
		right: 1rem;
		z-index: 9999;
	}
`;

const hintCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 12.7rem;


    color: #444444;
    margin-right: 12rem;
`;
export { InputFocusHint };