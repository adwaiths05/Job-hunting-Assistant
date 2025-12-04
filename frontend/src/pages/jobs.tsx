import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, Building2, Clock, ExternalLink, Bookmark, X } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/page-header';
import { JobCard } from '@/components/job-card';
import { PulseScanner } from '@/components/pulse-scanner';
import { MatchRing } from '@/components/match-ring';
import { GradientText } from '@/components/gradient-text';
import { useJobStore, useUserStore } from '@/lib/store';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Job } from '@shared/schema';

const experienceLevels = [
  { value: 'entry', label: 'Entry' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'staff', label: 'Staff+' },
];

export default function Jobs() {
  const { selectedJob, setSelectedJob, filters, setFilters } = useJobStore();
  const { user } = useUserStore();
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const saveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await apiRequest('POST', '/api/applications', {
        userId: user?.id || 'demo',
        jobId,
        status: 'saved',
        appliedAt: '',
        coverLetter: '',
        notes: '',
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Job saved', description: 'Added to your tracker' });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save job', variant: 'destructive' });
    },
  });

  const filteredJobs = jobs.filter((job) => {
    if (filters.remote && !job.remote) return false;
    if (filters.experienceLevel.length > 0 && !filters.experienceLevel.includes(job.experienceLevel || '')) return false;
    if (job.salaryMin && job.salaryMin < filters.salaryMin) return false;
    if (job.salaryMax && job.salaryMax > filters.salaryMax) return false;
    if (filters.searchQuery && !job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !job.company.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleExperienceLevel = (level: string) => {
    const current = filters.experienceLevel;
    const updated = current.includes(level)
      ? current.filter(l => l !== level)
      : [...current, level];
    setFilters({ experienceLevel: updated });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col" data-testid="page-jobs">
      <PageHeader title="Job Discovery" />

      <div className="p-4">
        <PulseScanner />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border overflow-hidden flex-shrink-0"
              data-testid="panel-filters"
            >
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={() => setFilters({ 
                      salaryMin: 0, 
                      salaryMax: 300000, 
                      remote: false, 
                      experienceLevel: [],
                      searchQuery: ''
                    })} data-testid="button-clear-filters">
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Job title, company..."
                        className="pl-10"
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ searchQuery: e.target.value })}
                        data-testid="input-search-jobs"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Salary Range</Label>
                    <div className="px-2">
                      <Slider
                        value={[filters.salaryMin, filters.salaryMax]}
                        onValueChange={([min, max]) => setFilters({ salaryMin: min, salaryMax: max })}
                        min={0}
                        max={300000}
                        step={10000}
                        data-testid="slider-salary-range"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span data-testid="text-salary-min">${(filters.salaryMin / 1000).toFixed(0)}K</span>
                      <span data-testid="text-salary-max">${(filters.salaryMax / 1000).toFixed(0)}K+</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="remote-toggle">Remote Only</Label>
                      <Switch
                        id="remote-toggle"
                        checked={filters.remote}
                        onCheckedChange={(checked) => setFilters({ remote: checked })}
                        data-testid="switch-remote"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Experience Level</Label>
                    <div className="flex flex-wrap gap-2">
                      {experienceLevels.map((level) => (
                        <Badge
                          key={level.value}
                          variant={filters.experienceLevel.includes(level.value) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleExperienceLevel(level.value)}
                          data-testid={`chip-${level.value}`}
                        >
                          {level.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  data-testid="button-toggle-filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground" data-testid="text-jobs-count">
                  {filteredJobs.length} jobs found
                </span>
              </div>
            </div>

            <ScrollArea className="h-[calc(100%-57px)]">
              <div className="p-4 space-y-3">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse" data-testid={`skeleton-job-${i}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-full bg-muted" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/3" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => setSelectedJob(job)}
                      isSelected={selectedJob?.id === job.id}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <AnimatePresence>
            {selectedJob && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-border overflow-hidden flex-shrink-0"
                data-testid="panel-job-details"
              >
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <MatchRing score={selectedJob.matchScore || 0} size="lg" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedJob(null)}
                        data-testid="button-close-job-details"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <GradientText as="h2" className="text-xl font-bold mb-2" data-testid="text-selected-job-title">
                      {selectedJob.title}
                    </GradientText>

                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Building2 className="w-4 h-4" />
                      <span data-testid="text-selected-job-company">{selectedJob.company}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="gap-1" data-testid="badge-location">
                        <MapPin className="w-3 h-3" />
                        {selectedJob.location}
                      </Badge>
                      {selectedJob.remote && (
                        <Badge variant="secondary" data-testid="badge-remote">Remote</Badge>
                      )}
                      <Badge variant="secondary" className="gap-1" data-testid="badge-posted">
                        <Clock className="w-3 h-3" />
                        {selectedJob.postedAt}
                      </Badge>
                    </div>

                    <Card className="mb-4" data-testid="card-salary">
                      <CardContent className="p-4">
                        <p className="font-semibold text-lg" data-testid="text-salary">{selectedJob.salary}</p>
                        <p className="text-sm text-muted-foreground">Estimated salary range</p>
                      </CardContent>
                    </Card>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Why You Match</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.matchReasons?.map((reason, i) => (
                          <Badge key={i} variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" data-testid={`badge-match-reason-${i}`}>
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.requirements?.map((req, i) => (
                          <Badge key={i} variant="secondary" data-testid={`badge-requirement-${i}`}>
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-description">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" data-testid="button-apply-now">
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => saveJobMutation.mutate(selectedJob.id)}
                        disabled={saveJobMutation.isPending}
                        data-testid="button-save-job"
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
