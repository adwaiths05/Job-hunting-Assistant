import { motion } from 'framer-motion';
import { TrendingUp, Target, Calendar, Briefcase, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { GradientText } from '@/components/gradient-text';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const skillsData = [
  { skill: 'React', you: 90, market: 85 },
  { skill: 'TypeScript', you: 85, market: 80 },
  { skill: 'Node.js', you: 75, market: 70 },
  { skill: 'System Design', you: 60, market: 75 },
  { skill: 'AWS', you: 55, market: 80 },
  { skill: 'Python', you: 70, market: 65 },
];

const weeklyActivity = [
  { day: 'Mon', applications: 4, interviews: 1 },
  { day: 'Tue', applications: 6, interviews: 0 },
  { day: 'Wed', applications: 3, interviews: 2 },
  { day: 'Thu', applications: 5, interviews: 1 },
  { day: 'Fri', applications: 7, interviews: 0 },
  { day: 'Sat', applications: 2, interviews: 0 },
  { day: 'Sun', applications: 1, interviews: 0 },
];

const kpiCards = [
  { 
    title: 'Interview Rate', 
    value: '29%', 
    change: '+5%',
    trend: 'up',
    description: '7 interviews from 24 applications',
    icon: Calendar 
  },
  { 
    title: 'Response Rate', 
    value: '42%', 
    change: '+8%',
    trend: 'up',
    description: '10 responses from 24 applications',
    icon: TrendingUp 
  },
  { 
    title: 'Avg Match Score', 
    value: '84%', 
    change: '+12%',
    trend: 'up',
    description: 'Based on your skills and preferences',
    icon: Target 
  },
  { 
    title: 'Active Applications', 
    value: '18', 
    change: '-2',
    trend: 'down',
    description: '6 moved to interview stage',
    icon: Briefcase 
  },
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

export default function Analytics() {
  return (
    <div className="flex-1 overflow-auto">
      <PageHeader title="Analytics" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        <motion.div variants={item}>
          <GradientText as="h1" className="text-2xl font-bold mb-2">
            Your Job Search Performance
          </GradientText>
          <p className="text-muted-foreground">
            Track your progress and optimize your strategy
          </p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="hover-elevate">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <span className={`text-xs flex items-center ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Skills vs. Market Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="skill" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    />
                    <Radar
                      name="Your Skills"
                      dataKey="you"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Market Demand"
                      dataKey="market"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="applications" 
                      name="Applications" 
                      fill="hsl(var(--chart-1))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="interviews" 
                      name="Interviews" 
                      fill="hsl(var(--chart-3))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Skills Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map((skill) => {
                  const gap = skill.market - skill.you;
                  const isDeficit = gap > 0;
                  return (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{skill.skill}</span>
                        <span className={isDeficit ? 'text-amber-500' : 'text-emerald-500'}>
                          {isDeficit ? `-${gap}% below market` : `+${Math.abs(gap)}% above market`}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isDeficit ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${skill.you}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
