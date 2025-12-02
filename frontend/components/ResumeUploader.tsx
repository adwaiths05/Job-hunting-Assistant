import { useState } from "react";

export default function ResumeUploader() {
  const [resumeName, setResumeName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleUpload = () => {
    alert(
      resumeName
        ? `Resume "${resumeName}" uploaded successfully! (mock)`
        : "Please select a file first."
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="mb-4"
      />
      {resumeName && <p className="mb-2 text-gray-700">Selected: {resumeName}</p>}
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Upload Resume
      </button>
    </div>
  );
}
