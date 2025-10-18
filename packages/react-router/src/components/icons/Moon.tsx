interface Props {
  title?: string;
  className?: string;
}

export function MoonIcon({ title, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      height="16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon${className ? ' ' + className : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {title && <title>{title}</title>}
      <path d="M21 12.79a9 9 0 1 1-9.79-9.79 7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}

