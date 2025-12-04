import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function GradientText({ children, className, as: Component = 'span' }: GradientTextProps) {
  return (
    <Component
      className={cn(
        'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Component>
  );
}
