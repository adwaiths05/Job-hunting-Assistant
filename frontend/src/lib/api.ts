import { queryClient } from "./queryClient";
import type { Job, Application, ResumeAnalysis, AgentStatus } from "@shared/schema";

// Helper to handle API responses
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
  const response = await fetchApi<{ results: any[] }>("/jobs/search-jobs", {
    method: "POST",
    body: JSON.stringify({ 
      query_text: query || "developer", 
      top_k: 10 
    }),
  });
  
  // Transform Weaviate format to frontend Job schema
  // STRICT: No mock scores or salaries.
  return response.results.map((j: any, i: number) => ({
    id: j._additional?.id || `job-${i}`,
    title: j.title,
    company: j.company,
    location: j.location || "Not specified",
    salary: "Not disclosed", // Weaviate schema doesn't have salary yet
    description: j.description,
    matchScore: 0, // Score is 0 unless calculated by backend
    remote: false, // Default to false if unknown
    postedAt: "Unknown"
  }));
}

export async function getJobById(id: string): Promise<Job | undefined> {
  // Rely on search cache or fetch fresh
  const jobs = await searchJobs();
  return jobs.find(job => job.id === id);
}

export async function getAgentStatus(): Promise<AgentStatus> {
  // STRICT: Attempt to fetch real status. If endpoint doesn't exist, throw error.
  // This ensures we know if the backend agent logic is missing.
  try {
    return await fetchApi<AgentStatus>("/assistant/status");
  } catch (error) {
    console.error("Agent status endpoint missing or failed", error);
    throw error; // Propagate error to UI
  }
}

// --- RESUME ---

export async function analyzeResume(text: string): Promise<ResumeAnalysis> {
  const blob = new Blob([text], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'resume.txt');

  const res = await fetch('/api/v1/resume/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload resume for analysis");
  
  const data = await res.json();
  const parsed = data.data || {};
  
  // STRICT: Only use returned data
  return {
    actionVerbs: [], // Backend parser needs to implement this specifically to return it
    metrics: [],
    weakWords: [],
    missingSkills: parsed.skills || [],
    score: 0 // No fake score
  };
}

// --- COVER LETTER ---

export async function generateCoverLetter(
  jobDescription: string, 
  resumeText: string = "My Resume Text" 
): Promise<string> {
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
  // STRICT: Fetch from real backend endpoint
  return await fetchApi<Application[]>("/tracking/applications");
}

export async function syncKanban(applications: Application[]): Promise<void> {
  // Implementation pending backend support for batch sync
  console.log("Syncing kanban not yet implemented on backend");
}

export async function chatWithAI(message: string): Promise<string> {
  // Implementation pending /chat endpoint
  throw new Error("Chat endpoint not yet implemented");
}