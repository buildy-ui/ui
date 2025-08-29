import React from 'react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string; // e.g., "text-primary"
  showFill?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 160,
  height = 60,
  strokeWidth = 2,
  className = 'text-primary',
  showFill = false,
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * innerW + padding;
    const y = height - padding - ((v - min) / range) * innerH;
    return [x, y];
  });

  const path = points
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(' ');

  const fillPath = showFill
    ? `${path} L ${points[points.length - 1][0]} ${height - padding} L ${points[0][0]} ${height - padding} Z`
    : undefined;

  return (
    <svg width={width} height={height} className={className} aria-hidden>
      {showFill && (
        <path d={fillPath!} fill="currentColor" opacity={0.1} />
      )}
      <path d={path} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};


