type IconProps = {
  className?: string;
};

const base = "h-4 w-4 shrink-0 fill-current";

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className ?? base}
    >
      <path
        d="M8.16699 4.45004L19.2003 16L8.16699 27.55L10.5003 30L23.8336 16L10.5003 2L8.16699 4.45004Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className ?? base}
    >
      <path
        d="M29.3337 2.375V13.575H26.667V7.10701L13.8403 20.575L12.0003 18.643L24.827 5.175H18.667V2.375H29.3337ZM13.3337 2.375V5.175H5.33366V27.575H26.667V19.175H29.3337V30.375H2.66699V2.375H13.3337Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BurgerIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className ?? base}
    >
      <path
        d="M2 4.125V7.625H30V4.125H2ZM2 18.125H30V14.625H2V18.125ZM2 28.625H30V25.125H2V28.625Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className ?? base}
    >
      <path
        d="M27.05 2.5L16 13.55L4.95 2.5L2.5 4.95L13.55 16L2.5 27.05L4.95 29.5L16 18.45L27.05 29.5L29.5 27.05L18.45 16L29.5 4.95L27.05 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PeruFlagIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className ?? base}
    >
      <g clipPath="url(#pe-flag-clip)">
        <path d="M0 5.33325H32V26.6661H0V5.33325Z" fill="white" />
        <path
          d="M0 5.33325L10.6664 5.33325V26.6668L0 26.6661V5.33325ZM21.3336 5.33325L32 5.33325V26.6661L21.3336 26.6668V5.33325Z"
          fill="#D80027"
        />
      </g>
      <defs>
        <clipPath id="pe-flag-clip">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
