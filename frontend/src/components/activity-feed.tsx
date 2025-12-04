import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Briefcase, Search, CheckCircle2, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'scan' | 'apply' | 'match' | 'interview' | 'ai';
  message: string;
  timestamp: string;
}

const mockActivities: Activity[] = [
  { id: '1', type: 'ai', message: 'AI applied to Google - Senior Frontend Engineer', timestamp: '2 min ago' },
  { id: '2', type: 'match', message: 'Found 3 new high-match jobs at Stripe', timestamp: '5 min ago' },
  { id: '3', type: 'scan', message: 'Scanned 47 new listings on LinkedIn', timestamp: '12 min ago' },
  { id: '4', type: 'interview', message: 'Interview scheduled with Netflix', timestamp: '1 hour ago' },
  { id: '5', type: 'apply', message: 'Application submitted to Airbnb', timestamp: '2 hours ago' },
  { id: '6', type: 'ai', message: 'AI optimized your resume for ML roles', timestamp: '3 hours ago' },
];

const iconMap = {
  scan: Search,
  apply: Briefcase,
  match: Sparkles,
  interview: CheckCircle2,
  ai: Bot,
};

const colorMap = {
  scan: 'text-blue-500 bg-blue-500/10',
  apply: 'text-emerald-500 bg-emerald-500/10',
  match: 'text-amber-500 bg-amber-500/10',
  interview: 'text-purple-500 bg-purple-500/10',
  ai: 'text-cyan-500 bg-cyan-500/10',
};

export function ActivityFeed() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">Recent Activity</h3>
      <ScrollArea className="h-[240px]">
        <div className="space-y-2 pr-4">
          <AnimatePresence>
            {mockActivities.map((activity, index) => {
              const Icon = iconMap[activity.type];
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-2 rounded-lg hover-elevate"
                  data-testid={`activity-item-${activity.id}`}
                >
                  <div className={cn('p-1.5 rounded-md', colorMap[activity.type])}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
