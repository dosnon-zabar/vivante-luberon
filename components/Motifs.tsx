/** Étoile/astérisque orange — motif identitaire Vivante */
export function EtoileOrange({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M20 0 L23 15 L40 20 L23 25 L20 40 L17 25 L0 20 L17 15 Z"
        fill="#E8792B"
      />
    </svg>
  );
}

/** Petite étoile bleu-gris (comme dans le logo) */
export function EtoileBleu({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z"
        fill="#8B9DAF"
      />
    </svg>
  );
}

/** Cercle soleil jaune */
export function Soleil({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="20" fill="#F2C94C" />
    </svg>
  );
}

/** Demi-cercle jaune */
export function DemiSoleil({ className = "w-16 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" fill="none" className={className}>
      <path d="M0 32 A32 32 0 0 1 64 32 Z" fill="#F2C94C" />
    </svg>
  );
}

/** Virgule/courbe pêche */
export function CourbePeche({ className = "w-10 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 80" fill="none" className={className}>
      <path
        d="M30 0 C30 0 40 20 35 40 C30 60 10 70 5 80"
        stroke="#E8B4A0"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Petite ondulation verte */
export function OndeVerte({ className = "w-8 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 20" fill="none" className={className}>
      <path
        d="M0 10 Q10 0 20 10 Q30 20 40 10"
        stroke="#8EC8B0"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
