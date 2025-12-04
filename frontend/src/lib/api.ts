import { queryClient } from "./queryClient";
import type { Job, Application, ResumeAnalysis, AgentStatus } from "@shared/schema";

// Helper to handle API responses
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Proxied requests go to http://localhost:8000/api/v1/...
  const res = await fetch(`/api/v1${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }

  return res.json();
}

// --- JOBS ---

export async function searchJobs(query: string = ""): Promise<Job[]> {
  // Matches backend/app/api/v1/jobs.py
  const response = await fetchApi<{ results: any[] }>("/jobs/search-jobs", {
    method: "POST",
    body: JSON.stringify({ 
      query_text: query || "developer", 
      top_k: 10 
    }),
  });
  
  // Transform Weaviate format to frontend Job schema
  return response.results.map((j: any, i: number) => ({
    id: j._additional?.id || `job-${i}`,
    title: j.title,
    company: j.company,
    location: j.location || "Remote",
    salary: "$100k - $150k", // Placeholder (Vectors don't usually store this)
    description: j.description,
    matchScore: Math.floor(Math.random() * 20) + 80, // Mock score for now
    remote: true,
    postedAt: "Recently"
  }));
}

export async function getJobById(id: string): Promise<Job | undefined> {
  // Fallback since we don't have a direct ID endpoint yet
  const jobs = await searchJobs();
  return jobs.find(job => job.id === id);
}

export async function getAgentStatus(): Promise<AgentStatus> {
  // Mock status (Backend implementation pending)
  return {
    isActive: true,
    currentTask: "Scanning for new opportunities...",
    jobsScanned: 124,
    lastScan: new Date().toISOString(),
  };
}

// --- RESUME ---

export async function analyzeResume(text: string): Promise<ResumeAnalysis> {
  // Convert text to file for the backend upload endpoint
  const blob = new Blob([text], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'resume.txt');

  const res = await fetch('/api/v1/resume/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to analyze resume");
  
  const data = await res.json();
  const parsed = data.data || {};
  
  return {
    actionVerbs: [],
    metrics: [],
    weakWords: [],
    missingSkills: parsed.skills || ["System Design", "Kubernetes"], // Use parsed skills if available
    score: 85
  };
}

// --- COVER LETTER ---

export async function generateCoverLetter(
  jobDescription: string, 
  resumeText: string = "My Resume Text" 
): Promise<string> {
  // Matches backend/app/api/v1/coverletter.py
  const res = await fetchApi<{ cover_letter: string }>("/coverletter/generate", {
    method: "POST",
    body: JSON.stringify({ 
      resume_text: resumeText,
      job_description: jobDescription 
    }),
  });
  
  return res.cover_letter;
}

// --- TRACKING ---

export async function getApplications(): Promise<Application[]> {
  // Mock return until backend GET endpoint is added
  return []; 
}

export async function syncKanban(applications: Application[]): Promise<void> {
  // Mock sync
  console.log("Syncing kanban...", applications);
}

export async function chatWithAI(message: string): Promise<string> {
  // Mock chat until /chat endpoint is robust
  return `I received: "${message}". I'm working on finding you the best roles!`;
}