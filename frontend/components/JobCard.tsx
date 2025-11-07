import { useState } from "react";
import CoverLetterModal from "./CoverLetterModal";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  applied: boolean;
};

export default function JobCard({ job }: { job: Job }) {
  const [applied, setApplied] = useState(job.applied);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p>{job.company} - {job.location}</p>
      <div className="mt-2 flex space-x-2">
        <button
          className={`px-4 py-2 rounded ${applied ? "bg-green-500" : "bg-blue-500"}`}
          onClick={() => setApplied(!applied)}
        >
          {applied ? "Applied" : "Mark as Applied"}
        </button>
        <button
          className="px-4 py-2 bg-gray-700 rounded"
          onClick={() => setShowModal(true)}
        >
          Generate Cover Letter
        </button>
      </div>
      {showModal && <CoverLetterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
