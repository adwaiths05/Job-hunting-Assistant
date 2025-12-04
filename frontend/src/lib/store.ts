import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Job, Application, ChatMessage, Activity, AgentStatus, KanbanColumn } from '@shared/schema';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface ThemeState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  filters: {
    salaryMin: number;
    salaryMax: number;
    remote: boolean;
    experienceLevel: string[];
    searchQuery: string;
  };
  setJobs: (jobs: Job[]) => void;
  setSelectedJob: (job: Job | null) => void;
  setFilters: (filters: Partial<JobState['filters']>) => void;
}

interface ApplicationState {
  applications: Application[];
  setApplications: (applications: Application[]) => void;
  updateApplicationStatus: (id: string, status: KanbanColumn) => void;
  moveApplication: (id: string, status: KanbanColumn) => void;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsTyping: (isTyping: boolean) => void;
}

interface AgentState {
  status: AgentStatus;
  activities: Activity[];
  setStatus: (status: AgentStatus) => void;
  addActivity: (activity: Activity) => void;
  setActivities: (activities: Activity[]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'user-storage' }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
    }),
    { name: 'theme-storage' }
  )
);

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  selectedJob: null,
  filters: {
    salaryMin: 0,
    salaryMax: 300000,
    remote: false,
    experienceLevel: [],
    searchQuery: '',
  },
  setJobs: (jobs) => set({ jobs }),
  setSelectedJob: (selectedJob) => set({ selectedJob }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  setApplications: (applications) => set({ applications }),
  updateApplicationStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app
      ),
    })),
  moveApplication: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app
      ),
    })),
}));

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isTyping: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsTyping: (isTyping) => set({ isTyping }),
}));

export const useAgentStore = create<AgentState>((set) => ({
  status: {
    isActive: true,
    currentTask: 'Scanning job boards...',
    jobsScanned: 247,
    lastScan: new Date().toISOString(),
  },
  activities: [],
  setStatus: (status) => set({ status }),
  addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities].slice(0, 20) })),
  setActivities: (activities) => set({ activities }),
}));
