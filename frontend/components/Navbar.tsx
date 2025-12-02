import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">Job Hunt Agent</div>
      <ul className="flex space-x-6">
        <li>
          <Link href="/">
            <a className="hover:text-gray-200">Home</a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard">
            <a className="hover:text-gray-200">Dashboard</a>
          </Link>
        </li>
        <li>
          <Link href="/upload">
            <a className="hover:text-gray-200">Upload Resume</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
