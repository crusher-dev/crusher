import Input from "@dyson/components/atoms/input/Input";
import { css } from "@emotion/react";
import React, {useState, useCallback} from "react";

const NormalInput = React.forwardRef(({ placeholder, handleUrlReturn, inputCss: _inputCss, inputWrapperCss, initialValue, className, rightIcon, ...props}, ref) => {
    const [isInFocus, setIsInFocus] = useState(false);
    const [url, setIsUrl] = useState(initialValue);

    const handleOnChange = useCallback((event) => {
        setIsUrl(event.target.value);
    }, []);



    const shouldShowRightIcon = isInFocus || !url?.length;
    return (
        <Input
            placeholder={placeholder}
            css={inputCss}
			inputWrapperCss={inputWrapperCss}
			inputCss={_inputCss}
            onReturn={handleUrlReturn}
            ref={ref}
            rightIcon={shouldShowRightIcon ? rightIcon : null}
            onBlur={setIsInFocus.bind(this, false)}
            onFocus={setIsInFocus.bind(this, true)}
            onChange={handleOnChange}
			initialValue={initialValue}
            {...props}
        />
    );
});

const inputCss = css`
	height: 40rem;
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
		width: 359rem;
		/* border: 1px solid #9462ff; */
		outline-color: #9462ff;
		outline-width: 1px;
		box-sizing: border-box;
		border-radius: 8rem 0px 0px 8rem;
		height: 100%;
		padding-left: 18rem;
		padding-right: 110rem;

		background: rgba(77, 77, 77, 0.25);
		border: 0.5px solid rgba(55, 55, 55, 0.23);
		border-radius: 10px;

		font-family: Gilroy;
		font-style: normal;
		font-weight: 600;
		font-size: 13rem;
		color: rgba(255, 255, 255, 0.67);
        :focus {
            border-color: #D660FF;
        }
	}
	}

	.input__rightIconContainer {
		right: 1rem;
		z-index: 9999;
	}
`;

export { NormalInput };