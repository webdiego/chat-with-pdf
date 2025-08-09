import React from "react";
import { User, Sparkles } from "lucide-react";
import type { UIMessage } from "ai";

// Props for the Messages component
interface MessagesProps {
  messages: UIMessage[];
  isThinking: boolean;
}

export default function Messages({ messages, isThinking }: MessagesProps) {
  return (
    <div>
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap w-full">
          <div className="text-lg font-bold mt-2 w-min">
            {m.role === "user" && (
              <div className="flex items-center bg-yellow-100 px-3 py-2 rounded-lg w-auto">
                <User className="w-4 h-4 mr-1" />
                <p className="text-sm font-semibold">You:</p>
              </div>
            )}

            {m.role === "assistant" && !isThinking && (
              <div className="flex items-center bg-blue-200 px-3 py-2 rounded-lg w-auto">
                <Sparkles className="w-4 h-4 mr-1" />
                <p className="text-sm font-semibold">AI:</p>
              </div>
            )}
          </div>
          {m.parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <p className="my-2 text-sm" key={`${m.id}-text-${index}`}>
                  {part.text}
                </p>
              );
            }
            if (part.type === "file" && part.mediaType === "application/pdf") {
              return (
                <iframe
                  className="my-2 w-full"
                  key={`${m.id}-pdf-${index}`}
                  src={part.url}
                  width={500}
                  height={400}
                  title={`pdf-${index}`}
                />
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
