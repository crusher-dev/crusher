import clsx from 'clsx';
import React from 'react';

import styles from './index.module.scss';
import { css } from '@emotion/css'
function Step({ children }) {

  return (
    <div className={stepCSS}>{children}</div>
  )

}

const stepCSS = css`
padding: 12px 38px;

font-size: 15px;

color: #8c8d8c;
line-height: 1;
`

export default function Comparison(props) {
  return (
    <div {...props} className={clsx(props.className, 'app-wizard', styles.appWizard)}>

      <div className={box}>
        <div className={header}><PassedSVG height={14} width={14} />Our focus</div>
        <Step>- Make testing fast & robust</Step>
        <Step>- Support low-code/code tests</Step>
        <Step>- Single integrated solution</Step>
        <Step>- Based on JS</Step>
      </div>

      <div className={box}>
        <div className={header}><FailedSVG height={14} width={14} />We'll not focus on</div>
        <Step>- industry jargons</Step>
        <Step>- traditional standards/APIs</Step>
      </div>


    </div>
  );
}

const box = css`

padding-bottom: 16px;
`

const header = css`
padding: 16px 30px;
flex: 1;

svg{
  margin-right: 12px;
}

font-size: 16px;
letter-spacing: .3px;
font-weight: 500;

color: #8c8d8c;
line-height: 1;

border-bottom: 1px solid #8080800d;
margin-bottom: 16px;
`


export function FailedSVG(props) {
  const { isMonochrome } = props;
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 8a8 8 0 1116 0A8 8 0 010 8zm6.166-2.966a.8.8 0 00-1.132 1.132L6.87 8 5.034 9.834a.8.8 0 001.132 1.132L8 9.13l1.834 1.835a.8.8 0 001.132-1.132L9.13 8l1.835-1.834a.8.8 0 00-1.132-1.132L8 6.87 6.166 5.034z"
        fill={isMonochrome ? "#fff" : "#EF4074"}
      />
    </svg>
  );
}


export function PassedSVG(props: ReactPropTypes) {
  const { isMonochrome } = props;
  return (
    <svg width={"16rem"} height={"16rem"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 0C3.589 0 0 3.589 0 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm4.471 5.895l-5.113 5.072c-.3.301-.782.321-1.102.02L3.549 8.521a.813.813 0 01-.06-1.123c.3-.32.802-.34 1.123-.04l2.145 1.965 4.571-4.571a.799.799 0 011.143 0c.321.32.321.822 0 1.143z"
        fill={isMonochrome ? "#fff" : "#87d241"}
      />
    </svg>
  );
}
