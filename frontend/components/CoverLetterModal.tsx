import { useEffect, useState } from "react";
import { generateCoverLetter } from "../lib/api";

export default function CoverLetterModal({ onClose }: { onClose: () => void }) {
  const [coverLetter, setCoverLetter] = useState<string>("Loading...");

  useEffect(() => {
  generateCoverLetter().then((letter) => setCoverLetter(letter as string));
}, []);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-2">Cover Letter Preview</h2>
        <pre className="bg-gray-100 p-2 rounded max-h-64 overflow-y-auto">{coverLetter}</pre>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
