import type { Job, Application, ResumeAnalysis, AgentStatus, ChatMessage } from '@shared/schema';

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$180,000 - $250,000',
    salaryMin: 180000,
    salaryMax: 250000,
    remote: true,
    experienceLevel: 'senior',
    description: 'Join our team to build next-generation web experiences using React, TypeScript, and cutting-edge technologies. Lead frontend architecture decisions and mentor junior developers.',
    requirements: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'System Design'],
    matchScore: 94,
    matchReasons: ['React Expert', 'TypeScript', '5+ Years Experience'],
    postedAt: '2 days ago',
    source: 'LinkedIn',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$160,000 - $220,000',
    salaryMin: 160000,
    salaryMax: 220000,
    remote: true,
    experienceLevel: 'mid',
    description: 'Build payment infrastructure used by millions of businesses. Work on complex distributed systems and APIs that power the internet economy.',
    requirements: ['Python', 'React', 'PostgreSQL', 'AWS', 'API Design'],
    matchScore: 87,
    matchReasons: ['Full Stack Skills', 'API Experience', 'Cloud Knowledge'],
    postedAt: '1 day ago',
    source: 'Indeed',
  },
  {
    id: '3',
    title: 'Staff Software Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$200,000 - $350,000',
    salaryMin: 200000,
    salaryMax: 350000,
    remote: false,
    experienceLevel: 'staff',
    description: 'Lead engineering initiatives for Netflix streaming platform serving 200M+ subscribers. Drive technical strategy and architecture decisions.',
    requirements: ['Java', 'Microservices', 'Kafka', 'AWS', 'Technical Leadership'],
    matchScore: 72,
    matchReasons: ['Leadership Skills', 'Distributed Systems'],
    postedAt: '3 days ago',
    source: 'LinkedIn',
  },
  {
    id: '4',
    title: 'React Native Developer',
    company: 'Airbnb',
    location: 'Remote',
    salary: '$150,000 - $200,000',
    salaryMin: 150000,
    salaryMax: 200000,
    remote: true,
    experienceLevel: 'mid',
    description: 'Build beautiful mobile experiences for millions of travelers. Work on cross-platform features using React Native and modern mobile development practices.',
    requirements: ['React Native', 'TypeScript', 'iOS', 'Android', 'Mobile UX'],
    matchScore: 91,
    matchReasons: ['React Expert', 'Mobile Experience', 'TypeScript'],
    postedAt: '5 hours ago',
    source: 'Company Website',
  },
  {
    id: '5',
    title: 'Backend Engineer',
    company: 'Spotify',
    location: 'New York, NY',
    salary: '$140,000 - $190,000',
    salaryMin: 140000,
    salaryMax: 190000,
    remote: true,
    experienceLevel: 'mid',
    description: 'Build scalable backend services for music streaming. Work with microservices, event-driven architecture, and real-time data processing.',
    requirements: ['Python', 'Go', 'Kubernetes', 'gRPC', 'Event Streaming'],
    matchScore: 65,
    matchReasons: ['Python Skills', 'Cloud Infrastructure'],
    postedAt: '1 week ago',
    source: 'Indeed',
  },
  {
    id: '6',
    title: 'Machine Learning Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    salary: '$250,000 - $400,000',
    salaryMin: 250000,
    salaryMax: 400000,
    remote: false,
    experienceLevel: 'senior',
    description: 'Research and develop cutting-edge AI models. Work on large-scale training infrastructure and model optimization.',
    requirements: ['Python', 'PyTorch', 'Transformers', 'CUDA', 'Research'],
    matchScore: 58,
    matchReasons: ['Python Expertise'],
    postedAt: '4 days ago',
    source: 'LinkedIn',
  },
];

const mockApplications: Application[] = [
  { id: '1', userId: '1', jobId: '1', status: 'applied', appliedAt: '2024-01-15', coverLetter: '', notes: '' },
  { id: '2', userId: '1', jobId: '2', status: 'interview', appliedAt: '2024-01-10', coverLetter: '', notes: 'Phone screen scheduled' },
  { id: '3', userId: '1', jobId: '4', status: 'saved', appliedAt: '', coverLetter: '', notes: '' },
  { id: '4', userId: '1', jobId: '3', status: 'offer', appliedAt: '2024-01-05', coverLetter: '', notes: 'Offer received!' },
];

export async function searchJobs(query?: string): Promise<Job[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!query) return mockJobs;
  return mockJobs.filter(job => 
    job.title.toLowerCase().includes(query.toLowerCase()) ||
    job.company.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getJobById(id: string): Promise<Job | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockJobs.find(job => job.id === id);
}

export async function analyzeResume(text: string): Promise<ResumeAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const actionVerbs = ['Led', 'Built', 'Developed', 'Designed', 'Implemented', 'Created', 'Managed', 'Launched', 'Optimized', 'Architected'];
  const metrics = ['20%', '50%', '$1M', '100K', '3x', '10x', '99.9%', '40%'];
  const weakWords = ['Helped', 'Tried', 'Assisted', 'Worked on', 'Participated'];
  
  const foundActionVerbs: ResumeAnalysis['actionVerbs'] = [];
  const foundMetrics: ResumeAnalysis['metrics'] = [];
  const foundWeakWords: ResumeAnalysis['weakWords'] = [];
  
  actionVerbs.forEach(verb => {
    const regex = new RegExp(verb, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      foundActionVerbs.push({ word: match[0], start: match.index, end: match.index + match[0].length });
    }
  });
  
  metrics.forEach(metric => {
    const regex = new RegExp(metric.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      foundMetrics.push({ word: match[0], start: match.index, end: match.index + match[0].length });
    }
  });
  
  weakWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      foundWeakWords.push({ word: match[0], start: match.index, end: match.index + match[0].length });
    }
  });
  
  return {
    actionVerbs: foundActionVerbs,
    metrics: foundMetrics,
    weakWords: foundWeakWords,
    missingSkills: ['Kubernetes', 'GraphQL', 'System Design', 'AWS Certification'],
    score: Math.min(100, foundActionVerbs.length * 10 + foundMetrics.length * 15 - foundWeakWords.length * 5 + 50),
  };
}

