import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileText, Target, ArrowRight, ArrowLeft, Upload, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { GlassCard } from '@/components/glass-card';
import { GradientText } from '@/components/gradient-text';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUserStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Profile', icon: User },
  { id: 2, title: 'Resume', icon: FileText },
  { id: 3, title: 'Preferences', icon: Target },
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6-10 years)' },
  { value: 'staff', label: 'Staff/Principal (10+ years)' },
];

const skillSuggestions = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL',
  'Machine Learning', 'Data Science', 'DevOps', 'CI/CD',
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    experience: '',
    resumeText: '',
    skills: [] as string[],
    targetSalary: 100000,
    workPreference: 'remote' as 'remote' | 'onsite' | 'hybrid',
  });

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setLocation('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.experience;
      case 2:
        return formData.skills.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <header className="relative p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <GradientText className="text-lg font-bold">JobHunter AI</GradientText>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                      currentStep >= step.id
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                        : 'bg-zinc-800 text-muted-foreground'
                    )}
                    animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-16 h-0.5 mx-2 transition-colors',
                        currentStep > step.id ? 'bg-cyan-500' : 'bg-zinc-700'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <GlassCard className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <GradientText as="h2" className="text-xl font-bold mb-2">
                      Tell us about yourself
                    </GradientText>
                    <p className="text-sm text-muted-foreground">
                      This helps us find the perfect jobs for you
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Senior Software Engineer"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        data-testid="input-job-title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                      >
                        <SelectTrigger data-testid="select-experience">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <GradientText as="h2" className="text-xl font-bold mb-2">
                      Upload Your Resume
                    </GradientText>
                    <p className="text-sm text-muted-foreground">
                      Paste your resume text or select your skills
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume Text (Optional)</Label>
                      <Textarea
                        id="resume"
                        placeholder="Paste your resume content here..."
                        className="min-h-[120px]"
                        value={formData.resumeText}
                        onChange={(e) => setFormData(prev => ({ ...prev, resumeText: e.target.value }))}
                        data-testid="textarea-resume"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Select Your Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {skillSuggestions.map((skill) => (
                          <Badge
                            key={skill}
                            variant={formData.skills.includes(skill) ? 'default' : 'outline'}
                            className={cn(
                              'cursor-pointer transition-all',
                              formData.skills.includes(skill) && 'bg-primary'
                            )}
                            onClick={() => toggleSkill(skill)}
                            data-testid={`skill-${skill.toLowerCase().replace(/[^a-z]/g, '-')}`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <GradientText as="h2" className="text-xl font-bold mb-2">
                      Job Preferences
                    </GradientText>
                    <p className="text-sm text-muted-foreground">
                      Set your ideal job criteria
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Target Salary: ${formData.targetSalary.toLocaleString()}</Label>
                      <Slider
                        value={[formData.targetSalary]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, targetSalary: value }))}
                        min={30000}
                        max={500000}
                        step={5000}
                        data-testid="slider-salary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$30K</span>
                        <span>$500K+</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Work Preference</Label>
                      <div className="flex gap-2">
                        {(['remote', 'hybrid', 'onsite'] as const).map((pref) => (
                          <Button
                            key={pref}
                            type="button"
                            variant={formData.workPreference === pref ? 'default' : 'outline'}
                            className="flex-1 capitalize"
                            onClick={() => setFormData(prev => ({ ...prev, workPreference: pref }))}
                            data-testid={`button-${pref}`}
                          >
                            {pref}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  data-testid="button-complete"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
