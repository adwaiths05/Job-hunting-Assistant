import { mockJobs } from "../mock-data/jobs";
import { mockCoverLetter } from "../mock-data/coverLetters";

export const fetchJobs = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockJobs), 500));
};

export const generateCoverLetter = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockCoverLetter), 500));
};