export async function getApplications(): Promise<Application[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockApplications;
}

export async function syncKanban(applications: Application[]): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('Kanban synced:', applications);
}

export async function getAgentStatus(): Promise<AgentStatus> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    isActive: true,
    currentTask: 'Scanning LinkedIn for new opportunities...',
    jobsScanned: Math.floor(Math.random() * 500) + 200,
    lastScan: new Date().toISOString(),
  };
}

export async function chatWithAI(message: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const responses: Record<string, string> = {
    'interview': `Great question! Here are key tips for your upcoming interview:

**Before the Interview:**
- Research the company's recent news and products
- Prepare 3-5 STAR stories highlighting your achievements
- Review the job description and match your experience

**During the Interview:**
- Take a moment to think before answering
- Use specific examples with metrics when possible
- Ask thoughtful questions about team culture and growth

**Technical Rounds:**
- Think out loud during coding challenges
- Clarify requirements before diving in
- Consider edge cases and test your solution

Would you like me to help you prepare for a specific type of interview?`,
    
    'resume': `I've analyzed your resume and here are my recommendations:

**Strengths:**
- Strong action verbs like "Led" and "Developed"
- Good use of metrics (20% improvement, $1M savings)
- Clear career progression

**Areas to Improve:**
- Add more quantifiable achievements
- Remove weak phrases like "Helped with" or "Assisted"
- Include relevant keywords for ATS optimization

**Quick Wins:**
1. Start each bullet with a strong action verb
2. Add specific numbers wherever possible
3. Tailor your resume for each application

Want me to suggest specific improvements for any section?`,
    
    'salary': `Here's a strategic approach to salary negotiation:

**Research Phase:**
- The market rate for your role is $150K-$200K based on your experience
- Top companies typically offer 10-20% above market rate
- Don't forget to consider equity, bonuses, and benefits

**Negotiation Tips:**
- Never give the first number if possible
- Use phrases like "Based on my research and experience..."
- Focus on total compensation, not just base salary

**When to Negotiate:**
- Always negotiate - 70% of employers expect it
- The best time is after receiving an offer but before accepting

Would you like help preparing specific negotiation scripts?`,
    
    'default': `I'm here to help with your job search! I can assist you with:

- **Interview Preparation** - Practice questions and strategies
- **Resume Analysis** - Improve your resume's impact
- **Salary Negotiation** - Get the compensation you deserve
- **Job Search Strategy** - Find the right opportunities
- **Career Advice** - Navigate your career path

What would you like to work on today?`
  };
  
  const lowercaseMessage = message.toLowerCase();
  if (lowercaseMessage.includes('interview')) return responses['interview'];
  if (lowercaseMessage.includes('resume')) return responses['resume'];
  if (lowercaseMessage.includes('salary') || lowercaseMessage.includes('negotiate')) return responses['salary'];
  return responses['default'];
}

export async function generateCoverLetter(jobDescription: string, tone: 'professional' | 'casual' | 'bold'): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const templates = {
    professional: `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With over 5 years of experience in software development and a proven track record of delivering high-impact projects, I am confident in my ability to contribute meaningfully to your team.

In my current role, I have successfully led cross-functional teams to deliver complex projects on time and under budget. My expertise in modern web technologies, combined with my passion for clean code and user-centric design, aligns perfectly with the requirements outlined in your job description.

Key achievements that demonstrate my qualifications include:
- Led the development of a customer-facing platform that increased user engagement by 40%
- Architected a microservices solution that improved system reliability to 99.9%
- Mentored a team of 5 junior developers, fostering their growth and productivity

I am excited about the opportunity to bring my skills and experience to your organization. I look forward to discussing how I can contribute to your team's success.

Sincerely,
[Your Name]`,
    
    casual: `Hi there!

I just came across your job posting and got really excited - this role seems like it was written for me!

I've spent the last 5 years building awesome web applications and leading teams that ship great products. What really draws me to this opportunity is the chance to work on challenging problems with a talented team.

A few things I'm proud of:
- Building a platform that users actually love (40% engagement boost!)
- Making systems more reliable (hello, 99.9% uptime)
- Helping junior devs level up their skills

I'd love to chat about how I can help your team build something amazing. Looking forward to connecting!

Best,
[Your Name]`,
    
    bold: `Let's cut to the chase: I'm the developer you're looking for.

In the past 5 years, I've done what most developers only dream of:
- Increased user engagement by 40% on a platform serving millions
- Built systems with 99.9% uptime when competitors struggled with 95%
- Transformed junior developers into senior contributors

I don't just write code - I solve business problems. I don't just meet deadlines - I beat them. And I don't just join teams - I elevate them.

Your job posting caught my attention because I see an opportunity to make a real impact. I have the skills, the experience, and the drive to deliver results from day one.

Let's talk about how I can help you win.

[Your Name]`
  };
  
  return templates[tone];
}
