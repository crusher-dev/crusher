const CloudIcon = ({ shouldAnimateGreen, ...props }) => {
    return (
        <svg viewBox={"0 0 16 11"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            {shouldAnimateGreen ? (
                <linearGradient id="lg" x1="0.5" y1="1" x2="0.5" y2="0">
                    <stop offset="0%" stop-opacity="1" stop-color="#E42475" />
                    <stop offset="40%" stop-opacity="1" stop-color="#E42475">
                        <animate attributeName="offset" values="0;1" repeatCount="indefinite" dur="0.8s" begin="0s" />
                    </stop>
                    <stop offset="40%" stop-opacity="0" stop-color="#E42475">
                        <animate attributeName="offset" values="0;1" repeatCount="indefinite" dur="0.8s" begin="0s" />
                    </stop>
                    <stop offset="100%" stop-opacity="0" stop-color="#E42475" />
                </linearGradient>
            ) : (
                ""
            )}
            <path
                d="M12.854 4.47C12.566 1.953 10.504 0 8 0 5.497 0 3.433 1.953 3.147 4.47 1.409 4.47 0 5.932 0 7.735 0 9.538 1.409 11 3.146 11h9.708C14.59 11 16 9.538 16 7.735c0-1.803-1.409-3.265-3.146-3.265Z"
                fill={shouldAnimateGreen ? "url(#lg)" : "#E42475"}
                stroke={"#fff"}
                strokeWidth="0.5"
            />
        </svg>
    );
};

const DocsIcon = (props) => (
    <svg
      viewBox={"0 0 16 16"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 2c1.245 0 2.459.39 3.471 1.115l-1.442 1.442a3.974 3.974 0 0 0-4.058 0L4.529 3.115A5.958 5.958 0 0 1 8 2Zm2 6a1.738 1.738 0 0 1-.031.309 1.99 1.99 0 0 1-1.66 1.66 1.552 1.552 0 0 1-.617 0 1.991 1.991 0 0 1-1.661-1.66 1.55 1.55 0 0 1 0-.617 1.99 1.99 0 0 1 1.66-1.661 1.55 1.55 0 0 1 .618 0 1.99 1.99 0 0 1 1.66 1.66c.02.102.03.205.031.309ZM2 8c0-1.245.39-2.459 1.115-3.471l1.442 1.442a3.974 3.974 0 0 0 0 4.058l-1.442 1.442A5.959 5.959 0 0 1 2 8Zm6 6a5.958 5.958 0 0 1-3.471-1.115l1.442-1.442a3.974 3.974 0 0 0 4.058 0l1.442 1.442A5.958 5.958 0 0 1 8 14Zm4.885-2.529-1.442-1.442a3.974 3.974 0 0 0 0-4.058l1.442-1.442a5.96 5.96 0 0 1 0 6.942Z"
        fill="#CDCDCD"
      />
    </svg>
);
  
const NotepadIcon = (props) => (
    <svg
      viewBox={"0 0 14 14"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.261 3.661a.778.778 0 0 0-1.1 0l-5.5 5.5a.778.778 0 1 0 1.1 1.1l5.5-5.5a.778.778 0 0 0 0-1.1Z"
        fill="#BDBDBD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2.333A2.333 2.333 0 0 1 2.333 0h9.334A2.333 2.333 0 0 1 14 2.333v9.334A2.333 2.333 0 0 1 11.667 14H2.333A2.333 2.333 0 0 1 0 11.667V2.333Zm2.333-.777h9.334c.43 0 .777.348.777.777v9.334c0 .43-.348.777-.777.777H2.333a.778.778 0 0 1-.777-.777V2.333c0-.43.348-.777.777-.777Z"
        fill="#BDBDBD"
      />
    </svg>
);

const ConsoleIcon = (props) => (
  <svg
    viewBox={"0 0 11 11"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.533 0H1.467A1.42 1.42 0 0 0 .43.46C.155.756 0 1.156 0 1.572V9.43c0 .416.155.816.43 1.11.275.295.648.46 1.037.461h8.066a1.42 1.42 0 0 0 1.037-.46c.275-.295.43-.695.43-1.111V1.57c0-.416-.155-.816-.43-1.11A1.42 1.42 0 0 0 9.533 0Zm-7.7 5.5a.35.35 0 0 1-.212-.072.391.391 0 0 1-.134-.19.42.42 0 0 1-.006-.24.396.396 0 0 1 .123-.198L3.08 3.536 1.604 2.27a.413.413 0 0 1 .052-.651.35.35 0 0 1 .407.037L3.896 3.23a.39.39 0 0 1 .101.136.416.416 0 0 1-.101.477L2.063 5.414a.352.352 0 0 1-.23.086Zm3.667 0H4.033a.355.355 0 0 1-.259-.115.408.408 0 0 1-.107-.278c0-.104.038-.204.107-.278a.355.355 0 0 1 .26-.115H5.5c.097 0 .19.042.26.115a.408.408 0 0 1 .107.278.408.408 0 0 1-.108.278.355.355 0 0 1-.259.115Z"
      fill="#858585"
    />
  </svg>
)


const PointerIcon = (props) => (
  <svg
    viewBox={"0 0 8 8"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.154.18c.24.215.259.584.043.823L1.503 7.178c-.215.24-.76.216-1 0-.239-.215-.215-.76 0-1L6.33.223a.583.583 0 0 1 .824-.044Z"
      fill="#3C3C3D"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.356.949A.583.583 0 0 1 .908.336L6.733.03a.583.583 0 0 1 .613.552l.305 5.826a.583.583 0 1 1-1.165.06l-.274-5.242-5.243.275A.583.583 0 0 1 .356.949Z"
      fill="#3C3C3D"
    />
  </svg>
)


export {
    CloudIcon,
    DocsIcon,
    NotepadIcon,
    ConsoleIcon,
    PointerIcon
}