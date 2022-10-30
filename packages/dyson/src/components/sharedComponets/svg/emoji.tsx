import React from "react"

export function LoadingSVG(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block" {...props}>
            <circle cx={50} cy={50} fill="none" stroke={props.color || "#a7a7a7"} strokeWidth={"10rem"} r={35} strokeDasharray="164.93361431346415 56.97787143782138">
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur=".61s" values="0 50 50;360 50 50" keyTimes="0;1" />
            </circle>
        </svg>
    );
}

export function HappyFace(props) {
    return (
        <svg
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g opacity={1} clipPath="url(#prefix__clip0_981_3307)">
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint0_radial_981_3307)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint1_radial_981_3307)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint2_radial_981_3307)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint3_radial_981_3307)"
                    fillOpacity={0.6}
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint4_radial_981_3307)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint5_radial_981_3307)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint6_radial_981_3307)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint7_radial_981_3307)"
                />
                <path
                    d="M10 15.625C4.375 15.625 4.375 10 4.375 10h11.25s0 5.625-5.625 5.625z"
                    fill="url(#prefix__paint8_radial_981_3307)"
                />
                <path
                    d="M14.063 10.938H5.937A.937.937 0 015 10h10c0 .518-.42.938-.938.938z"
                    fill="url(#prefix__paint9_linear_981_3307)"
                />
                <path
                    d="M6.563 9.688s-1.876-.313-3.157-1.792C2.1 6.39 3.32 4.23 5.626 5.313c.985-1.608 3.43-1.014 3.105.937-.312 1.875-2.168 3.438-2.168 3.438z"
                    fill="url(#prefix__paint10_radial_981_3307)"
                />
                <path
                    d="M12.198 9.688s1.875-.313 3.156-1.792c1.307-1.507.087-3.666-2.218-2.583-.986-1.608-3.432-1.014-3.106.937.312 1.875 2.168 3.438 2.168 3.438z"
                    fill="url(#prefix__paint11_radial_981_3307)"
                />
                <path
                    d="M6.293 8.806c-.655-.247-1.556-.71-2.27-1.535-1.307-1.507-.087-3.666 2.218-2.583.986-1.608 3.432-1.014 3.106.937-.19 1.138-.947 2.16-1.514 2.788a1.399 1.399 0 01-1.54.393z"
                    fill="url(#prefix__paint12_linear_981_3307)"
                />
                <path
                    d="M13.709 8.806c.655-.247 1.555-.71 2.27-1.535 1.307-1.507.087-3.666-2.218-2.583-.986-1.608-3.432-1.014-3.106.937.19 1.138.947 2.16 1.514 2.788.392.435.991.6 1.54.393z"
                    fill="url(#prefix__paint13_linear_981_3307)"
                />
                <ellipse
                    cx={5.895}
                    cy={5.819}
                    rx={0.938}
                    ry={1.875}
                    transform="rotate(-45 5.895 5.82)"
                    fill="url(#prefix__paint14_radial_981_3307)"
                />
                <ellipse
                    cx={13.075}
                    cy={5.749}
                    rx={1.25}
                    ry={1.875}
                    transform="rotate(-12.966 13.075 5.75)"
                    fill="url(#prefix__paint15_radial_981_3307)"
                />
                <circle
                    cx={8.174}
                    cy={4.765}
                    transform="rotate(45 8.174 4.765)"
                    fill="url(#prefix__paint16_radial_981_3307)"
                    r={0.938}
                />
                <ellipse
                    cx={15.232}
                    cy={5.39}
                    rx={0.625}
                    ry={1.25}
                    transform="rotate(45 15.232 5.39)"
                    fill="url(#prefix__paint17_radial_981_3307)"
                />
            </g>
            <defs>
                <radialGradient
                    id="prefix__paint0_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(132.839 6.741 6.29) scale(23.4396)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint1_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(131.878 6.713 6.37) scale(24.3429)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint2_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(101.31 1.798 8.005) scale(11.1541 14.2863)"
                >
                    <stop offset={0.788} stopColor="#F59639" stopOpacity={0} />
                    <stop offset={0.973} stopColor="#FF7DCE" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint3_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(135 3.813 6.705) scale(25.6326)"
                >
                    <stop offset={0.315} stopOpacity={0} />
                    <stop offset={1} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint4_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(77.692 -1.597 11.521) scale(17.5918)"
                >
                    <stop offset={0.508} stopColor="#7D6133" stopOpacity={0} />
                    <stop offset={1} stopColor="#715B32" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint5_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(55.713 -4.6 14.913) scale(8.32095 6.03145)"
                >
                    <stop stopColor="#FFB849" />
                    <stop offset={1} stopColor="#FFB847" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint6_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(9.866 -58.767 79.85) scale(7.29539)"
                >
                    <stop stopColor="#FFA64B" />
                    <stop offset={0.9} stopColor="#FFAE46" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint7_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(43.971 -6.142 18.233) scale(36.9081)"
                >
                    <stop offset={0.185} stopOpacity={0} />
                    <stop offset={1} stopOpacity={0.4} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint8_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(0 -6.875 13.75 0 10 16.875)"
                >
                    <stop stopColor="#F70A8D" />
                    <stop offset={1} stopColor="#89029C" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint10_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(-155.376 5.33 3.42) scale(8.25024 3.42934)"
                >
                    <stop stopColor="#CC7521" />
                    <stop offset={1} stopColor="#E6872B" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint11_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(122.005 4.345 6.902) scale(2.94812)"
                >
                    <stop stopColor="#EC812A" />
                    <stop offset={1} stopColor="#FBA84C" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint14_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(0 1.93842 -.98525 0 5.895 5.82)"
                >
                    <stop stopColor="#EC6686" />
                    <stop offset={1} stopColor="#EC6686" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint15_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(81.165 3.284 10.497) scale(1.68286 1.14047)"
                >
                    <stop stopColor="#EC6686" />
                    <stop offset={0.26} stopColor="#EC6686" />
                    <stop offset={1} stopColor="#EC6686" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint16_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(90 1.705 6.47) scale(.9375)"
                >
                    <stop stopColor="#EC6686" />
                    <stop offset={1} stopColor="#EC6686" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint17_radial_981_3307"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(0 1.25 -.625 0 15.232 5.39)"
                >
                    <stop stopColor="#EC6686" />
                    <stop offset={1} stopColor="#EC6686" stopOpacity={0} />
                </radialGradient>
                <linearGradient
                    id="prefix__paint9_linear_981_3307"
                    x1={10}
                    y1={10}
                    x2={10}
                    y2={10.938}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#ECCDFF" />
                    <stop offset={1} stopColor="#fff" />
                </linearGradient>
                <linearGradient
                    id="prefix__paint12_linear_981_3307"
                    x1={8.116}
                    y1={4.375}
                    x2={6.241}
                    y2={8.75}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#CA0B4A" />
                    <stop offset={1} stopColor="#F70A8D" />
                </linearGradient>
                <linearGradient
                    id="prefix__paint13_linear_981_3307"
                    x1={15}
                    y1={4.375}
                    x2={11.875}
                    y2={9.375}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#CA0B4A" />
                    <stop offset={1} stopColor="#F70A8D" />
                </linearGradient>
                <clipPath id="prefix__clip0_981_3307">
                    <path fill="#fff" d="M0 0h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}

