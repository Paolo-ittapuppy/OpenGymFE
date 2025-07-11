import Image from "next/image";
import Header from "@/components/Header";
import Link from 'next/link';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 px-6 pt-6">
      {/* Header */}
      <Header />

      {/* Blurb and buttons */}
      <section className="text-center max-w-4xl mx-auto mt-16">
        <p className="text-5xl font-extrabold text-gray-900 leading-tight mb-12">
          Organize your recreational sport on the spot!
        </p>

        <div className="flex justify-center items-start gap-16">
          {/* Host Button with helper text */}
          <div className="flex flex-col items-center">
            <Link href="/host">
              <button className="px-8 py-4 bg-blue-600 text-white text-2xl font-semibold rounded-xl shadow hover:bg-blue-700 transition">
                Host Session
              </button>
            </Link>
            <p className="text-sm text-gray-700 mt-2">
              You have to be signed on to host a session
            </p>
          </div>

          {/* Join Button */}
          <div className="flex flex-col items-center">
            <Link href="/join">
              <button className="px-8 py-4 bg-white text-blue-600 text-2xl font-semibold border border-blue-600 rounded-xl shadow hover:bg-blue-100 transition">
                Join Session
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}