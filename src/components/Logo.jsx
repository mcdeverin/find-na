export default function Logo({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="34" />
      {/* folding chair */}
      <path d="M42 34 L54 34" />
      <path d="M42 34 L42 52" />
      <path d="M42 52 L60 52" />
      <path d="M60 52 L64 70" />
      <path d="M42 52 L38 70" />
    </svg>
  );
}