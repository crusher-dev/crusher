import React from "react";
import ReactDOM from "react-dom";
import { css } from "@emotion/core";
import CrossModal from "../../../../public/svg/modals/cross.svg";

interface iProps {
	heading: string;
	desc: string;
	moto: string;
	topAreaCss: any;
	bodyCss: any;
	children: any;
	illustration: any;
	onClose: any;
}

class Modal extends React.Component<iProps, any> {
	render() {
		const {
			heading,
			desc,
			moto,
			topAreaCss,
			bodyCss,
			children,
			illustration,
			css,
			onClose
		} = this.props;

		return ReactDOM.render(
			<div css={[containerCss, css]}>
				<div css={modalContainerCss}>
					<div css={[topContainerCss, topAreaCss]}>
            <div className={"modalHeading"}>{heading}</div>
            <div className={"modalDesc"}>{desc}</div>
						<div css={crossModalCss} onClick={onClose}>
							<CrossModal/>
						</div>
						<div css={illustrationContainerCss}>
							<img src={illustration} />
            </div>
					</div>
          <div css={[bodyContainerCss, bodyCss]}>
            <div className={"modalMoto"}>{moto}</div>

						{children}
          </div>
				</div>
			</div>,
			document.getElementById("overlay"),
		);
	}
}

const containerCss = css`
	position: absolute;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	background: rgb(0, 0, 0, 0.5);
	z-index: 1001;
`;

const modalContainerCss = css`
	max-width: 37rem;
	position: relative;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	overflow: hidden;
	border-radius: 0.25rem;
`;

const illustrationContainerCss = css`
	position: absolute;
	top: -1rem;
	right: -0.5rem;
`;

const topContainerCss = css`
	background: #0a1e24;
	color: #fff;
	padding: 1.4rem 1.55rem; 
	padding-bottom: 2.25rem;
	position: relative;
	font-family: Cera Pro;
	.modalHeading {
		font-weight: 900;
		font-size: 1.4rem;
	}
	.modalDesc {
	  margin-top: 0.25rem;
	  font-size: 1rem;
	}
`;

const bodyContainerCss = css`
	width: 100%;
	background: #fff;
	padding: 1.25rem 1.55rem;
	padding-bottom: 2rem;
	font-family: Gilroy;
	color: #2E2E2E;
	.modalMoto{
		font-size: 0.825rem;
	}
`;

const crossModalCss = css`
	position: absolute;
  top: 1.5rem;
  right: 2.25rem;
  cursor: pointer;
  z-index: 2;
`;

export { Modal };
