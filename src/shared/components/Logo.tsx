/**
 * Saad Cargo brandmark — locomotive in a navy badge.
 * Mirrors the favicon and the saad-cargo-landing Logo component.
 *
 * Uses the navy + saffron palette from `index.css`. The mark stays the same
 * in light/dark mode because the sidebar (where it lives) is always navy.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="64" height="64" rx="10" fill="#0E1A2D" />
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="9.5"
        fill="none"
        stroke="#FF7733"
        strokeOpacity="0.45"
      />
      {/* Locomotive */}
      <g fill="#FF7733">
        <rect x="14" y="22" width="32" height="20" rx="2" />
        <rect x="44" y="26" width="6" height="12" rx="1" />
        <rect x="20" y="14" width="14" height="8" rx="2" />
      </g>
      {/* Cab windows */}
      <g fill="#0E1A2D">
        <rect x="22" y="18" width="4" height="3" rx="0.5" />
        <rect x="28" y="18" width="4" height="3" rx="0.5" />
      </g>
      {/* Wheels */}
      <g fill="#E4ECF5">
        <circle cx="22" cy="46" r="4" />
        <circle cx="38" cy="46" r="4" />
      </g>
      <g fill="#0E1A2D">
        <circle cx="22" cy="46" r="1.5" />
        <circle cx="38" cy="46" r="1.5" />
      </g>
      <line x1="10" y1="54" x2="54" y2="54" stroke="#FF7733" strokeWidth="1" opacity="0.55" />
    </svg>
  );
}
