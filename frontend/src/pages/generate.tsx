import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Wand2, Download, Save, Zap, Copy, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from '@/components/page-header';
import { GradientText } from '@/components/gradient-text';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type Tone = 'professional' | 'casual' | 'bold';

const tones: { value: Tone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and polished' },
  { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
  { value: 'bold', label: 'Bold', description: 'Confident and impactful' },
];

export default function Generate() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async ({ jobDescription, tone }: { jobDescription: string; tone: Tone }) => {
      const res = await apiRequest('POST', '/api/generate/cover-letter', { jobDescription, tone });
      return res.json() as Promise<{ content: string }>;
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: 'Cover letter generated!',
        description: 'Your personalized cover letter is ready.',
      });
    },
    onError: () => {
      toast({
        title: 'Generation failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleGenerate = () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Job description required',
        description: 'Please paste a job description to generate a cover letter.',
        variant: 'destructive',
      });
      return;
    }
    generateMutation.mutate({ jobDescription, tone: selectedTone });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied to clipboard',
      description: 'Cover letter copied successfully.',
    });
  };

  const handleExportPDF = () => {
    toast({
      title: 'Export to PDF',
      description: 'PDF export feature coming soon!',
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: 'Template saved',
      description: 'Cover letter saved to your templates.',
    });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col" data-testid="page-generate">
      <PageHeader title="Application Generator" />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <GradientText as="h2" className="text-lg font-semibold">
              Job Description
            </GradientText>
            <p className="text-sm text-muted-foreground mt-1">
              Paste the job description to generate a tailored cover letter
            </p>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 min-h-0">
              <Textarea
                placeholder="Paste the job description here...

Example:
We're looking for a Senior Frontend Engineer to join our team. You'll be responsible for building user interfaces using React and TypeScript..."
                className="h-full resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                data-testid="textarea-job-description"
              />
            </div>

            <div className="space-y-3">
              <Label>Select Tone</Label>
              <div className="flex gap-2">
                {tones.map((tone) => (
                  <Button
                    key={tone.value}
                    variant={selectedTone === tone.value ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setSelectedTone(tone.value)}
                    data-testid={`button-tone-${tone.value}`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-xs opacity-70">{tone.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !jobDescription.trim()}
              className="w-full"
              data-testid="button-generate"
            >
              {generateMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between gap-2">
            <div>
              <GradientText as="h2" className="text-lg font-semibold">
                Generated Output
              </GradientText>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered cover letter tailored to the job
              </p>
            </div>
            {generatedContent && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} data-testid="button-copy">
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF} data-testid="button-export-pdf">
                  <Download className="w-4 h-4 mr-1" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveTemplate} data-testid="button-save-template">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {generatedContent ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card data-testid="card-generated-content">
                    <CardContent className="p-6">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed" data-testid="text-generated-content">
                          {generatedContent}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-2" data-testid="text-no-content">No content generated yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Paste a job description and click generate to create a personalized cover letter
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <Button variant="secondary" className="w-full" disabled data-testid="button-auto-apply">
              <Zap className="w-4 h-4 mr-2" />
              Auto-Apply
              <Badge variant="outline" className="ml-2 text-xs">Coming Soon</Badge>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
