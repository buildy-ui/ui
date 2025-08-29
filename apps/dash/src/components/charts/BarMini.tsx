import React from 'react';

export interface BarMiniProps {
  data: number[];
  width?: number;
  height?: number;
  gap?: number; // px between bars
  className?: string; // e.g., "text-secondary"
  rounded?: number; // border radius for bars
}

export const BarMini: React.FC<BarMiniProps> = ({
  data,
  width = 160,
  height = 60,
  gap = 2,
  className = 'text-secondary',
  rounded = 2,
}) => {
  if (!data || data.length === 0) return null;
  const min = 0;
  const max = Math.max(...data);
  const count = data.length;
  const barWidth = Math.max(1, Math.floor((width - gap * (count - 1)) / count));

  return (
    <svg width={width} height={height} className={className} aria-hidden>
      {data.map((v, i) => {
        const h = max === 0 ? 0 : Math.round((v / max) * height);
        const x = i * (barWidth + gap);
        const y = height - h;
        return (
          <rect key={i} x={x} y={y} width={barWidth} height={h} rx={rounded} ry={rounded} fill="currentColor" opacity={0.9} />
        );
      })}
    </svg>
  );
};