export function ExcitedFace(props) {
    return (
        <svg
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g opacity={1} clipPath="url(#prefix__clip0_981_3393)">
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint0_radial_981_3393)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint1_radial_981_3393)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint2_radial_981_3393)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint3_radial_981_3393)"
                    fillOpacity={0.6}
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint4_radial_981_3393)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint5_radial_981_3393)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint6_radial_981_3393)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint7_radial_981_3393)"
                />
                <g opacity={0.5} filter="url(#prefix__filter0_f_981_3393)">
                    <path
                        d="M4.688 7.188s.156-1.25 1.562-1.25a1.485 1.485 0 011.563 1.25"
                        stroke="#9A4609"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                </g>
                <g opacity={0.5} filter="url(#prefix__filter1_f_981_3393)">
                    <path
                        d="M11.563 7.188s.312-1.25 1.562-1.25 1.563 1.25 1.563 1.25"
                        stroke="#9A4609"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                </g>
                <path
                    d="M5 6.875s.156-1.25 1.563-1.25a1.485 1.485 0 011.562 1.25"
                    stroke="#43273B"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <g opacity={0.26} filter="url(#prefix__filter2_f_981_3393)">
                    <path
                        d="M5.156 6.719s.157-1.25 1.563-1.25a1.485 1.485 0 011.562 1.25"
                        stroke="#fff"
                        strokeWidth={0.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <path
                    d="M11.875 6.875s.313-1.25 1.563-1.25S15 6.875 15 6.875"
                    stroke="#43273B"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <g opacity={0.26} filter="url(#prefix__filter3_f_981_3393)">
                    <path
                        d="M12.031 6.719s.156-1.25 1.563-1.25a1.485 1.485 0 011.562 1.25"
                        stroke="#fff"
                        strokeWidth={0.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <path
                    d="M10 15.625C4.375 15.625 4.375 10 4.375 10h11.25s0 5.625-5.625 5.625z"
                    fill="url(#prefix__paint8_radial_981_3393)"
                />
                <path
                    d="M14.063 10.938H5.937A.937.937 0 015 10h10c0 .518-.42.938-.938.938z"
                    fill="url(#prefix__paint9_linear_981_3393)"
                />
            </g>
            <defs>
                <radialGradient
                    id="prefix__paint0_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(132.839 6.741 6.29) scale(23.4396)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint1_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(131.878 6.713 6.37) scale(24.3429)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint2_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(101.31 1.798 8.005) scale(11.1541 14.2863)"
                >
                    <stop offset={0.788} stopColor="#F59639" stopOpacity={0} />
                    <stop offset={0.973} stopColor="#FF7DCE" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint3_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(135 3.813 6.705) scale(25.6326)"
                >
                    <stop offset={0.315} stopOpacity={0} />
                    <stop offset={1} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint4_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(77.692 -1.597 11.521) scale(17.5918)"
                >
                    <stop offset={0.508} stopColor="#7D6133" stopOpacity={0} />
                    <stop offset={1} stopColor="#715B32" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint5_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(55.713 -4.6 14.913) scale(8.32095 6.03145)"
                >
                    <stop stopColor="#FFB849" />
                    <stop offset={1} stopColor="#FFB847" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint6_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(9.866 -58.767 79.85) scale(7.29539)"
                >
                    <stop stopColor="#FFA64B" />
                    <stop offset={0.9} stopColor="#FFAE46" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint7_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(43.971 -6.142 18.233) scale(36.9081)"
                >
                    <stop offset={0.185} stopOpacity={0} />
                    <stop offset={1} stopOpacity={0.4} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint8_radial_981_3393"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(0 -6.875 13.75 0 10 16.875)"
                >
                    <stop stopColor="#F70A8D" />
                    <stop offset={1} stopColor="#89029C" />
                </radialGradient>
                <filter
                    id="prefix__filter0_f_981_3393"
                    x={2.187}
                    y={3.438}
                    width={8.125}
                    height={6.25}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.75}
                        result="effect1_foregroundBlur_981_3393"
                    />
                </filter>
                <filter
                    id="prefix__filter1_f_981_3393"
                    x={9.062}
                    y={3.438}
                    width={8.125}
                    height={6.25}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.75}
                        result="effect1_foregroundBlur_981_3393"
                    />
                </filter>
                <filter
                    id="prefix__filter2_f_981_3393"
                    x={3.281}
                    y={3.594}
                    width={6.875}
                    height={5}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.75}
                        result="effect1_foregroundBlur_981_3393"
                    />
                </filter>
                <filter
                    id="prefix__filter3_f_981_3393"
                    x={10.156}
                    y={3.594}
                    width={6.875}
                    height={5}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.75}
                        result="effect1_foregroundBlur_981_3393"
                    />
                </filter>
                <linearGradient
                    id="prefix__paint9_linear_981_3393"
                    x1={10}
                    y1={10}
                    x2={10}
                    y2={10.938}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#ECCDFF" />
                    <stop offset={1} stopColor="#fff" />
                </linearGradient>
                <clipPath id="prefix__clip0_981_3393">
                    <path fill="#fff" d="M0 0h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}

