export default function Logo({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C7.58 2 4 5.58 4 10c0 6.5 8 12 8 12s8-5.5 8-12c0-4.42-3.58-8-8-8z"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="9.5"
        r="3.1"
        fill="#F5F2E6"
        stroke="#95C5B9"
        strokeWidth="1"
      />
    </svg>
  );
}