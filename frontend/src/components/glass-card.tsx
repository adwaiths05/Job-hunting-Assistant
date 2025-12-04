import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GlassCard({ children, className, animate = false }: GlassCardProps) {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      className={cn(
        'rounded-xl border border-white/10 dark:border-white/5',
        'bg-white/80 dark:bg-zinc-900/60',
        'backdrop-blur-md shadow-lg',
        'dark:shadow-2xl dark:shadow-black/20',
        className
      )}
      {...(animate ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      } : {})}
    >
      {children}
    </Component>
  );
}
