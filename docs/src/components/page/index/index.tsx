import clsx from 'clsx';
import React from 'react';

import styles from './index.module.scss';

export default function CrusherFeatures(props) {
  return (
    <div {...props} className={clsx(props.className, styles.appWizard)}>
      <div className="row">
        <div className="item">
          <Blaze /> <span className="item-name">Robust, fast and secure</span>
        </div>
        <div className="item" style={{ marginLeft: 30 }}>
          <Fast />{' '}
          <span className="item-name" style={{ marginLeft: 12 }}>
            Make testing awesome
          </span>
        </div>
      </div>

      <div className="row">
        <div className="item">
          <Terminal />{' '}
          <span className="item-name" style={{ marginLeft: 13 }}>
            Built for developers
          </span>
        </div>
        <div className="item" style={{ marginLeft: 30 }}>
          <Gear />{' '}
          <span className="item-name" style={{ marginLeft: 12 }}>
            Extendable & customizable
          </span>
        </div>
      </div>
    </div>
  );
}

export const Blaze = (props) => (
  <svg width={14} height={20} viewBox={"0 0 19 27"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M17.811 9.499h-5.944V1.187c0-1.17-1.519-1.633-2.168-.658L.201 14.777c-.526.79.044 1.846.988 1.846h5.936v8.31c0 1.172 1.526 1.634 2.176.66l9.498-14.248a1.188 1.188 0 0 0-.988-1.846Z"
      fill="#40b3d2"
    />
  </svg>
);

export const Fast = (props) => (
  <svg width={22} height={19} viewBox={"0 0 27 19"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m18.207.59 7.375 7.336a4.8 4.8 0 0 1 0 6.813 4.857 4.857 0 0 1-4.544 1.282v.276A2.71 2.71 0 0 1 18.322 19h-3.133v-.924a3.56 3.56 0 0 0-3.561-3.553H9.839a.842.842 0 0 0-.844.84c0 .463.378.84.844.84h1.788c1.03 0 1.874.84 1.874 1.873V19H6.074c-1.5 0-2.699-1.21-2.699-2.703V12.77c0-.26.016-.519.048-.771A3.226 3.226 0 0 1 0 8.788 3.226 3.226 0 0 1 3.234 5.57c1.368 0 2.537.844 3.01 2.037A6.083 6.083 0 0 1 9.47 6.69h5.455c.82 0 1.602.16 2.317.452.222-.372.493-.688.811-1.013l-2.707-2.692a2.005 2.005 0 0 1 0-2.847 2.03 2.03 0 0 1 2.861 0Z"
      fill="#40b3d2"
    />
  </svg>
);

export function Terminal(props) {
  return (
    <svg width={16} height={23} fill="none" viewBox={"0 0 23 23"} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19.406 1.438H3.594A2.878 2.878 0 00.719 4.313v14.375a2.878 2.878 0 002.875 2.875h15.812a2.878 2.878 0 002.875-2.875V4.313a2.878 2.878 0 00-2.875-2.875zM4.313 11.5a.719.719 0 01-.45-1.28l2.893-2.314-2.893-2.314a.72.72 0 11.899-1.123l3.593 2.875a.719.719 0 010 1.123l-3.593 2.875a.719.719 0 01-.45.158zm7.187 0H8.625a.719.719 0 110-1.438H11.5a.719.719 0 110 1.438z"
        fill="#40b3d2"
      />
    </svg>
  );
}

function Gear(props) {
  return (
    <svg width={19} height={19} viewBox={"0 0 19 19"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M18.057 11.398c.518 0 .941-.42.941-.942V8.54a.94.94 0 00-.94-.942h-1.06l-.003-.003a7.637 7.637 0 00-.855-2.058l.738-.739a.943.943 0 000-1.33l-1.355-1.355a.942.942 0 00-1.332 0l-.738.738A7.652 7.652 0 0011.413 2c-.002 0-.007-.544-.012-1.064a.938.938 0 00-.94-.935H8.546a.94.94 0 00-.94.948l.008 1.03c-.75.159-1.458.482-2.106.87l-.733-.735a.94.94 0 00-1.33 0L2.087 3.469a.941.941 0 000 1.33l.737.738a7.721 7.721 0 00-.854 2.058c0 .002 0 .003-.002.003H.942a.941.941 0 00-.94.942v1.918c0 .519.42.942.94.942h1.022l-.025-.111c.01.036.016.071.025.106a7.68 7.68 0 00.863 2.085l-.738.736a.94.94 0 000 1.332l1.356 1.357a.943.943 0 001.33 0l.737-.738a7.692 7.692 0 002.104.867l-.008 1.018a.938.938 0 00.94.948h1.916a.942.942 0 00.942-.935c.003-.514.007-1.045.011-1.046a7.735 7.735 0 002.039-.85l.738.736a.941.941 0 001.33 0l1.355-1.353a.944.944 0 000-1.332l-.739-.738a7.731 7.731 0 00.865-2.08h1.055l-.003-.004zm-8.573.755a2.646 2.646 0 11.002-5.292 2.646 2.646 0 01-.002 5.292z"
        fill="#40b3d2"
      />
    </svg>
  );
}
