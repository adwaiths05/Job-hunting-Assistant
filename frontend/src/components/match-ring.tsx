import { cn } from '@/lib/utils';

interface MatchRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function MatchRing({ score, size = 'md', showLabel = true }: MatchRingProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
  };

  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const radius = size === 'sm' ? 16 : size === 'md' ? 22 : 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
    if (score >= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-zinc-400 dark:text-zinc-500';
  };

  const getStrokeColor = () => {
    if (score >= 80) return 'stroke-emerald-500 dark:stroke-emerald-400';
    if (score >= 50) return 'stroke-amber-500 dark:stroke-amber-400';
    return 'stroke-zinc-400 dark:stroke-zinc-500';
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          className={cn('transition-all duration-500', getStrokeColor())}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <span className={cn('font-semibold', getColor())}>
          {score}%
        </span>
      )}
    </div>
  );
}
