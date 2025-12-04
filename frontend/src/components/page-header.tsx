import { SidebarTrigger } from '@/components/ui/sidebar';
import { StreakBadge, LevelBadge } from './streak-badge';
import { useUserStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  title?: string;
  showStats?: boolean;
}

export function PageHeader({ title, showStats = true }: PageHeaderProps) {
  const { user } = useUserStore();

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        {title && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </>
        )}
      </div>
      
      {showStats && (
        <div className="flex items-center gap-2">
          <StreakBadge streak={user?.streak || 5} />
          <LevelBadge level={user?.level || 3} />
        </div>
      )}
    </header>
  );
}
