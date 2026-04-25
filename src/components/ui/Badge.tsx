// ============================================================
// Vex — Cross the line.
// Badge — Reusable badge/pill component
// ============================================================

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'filled' | 'outline' | 'subtle';
  size?: 'xs' | 'sm';
  className?: string;
}

export default function Badge({
  children,
  color,
  variant = 'subtle',
  size = 'xs',
  className,
}: BadgeProps) {
  const baseClasses = cn(
    'inline-flex items-center font-medium rounded-md',
    size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
    className
  );

  if (variant === 'filled' && color) {
    return (
      <span
        className={baseClasses}
        style={{
          backgroundColor: color,
          color: '#050505',
        }}
      >
        {children}
      </span>
    );
  }

  if (variant === 'outline' && color) {
    return (
      <span
        className={baseClasses}
        style={{
          color,
          borderWidth: '1px',
          borderColor: `${color}40`,
        }}
      >
        {children}
      </span>
    );
  }

  // Default: subtle
  return (
    <span
      className={baseClasses}
      style={
        color
          ? {
              color,
              backgroundColor: `${color}15`,
              border: `1px solid ${color}25`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
