/**
 * lucide-react 1.0 removed all brand/logo icons (Facebook, Instagram, YouTube,
 * GitHub, etc.) due to trademark concerns — see https://lucide.dev/guide/version-1
 * These are small generic stand-ins drawn in the same outline style as the
 * rest of the Lucide set (24x24 viewBox, round caps, currentColor stroke),
 * not a reproduction of the official brand marks.
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconFacebook({ size = 16, color = "currentColor", ...props }) {
  return (
    <svg width={size} height={size} stroke={color} {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M14 8.5h-1.5A1.5 1.5 0 0 0 11 10v2M9 12h5M13 12v6" />
    </svg>
  );
}

export function IconInstagram({ size = 16, color = "currentColor", ...props }) {
  return (
    <svg width={size} height={size} stroke={color} {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.6" fill={color} stroke="none" />
    </svg>
  );
}

export function IconYoutube({ size = 16, color = "currentColor", ...props }) {
  return (
    <svg width={size} height={size} stroke={color} {...base} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.3v5.4l4.7-2.7-4.7-2.7Z" fill={color} stroke="none" />
    </svg>
  );
}
