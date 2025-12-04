import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Wand2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from '@/components/page-header';
import { GradientText } from '@/components/gradient-text';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import type { ResumeAnalysis } from '@shared/schema';

const sampleResume = `John Doe
Senior Software Engineer

EXPERIENCE

Senior Frontend Engineer | Google | 2021 - Present
- Led the development of a new customer dashboard, resulting in a 40% increase in user engagement
- Built and architected a component library used by 15+ teams across the organization
- Developed real-time data visualization features that improved decision-making by 25%
- Helped establish coding standards and best practices for the frontend team

Software Engineer | Meta | 2018 - 2021
- Worked on the core React codebase, implementing new features and fixing bugs
- Tried to optimize bundle size, achieving a 30% reduction in load times
- Assisted in migrating legacy jQuery code to modern React components
- Participated in code reviews and mentored junior developers

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, GraphQL, System Design

EDUCATION
BS Computer Science | Stanford University | 2018`;

export default function Documents() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest('POST', '/api/resume/analyze', { text });
      return res.json() as Promise<ResumeAnalysis>;
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });

  const handleAnalyze = () => {
    if (!resumeText.trim()) {
      setResumeText(sampleResume);
      return;
    }
    analyzeMutation.mutate(resumeText);
  };

  const renderHighlightedText = () => {
    if (!analysis) return resumeText;

    const allHighlights = [
      ...analysis.actionVerbs.map(h => ({ ...h, type: 'action' as const })),
      ...analysis.metrics.map(h => ({ ...h, type: 'metric' as const })),
      ...analysis.weakWords.map(h => ({ ...h, type: 'weak' as const })),
    ].sort((a, b) => a.start - b.start);

    if (allHighlights.length === 0) return resumeText;

    const parts: JSX.Element[] = [];
    let lastEnd = 0;

    allHighlights.forEach((highlight, index) => {
      if (highlight.start > lastEnd) {
        parts.push(
          <span key={`text-${index}`}>
            {resumeText.slice(lastEnd, highlight.start)}
          </span>
        );
      }

      const colorClass = 
        highlight.type === 'action' ? 'bg-emerald-500/30 text-emerald-700 dark:text-emerald-300' :
        highlight.type === 'metric' ? 'bg-blue-500/30 text-blue-700 dark:text-blue-300' :
        'bg-red-500/30 text-red-700 dark:text-red-300';

      parts.push(
        <span key={`highlight-${index}`} className={cn('px-0.5 rounded', colorClass)} data-testid={`highlight-${highlight.type}-${index}`}>
          {highlight.word}
        </span>
      );

      lastEnd = highlight.end;
    });

    if (lastEnd < resumeText.length) {
      parts.push(<span key="text-end">{resumeText.slice(lastEnd)}</span>);
    }

    return parts;
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col" data-testid="page-documents">
      <PageHeader title="Resume Intelligence" />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <GradientText as="h2" className="text-lg font-semibold">
              Resume Input
            </GradientText>
            <p className="text-sm text-muted-foreground mt-1">
              Paste your resume to analyze with AI
            </p>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 min-h-0">
              <Textarea
                placeholder="Paste your resume text here..."
                className="h-full resize-none font-mono text-sm"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                data-testid="textarea-resume-input"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setResumeText(sampleResume)}
                data-testid="button-load-sample"
              >
                <FileText className="w-4 h-4 mr-2" />
                Load Sample
              </Button>
              <Button
                className="flex-1"
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending}
                data-testid="button-analyze"
              >
                {analyzeMutation.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <GradientText as="h2" className="text-lg font-semibold">
              Analysis Results
            </GradientText>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered resume insights and recommendations
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {analysis ? (
                <>
                  <Card data-testid="card-resume-score">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Resume Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold" data-testid="text-score">{analysis.score}</div>
                        <Progress value={analysis.score} className="flex-1" />
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-heatmap-legend">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Heatmap Legend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2" data-testid="legend-action-verbs">
                          <span className="w-4 h-4 rounded bg-emerald-500/30" />
                          <span>Action Verbs ({analysis.actionVerbs.length})</span>
                        </div>
                        <div className="flex items-center gap-2" data-testid="legend-metrics">
                          <span className="w-4 h-4 rounded bg-blue-500/30" />
                          <span>Metrics ({analysis.metrics.length})</span>
                        </div>
                        <div className="flex items-center gap-2" data-testid="legend-weak-words">
                          <span className="w-4 h-4 rounded bg-red-500/30" />
                          <span>Weak Words ({analysis.weakWords.length})</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-highlighted-resume">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Highlighted Resume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed" data-testid="text-highlighted-resume">
                        {renderHighlightedText()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-missing-skills">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Missing Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Skills commonly requested in your target roles:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" data-testid={`badge-missing-skill-${i}`}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-recommendations">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2" data-testid="recommendation-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>Replace weak words like "Helped" and "Tried" with strong action verbs</span>
                        </li>
                        <li className="flex items-start gap-2" data-testid="recommendation-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>Add more quantifiable metrics to demonstrate impact</span>
                        </li>
                        <li className="flex items-start gap-2" data-testid="recommendation-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>Consider adding skills like Kubernetes and GraphQL for better match rates</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="h-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-2" data-testid="text-no-analysis">No analysis yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Paste your resume and click analyze to get AI-powered insights
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
