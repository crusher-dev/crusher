
import * as React from "react"
import { css } from "@emotion/react"
import { ReactElement, useEffect, useState } from 'react';
import { Conditional } from '../../layouts';


const radio = (state) => css`
  // background: ${state? "#80B05A" : "#E5496E"};
	background: #0a0b0e;
`
const radioContainer = (state)  => css`
  height: 16rem;
  width: 16rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
	justify-content: center;

	:hover{
    background: rgba(255, 255, 255, 0.30);
	}
  #ellipsis {
    height: 10rem;
    width: 10rem;
		border-radius: 122px;
    background: none;
  }
`

const selectedState= css`
  #ellipsis {
    background: #687ef2;
  }
`

const notSelectedState = css`
	 :hover{
     #ellipsis {
       background: #687ef2;
     }
	 }
`

const disabledState = (state) => css`
  cursor: not-allowed;

  #ellipsis {
    background: ${state? "rgba(104, 126, 242, 0.4)" : "none"};
  }
`



export type RadioProps = {
	/**
	 * Emotion CSS style if any
	 */
	isSelected: boolean;
	disabled: boolean;
	label?: ReactElement;
	callback?: (state: boolean) => void
} & React.DetailedHTMLProps<any, any>;

const RadioDefaultProps = {
	isSelected: true,
	disabled: false,
};

export function Radio(props: RadioProps): ReactElement {

	const {callback, disabled, label,isSelected} = props

	const handleClick = () => {
		callback && callback(!isSelected)
	}

	return (
		<div className={"flex items-center "}>

			<div
				css={[radioContainer(isSelected),
					isSelected && selectedState,
					!isSelected && notSelectedState,
					disabled && disabledState(isSelected)

				]}
				onClick={handleClick}
			>
				<div id={"ellipsis"} css={radio(isSelected)}>
				</div>

			</div>
			<Conditional showIf={!!label}>
				<div className={"text-13 ml-12 font-500 mt-2"}>
					{label}
				</div>
			</Conditional>
		</div>
	)
}


Radio.defaultProps = RadioDefaultProps;

export default Radio