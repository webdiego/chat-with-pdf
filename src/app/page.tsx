import { BackgroundLines } from "@/components/BackgroundLines";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function page() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-4xl md:text-6xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Chat with your pdf
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        The smart, easy way to interact with any PDF document, just ask and get
        answers instantly.
      </p>
      <div className="mt-10 flex items-center justify-center">
        <Link
          href="/chat"
          className="rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 flex z-10"
        >
          <p className="mr-2">Start chat with your pdf</p>

          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </BackgroundLines>
  );
}
