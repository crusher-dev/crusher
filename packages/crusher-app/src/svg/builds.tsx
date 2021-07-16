function CommentIconSVG(props) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.607.001H1.393C.623.001 0 .625 0 1.394v7.428c0 .77.624 1.393 1.393 1.393H3.04l-.252 2.27a.464.464 0 00.772.397l2.963-2.667h5.083c.77 0 1.393-.623 1.393-1.393V1.394C13 .624 12.376 0 11.607 0zm.464 8.821a.464.464 0 01-.464.465H6.345a.464.464 0 00-.31.119l-2.189 1.97.175-1.573a.464.464 0 00-.461-.516H1.393a.464.464 0 01-.464-.465V1.394c0-.257.207-.464.464-.464h10.214c.257 0 .464.207.464.464v7.428z"
        fill="#D0D0D0"
      />
    </svg>
  )
}

function DangerIconSVG(props) {
    return (
        <svg
          width={17}
          height={15}
          viewBox="0 0 17 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M16.85 13.146L9.392.777a1.042 1.042 0 00-1.784 0L.15 13.147a1.042 1.042 0 00.892 1.579h14.916a1.042 1.042 0 00.892-1.58zM8.506 4.552c.428 0 .79.242.79.67 0 1.307-.153 3.185-.153 4.492 0 .34-.374.483-.637.483-.352 0-.648-.142-.648-.483 0-1.307-.154-3.185-.154-4.492 0-.428.351-.67.802-.67zm.01 8.095a.846.846 0 01-.845-.846.84.84 0 01.846-.846c.45 0 .834.385.834.846 0 .45-.384.846-.834.846z"
            fill="#F344AD"
          />
        </svg>
      );
}

function ClockIconSVG(props) {
    return (
        <svg
          width={13}
          height={13}
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M6.5 0A6.507 6.507 0 000 6.5C0 10.084 2.916 13 6.5 13S13 10.084 13 6.5 10.084 0 6.5 0zm0 11.631A5.137 5.137 0 011.369 6.5 5.137 5.137 0 016.5 1.369 5.137 5.137 0 0111.631 6.5 5.137 5.137 0 016.5 11.631z"
            fill="#fff"
            fillOpacity={0.6}
          />
          <path
            d="M9.21 6.572H6.546V4.264a.684.684 0 10-1.37 0v2.992c0 .378.307.685.685.685h3.35a.684.684 0 100-1.37z"
            fill="#fff"
            fillOpacity={0.6}
          />
        </svg>
      )
}

function DropdownIconSVG(props) {
    return (
      <svg
        width={9}
        height={9}
        viewBox="0 0 9 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g clipPath="url(#prefix__clip0)">
          <path
            d="M4.5 7.065a.628.628 0 01-.446-.185L.184 3.01a.63.63 0 11.892-.89L4.5 5.542 7.924 2.12a.63.63 0 01.891.892l-3.87 3.87a.628.628 0 01-.445.184z"
            fill="#BDBDBD"
            fillOpacity={0.7}
          />
        </g>
        <defs>
          <clipPath id="prefix__clip0">
            <path fill="#fff" d="M0 0h9v9H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }

export {CommentIconSVG, DangerIconSVG, ClockIconSVG, DropdownIconSVG};