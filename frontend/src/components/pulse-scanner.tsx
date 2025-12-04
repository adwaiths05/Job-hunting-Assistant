import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';

interface PulseScannerProps {
  message?: string;
}

export function PulseScanner({ message = 'Scanning LinkedIn & Indeed...' }: PulseScannerProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-500/30"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />
        <Radar className="relative w-5 h-5 text-blue-500 dark:text-blue-400" />
      </div>
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {message}
      </span>
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
