import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 px-6 pt-6">
      {/* Header */}
      <Header />

      {/* Blurb centered */}
      <section className="text-center max-w-4xl mx-auto">
        <p className="text-5xl font-extrabold text-gray-900 leading-tight">
          Organize your recreational sport on the spot!
        </p>
      </section>
    </div>
  );
}