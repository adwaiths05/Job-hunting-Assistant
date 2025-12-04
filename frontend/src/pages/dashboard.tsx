import { motion } from 'framer-motion';
import { TrendingUp, Briefcase, Calendar, Target, Bot, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/page-header';
import { ActivityFeed } from '@/components/activity-feed';
import { PulseScanner } from '@/components/pulse-scanner';
import { GradientText } from '@/components/gradient-text';
import { MatchRing } from '@/components/match-ring';
import { useUserStore } from '@/lib/store';
import type { Job, Application } from '@shared/schema';

const stats = [
  { title: 'Jobs Applied', value: '24', change: '+5 this week', icon: Briefcase, color: 'text-blue-500' },
  { title: 'Interviews', value: '7', change: '+2 scheduled', icon: Calendar, color: 'text-purple-500' },
  { title: 'Match Rate', value: '86%', change: '+12% improved', icon: Target, color: 'text-emerald-500' },
  { title: 'Response Rate', value: '42%', change: 'Above average', icon: TrendingUp, color: 'text-amber-500' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user } = useUserStore();

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const { data: agentStatus } = useQuery<{ isActive: boolean; currentTask: string; jobsScanned: number }>({
    queryKey: ['/api/agent/status'],
    refetchInterval: 10000,
  });

  const topMatches = jobs
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 3);

  return (
    <div className="flex-1 overflow-auto" data-testid="page-dashboard">
      <PageHeader title="Dashboard" />
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        <motion.div variants={item}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <GradientText as="h1" className="text-2xl font-bold" data-testid="text-welcome">
                Welcome back, {user?.name?.split(' ')[0] || 'Hunter'}!
              </GradientText>
              <p className="text-muted-foreground mt-1" data-testid="text-subtitle">
                Your AI assistant has been working hard on your job search.
              </p>
            </div>
            <PulseScanner message={agentStatus?.currentTask || 'Scanning job boards...'} />
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover-elevate" data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1" data-testid={`text-stat-value-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <Card data-testid="card-top-matches">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-lg">Top Matches Today</CardTitle>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-jobs">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {topMatches.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Loading jobs...</p>
                ) : (
                  topMatches.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover-elevate cursor-pointer"
                      data-testid={`job-match-${job.id}`}
                    >
                      <MatchRing score={job.matchScore || 0} size="sm" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate" data-testid={`text-job-title-${job.id}`}>{job.title}</h4>
                        <p className="text-sm text-muted-foreground" data-testid={`text-job-company-${job.id}`}>{job.company}</p>
                      </div>
                      <Badge variant="secondary" data-testid={`badge-salary-${job.id}`}>{job.salary}</Badge>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full" data-testid="card-activity-feed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20" data-testid="card-agent-status">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-semibold text-lg">AI Agent Status</h3>
                  <p className="text-sm text-muted-foreground mt-1" data-testid="text-agent-stats">
                    Your AI agent has scanned <span className="font-semibold text-foreground">{agentStatus?.jobsScanned || 0}</span> jobs 
                    and found <span className="font-semibold text-foreground">12 high-match</span> opportunities today.
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <Progress value={75} className="flex-1 max-w-xs" />
                      <span className="font-medium">75%</span>
                    </div>
                  </div>
                </div>
                <Link href="/jobs">
                  <Button data-testid="button-explore-jobs">
                    Explore Jobs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
