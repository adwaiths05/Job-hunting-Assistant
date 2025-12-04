import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, Briefcase, ExternalLink, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MatchRing } from './match-ring';
import { cn } from '@/lib/utils';
import type { Job } from '@shared/schema';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  isSelected?: boolean;
}

export function JobCard({ job, onClick, isSelected }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200',
          isSelected && 'ring-2 ring-primary'
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`card-job-${job.id}`}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <MatchRing score={job.matchScore || 0} size="md" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground truncate">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
                {job.remote && (
                  <Badge variant="secondary" className="text-xs">
                    Remote
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{job.postedAt}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-sm font-medium text-foreground">{job.salary}</span>
              </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  height: isHovered ? 'auto' : 0
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Why you match:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.matchReasons?.map((reason, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.requirements?.slice(0, 4).map((req, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                ))}
                {job.requirements && job.requirements.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.requirements.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
