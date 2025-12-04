import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  title: text("title"),
  experience: text("experience"),
  targetSalary: integer("target_salary"),
  workPreference: text("work_preference"),
  skills: text("skills").array(),
  resumeText: text("resume_text"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  streak: integer("streak").default(0),
  level: integer("level").default(1),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  remote: boolean("remote").default(false),
  experienceLevel: text("experience_level"),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  matchScore: integer("match_score"),
  matchReasons: text("match_reasons").array(),
  postedAt: text("posted_at"),
  source: text("source"),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  jobId: varchar("job_id").notNull(),
  status: text("status").notNull().default("saved"),
  appliedAt: text("applied_at"),
  coverLetter: text("cover_letter"),
  notes: text("notes"),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const activityFeed = pgTable("activity_feed", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const onboardingSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  experience: z.string().min(1, "Experience level is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  targetSalary: z.number().min(0, "Salary must be positive"),
  workPreference: z.enum(["remote", "onsite", "hybrid"]),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activityFeed).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Activity = typeof activityFeed.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type KanbanColumn = "saved" | "applied" | "interview" | "offer";

export interface ResumeAnalysis {
  actionVerbs: { word: string; start: number; end: number }[];
  metrics: { word: string; start: number; end: number }[];
  weakWords: { word: string; start: number; end: number }[];
  missingSkills: string[];
  score: number;
}

export interface AgentStatus {
  isActive: boolean;
  currentTask: string | null;
  jobsScanned: number;
  lastScan: string | null;
}