export function AngryFace(props) {
    return (
        <svg
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#prefix__clip0_981_3014)">
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint0_radial_981_3014)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint1_radial_981_3014)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint2_radial_981_3014)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint3_radial_981_3014)"
                    fillOpacity={0.6}
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint4_radial_981_3014)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint5_radial_981_3014)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint6_radial_981_3014)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint7_radial_981_3014)"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.653 13.562a3.755 3.755 0 00-5.304.017.625.625 0 01-.886-.883 5.005 5.005 0 017.071-.02.625.625 0 01-.88.886z"
                    fill="url(#prefix__paint8_linear_981_3014)"
                />
                <g filter="url(#prefix__filter0_f_981_3014)">
                    <path
                        d="M7.813 7.188c-.625.937-2.188 1.25-3.125.625"
                        stroke="#CE7C25"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <path
                    d="M8.125 6.875C7.5 7.813 5.937 8.125 5 7.5"
                    stroke="url(#prefix__paint9_radial_981_3014)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <g opacity={0.7} filter="url(#prefix__filter1_f_981_3014)">
                    <path
                        d="M11.563 7.188c.624.937 2.187 1.25 3.124.625"
                        stroke="#F4B158"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <path
                    d="M11.875 6.875c.625.938 2.188 1.25 3.125.625"
                    stroke="url(#prefix__paint10_linear_981_3014)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <g opacity={0.8} filter="url(#prefix__filter2_f_981_3014)">
                    <path
                        d="M5.781 3.953c1.094-.518 2.211 0 2.5 1.044"
                        stroke="#AA7013"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <path
                    d="M5.938 3.644c1.093-.519 2.21 0 2.5 1.044"
                    stroke="url(#prefix__paint11_radial_981_3014)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <g opacity={0.8} filter="url(#prefix__filter3_f_981_3014)">
                    <path
                        d="M13.781 4.203c-1.046-.61-2.203-.188-2.58.828"
                        stroke="#D59A25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <path
                    d="M14.063 3.644c-1.094-.519-2.211 0-2.5 1.044"
                    stroke="url(#prefix__paint12_radial_981_3014)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <g filter="url(#prefix__filter4_i_981_3014)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.125 15a1.875 1.875 0 111.592-2.866l2.619-1.628c.606-.377 1.347.227 1.1.897l-1.202 3.25a1.874 1.874 0 01-.984 3.472 1.875 1.875 0 01-1.768-2.5H3.125V15z"
                        fill="url(#prefix__paint13_radial_981_3014)"
                    />
                </g>
                <path
                    d="M3.125 15a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z"
                    fill="url(#prefix__paint14_radial_981_3014)"
                />
                <path
                    d="M6.25 18.125a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z"
                    fill="url(#prefix__paint15_radial_981_3014)"
                />
                <g filter="url(#prefix__filter5_i_981_3014)">
                    <path
                        d="M4.063 18.125a2.813 2.813 0 100-5.625 2.813 2.813 0 000 5.625z"
                        fill="url(#prefix__paint16_radial_981_3014)"
                    />
                </g>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.875 15a1.875 1.875 0 10-1.592-2.866l-2.618-1.628c-.607-.377-1.348.227-1.1.897l1.201 3.25a1.874 1.874 0 00.984 3.472 1.875 1.875 0 001.769-2.5h1.356V15z"
                    fill="url(#prefix__paint17_linear_981_3014)"
                />
                <path
                    d="M16.875 15a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z"
                    fill="url(#prefix__paint18_radial_981_3014)"
                />
                <path
                    d="M13.75 18.125a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z"
                    fill="url(#prefix__paint19_radial_981_3014)"
                />
                <g filter="url(#prefix__filter6_i_981_3014)">
                    <path
                        d="M15.938 18.125a2.813 2.813 0 100-5.625 2.813 2.813 0 000 5.625z"
                        fill="url(#prefix__paint20_radial_981_3014)"
                    />
                </g>
            </g>
            <defs>
                <radialGradient
                    id="prefix__paint0_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(132.839 6.741 6.29) scale(23.4396)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint1_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(131.878 6.713 6.37) scale(24.3429)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint2_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(101.31 1.798 8.005) scale(11.1541 14.2863)"
                >
                    <stop offset={0.788} stopColor="#F59639" stopOpacity={0} />
                    <stop offset={0.973} stopColor="#FF7DCE" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint3_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(135 3.813 6.705) scale(25.6326)"
                >
                    <stop offset={0.315} stopOpacity={0} />
                    <stop offset={1} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint4_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(77.692 -1.597 11.521) scale(17.5918)"
                >
                    <stop offset={0.508} stopColor="#7D6133" stopOpacity={0} />
                    <stop offset={1} stopColor="#715B32" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint5_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(55.713 -4.6 14.913) scale(8.32095 6.03145)"
                >
                    <stop stopColor="#FFB849" />
                    <stop offset={1} stopColor="#FFB847" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint6_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(9.866 -58.767 79.85) scale(7.29539)"
                >
                    <stop stopColor="#FFA64B" />
                    <stop offset={0.9} stopColor="#FFAE46" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint7_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(43.971 -6.142 18.233) scale(36.9081)"
                >
                    <stop offset={0.185} stopOpacity={0} />
                    <stop offset={1} stopOpacity={0.4} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint9_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(0 2.1875 -2.99975 0 6.563 6.25)"
                >
                    <stop stopColor="#52383E" />
                    <stop offset={0.651} stopColor="#5C4553" />
                    <stop offset={1} stopColor="#432A35" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint11_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(.625 -1.25 1.87435 .93718 7.188 4.375)"
                >
                    <stop stopColor="#301E26" />
                    <stop offset={1} stopColor="#52383E" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint12_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(-.625 -1.25 1.87435 -.93717 12.813 4.375)"
                >
                    <stop stopColor="#301E26" />
                    <stop offset={1} stopColor="#52383E" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint13_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(3.20517 4.76013 -9.42 6.34282 4.375 13.96)"
                >
                    <stop offset={0.336} stopColor="#FEF4FF" />
                    <stop offset={1} stopColor="#F8B1FF" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint14_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(139.399 -.067 6.903) scale(2.88111)"
                >
                    <stop stopColor="#EEEAF9" stopOpacity={0} />
                    <stop offset={0.91} stopColor="#C39ED9" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint15_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(95.194 -3.242 11.08) scale(3.45168)"
                >
                    <stop stopColor="#FAE8FF" stopOpacity={0} />
                    <stop offset={0.91} stopColor="#EC94FF" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint16_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(-5 5 -5 -5 5.938 13.75)"
                >
                    <stop offset={0.157} stopColor="#FFF6FF" />
                    <stop offset={0.741} stopColor="#E88DFF" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint18_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(135.003 6.539 9.847) scale(3.53575)"
                >
                    <stop stopColor="#EEEAF9" stopOpacity={0} />
                    <stop offset={0.91} stopColor="#C39ED9" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint19_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(108.435 1.27 12.074) scale(3.95285)"
                >
                    <stop stopColor="#C38EEC" />
                    <stop offset={0.91} stopColor="#EC94FF" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint20_radial_981_3014"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(-5 5 -5 -5 17.813 13.75)"
                >
                    <stop offset={0.157} stopColor="#FFF6FF" />
                    <stop offset={0.741} stopColor="#E88DFF" />
                </radialGradient>
                <filter
                    id="prefix__filter0_f_981_3014"
                    x={2.187}
                    y={4.687}
                    width={8.125}
                    height={5.95}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.75}
                        result="effect1_foregroundBlur_981_3014"
                    />
                </filter>
                <filter
                    id="prefix__filter1_f_981_3014"
                    x={9.562}
                    y={5.187}
                    width={7.125}
                    height={4.95}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.5}
                        result="effect1_foregroundBlur_981_3014"
                    />
                </filter>
                <filter
                    id="prefix__filter2_f_981_3014"
                    x={3.781}
                    y={1.751}
                    width={6.5}
                    height={5.246}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.75}
                        result="effect1_foregroundBlur_981_3014"
                    />
                </filter>
                <filter
                    id="prefix__filter3_f_981_3014"
                    x={8.951}
                    y={1.671}
                    width={7.08}
                    height={5.61}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur
                        stdDeviation={0.875}
                        result="effect1_foregroundBlur_981_3014"
                    />
                </filter>
                <filter
                    id="prefix__filter4_i_981_3014"
                    x={1.25}
                    y={10.389}
                    width={7.734}
                    height={8.236}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix
                        in="SourceAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={0.5} dy={0.5} />
                    <feGaussianBlur stdDeviation={1} />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                    <feColorMatrix values="0 0 0 0 0.784314 0 0 0 0 0.745098 0 0 0 0 0.764706 0 0 0 1 0" />
                    <feBlend in2="shape" result="effect1_innerShadow_981_3014" />
                </filter>
                <filter
                    id="prefix__filter5_i_981_3014"
                    x={1.25}
                    y={12.5}
                    width={7.125}
                    height={6.125}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix
                        in="SourceAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={1.5} dy={0.5} />
                    <feGaussianBlur stdDeviation={1} />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                    <feColorMatrix values="0 0 0 0 0.749966 0 0 0 0 0.634228 0 0 0 0 0.878564 0 0 0 1 0" />
                    <feBlend in2="shape" result="effect1_innerShadow_981_3014" />
                </filter>
                <filter
                    id="prefix__filter6_i_981_3014"
                    x={13.125}
                    y={12.5}
                    width={7.125}
                    height={6.125}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix
                        in="SourceAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={1.5} dy={0.5} />
                    <feGaussianBlur stdDeviation={1} />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                    <feColorMatrix values="0 0 0 0 0.749966 0 0 0 0 0.634228 0 0 0 0 0.878564 0 0 0 0.8 0" />
                    <feBlend in2="shape" result="effect1_innerShadow_981_3014" />
                </filter>
                <linearGradient
                    id="prefix__paint8_linear_981_3014"
                    x1={10}
                    y1={11.204}
                    x2={10}
                    y2={12.493}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#4F3C43" />
                    <stop offset={1} stopColor="#512756" />
                </linearGradient>
                <linearGradient
                    id="prefix__paint10_linear_981_3014"
                    x1={13.438}
                    y1={6.563}
                    x2={13.149}
                    y2={8.07}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#52383E" />
                    <stop offset={1} stopColor="#432A35" />
                </linearGradient>
                <linearGradient
                    id="prefix__paint17_linear_981_3014"
                    x1={16.64}
                    y1={12.175}
                    x2={13.672}
                    y2={15.783}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FFF8FF" />
                    <stop offset={0.455} stopColor="#D0C1DB" />
                    <stop offset={0.874} stopColor="#C28EEC" />
                </linearGradient>
                <clipPath id="prefix__clip0_981_3014">
                    <path fill="#fff" d="M0 0h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}


export function CryFace(props) {
    return (
        <svg
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g opacity={1} clipPath="url(#prefix__clip0_981_3349)">
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint0_radial_981_3349)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint1_radial_981_3349)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint2_radial_981_3349)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint3_radial_981_3349)"
                    fillOpacity={0.6}
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint4_radial_981_3349)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint5_radial_981_3349)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint6_radial_981_3349)"
                />
                <path
                    d="M10 18.749c5.833 0 8.749-3.918 8.749-8.75S15.833 1.25 9.999 1.25 1.25 5.167 1.25 10c0 4.831 2.915 8.749 8.75 8.749z"
                    fill="url(#prefix__paint7_radial_981_3349)"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.875 18.31V5H5.25a1.5 1.5 0 00-1.5 1.5v10.006c.833.8 1.875 1.421 3.125 1.805zm9.375-1.805c-.833.8-1.875 1.422-3.125 1.805V5h1.625a1.5 1.5 0 011.5 1.5v10.005z"
                    fill="url(#prefix__paint8_linear_981_3349)"
                />
                <path
                    d="M3.75 5.625s.313-.938 1.563-.938 1.562.938 1.562.938"
                    stroke="url(#prefix__paint9_radial_981_3349)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13.125 5.625s.313-.938 1.563-.938 1.562.938 1.562.938"
                    stroke="url(#prefix__paint10_radial_981_3349)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect
                    x={7.5}
                    y={6.875}
                    width={5}
                    height={6.25}
                    rx={2.5}
                    fill="url(#prefix__paint11_radial_981_3349)"
                />
            </g>
            <defs>
                <radialGradient
                    id="prefix__paint0_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(132.839 6.741 6.29) scale(23.4396)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint1_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(131.878 6.713 6.37) scale(24.3429)"
                >
                    <stop stopColor="#FFF478" />
                    <stop offset={0.475} stopColor="#FFB02E" />
                    <stop offset={1} stopColor="#F70A8D" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint2_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(101.31 1.798 8.005) scale(11.1541 14.2863)"
                >
                    <stop offset={0.788} stopColor="#F59639" stopOpacity={0} />
                    <stop offset={0.973} stopColor="#FF7DCE" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint3_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(135 3.813 6.705) scale(25.6326)"
                >
                    <stop offset={0.315} stopOpacity={0} />
                    <stop offset={1} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint4_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(77.692 -1.597 11.521) scale(17.5918)"
                >
                    <stop offset={0.508} stopColor="#7D6133" stopOpacity={0} />
                    <stop offset={1} stopColor="#715B32" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint5_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(55.713 -4.6 14.913) scale(8.32095 6.03145)"
                >
                    <stop stopColor="#FFB849" />
                    <stop offset={1} stopColor="#FFB847" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint6_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(9.866 -58.767 79.85) scale(7.29539)"
                >
                    <stop stopColor="#FFA64B" />
                    <stop offset={0.9} stopColor="#FFAE46" stopOpacity={0} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint7_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(43.971 -6.142 18.233) scale(36.9081)"
                >
                    <stop offset={0.185} stopOpacity={0} />
                    <stop offset={1} stopOpacity={0.4} />
                </radialGradient>
                <radialGradient
                    id="prefix__paint9_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(-90 5.781 .469) scale(2.1875)"
                >
                    <stop offset={0.405} stopColor="#432552" />
                    <stop offset={0.703} stopColor="#503F44" />
                    <stop offset={0.806} stopColor="#503F44" />
                    <stop offset={1} stopColor="#4C342C" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint10_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(0 -2.1875 2.1875 0 14.688 6.25)"
                >
                    <stop offset={0.405} stopColor="#432552" />
                    <stop offset={0.703} stopColor="#503F44" />
                    <stop offset={0.806} stopColor="#503F44" />
                    <stop offset={1} stopColor="#4C342C" />
                </radialGradient>
                <radialGradient
                    id="prefix__paint11_radial_981_3349"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(0 -7.63889 6.11111 0 10 14.514)"
                >
                    <stop stopColor="#F70A8D" />
                    <stop offset={1} stopColor="#89029C" />
                </radialGradient>
                <linearGradient
                    id="prefix__paint8_linear_981_3349"
                    x1={14.688}
                    y1={5}
                    x2={14.688}
                    y2={18.75}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6D9DFF" />
                    <stop offset={1} stopColor="#4864FF" />
                </linearGradient>
                <clipPath id="prefix__clip0_981_3349">
                    <path fill="#fff" d="M0 0h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}

export const BasketBallIcon = React.forwardRef((props, ref) => (
    <svg viewBox={"0 0 18 18"} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
        <path d="M15.75 9a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" stroke="#303030" strokeWidth={1.5} />
        <path d="M6 10.5c.684.91 1.773 1.5 3 1.5s2.316-.59 3-1.5M6.75 7.508V7.5M11.25 7.508V7.5" stroke="#303030" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
));