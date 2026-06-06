import type { ReactNode } from 'react';

type StickyColor = 'yellow' | 'pink' | 'blue' | 'green';

interface StickyNoteProps {
  children: ReactNode;
  color?: StickyColor;
  rotate?: number;
  className?: string;
}

const colorMap: Record<StickyColor, string> = {
  yellow: 'bg-sticky-yellow',
  pink: 'bg-sticky-pink',
  blue: 'bg-sticky-blue',
  green: 'bg-sticky-green',
};

export default function StickyNote({
  children,
  color = 'yellow',
  rotate = 0,
  className = '',
}: StickyNoteProps) {
  return (
    <div
      className={`sticky-note p-4 ${colorMap[color]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}
