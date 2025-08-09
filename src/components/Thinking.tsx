import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function Thinking() {
  return (
    <div className="whitespace-pre-wrap">
      <div className="text-lg font-bold mt-10 w-min">
        <div className="flex items-center bg-blue-200 px-3 py-2 rounded-full w-auto">
          <Sparkles className="w-4 h-4 mr-1" />
          <p className="text-sm font-semibold">AI:</p>
        </div>
      </div>
      <div className="flex items-center my-2">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        <p className="text-gray-500 text-sm">Thinking...</p>
      </div>
    </div>
  );
}
