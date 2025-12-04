import { Flame, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

interface LevelBadgeProps {
  level: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        className
      )}
      data-testid="badge-streak"
    >
      <Flame className="w-3.5 h-3.5" />
      <span>{streak} Day Streak</span>
    </Badge>
  );
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const levelTitles: Record<number, string> = {
    1: 'Rookie Hunter',
    2: 'Job Seeker',
    3: 'Career Explorer',
    4: 'Opportunity Finder',
    5: 'Master Hunter',
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        className
      )}
      data-testid="badge-level"
    >
      <Trophy className="w-3.5 h-3.5" />
      <span>Level {level} {levelTitles[level] || 'Hunter'}</span>
    </Badge>
  );
}
