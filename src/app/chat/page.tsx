"use client";
import React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState } from "react";
//Utils
import { convertFilesToDataURLs } from "@/lib/utils";
//UI
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
//Icons
import { Loader2Icon, Send, Import } from "lucide-react";

import Messages from "@/components/Messages";
import Thinking from "@/components/Thinking";
export default function Chat() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  React.useEffect(() => {
    if (status === "submitted" || status === "streaming") {
      setIsThinking(true);
    } else {
      setIsThinking(false);
    }
  }, [status]);

  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Chat scroll
  React.useEffect(() => {
    if (scrollViewportRef.current === null) return;
    const lastMessageElement = scrollViewportRef.current.lastElementChild;
    if (lastMessageElement) {
      lastMessageElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <div className="px-3 pt-4 max-w-xl mx-auto max-h-[100dvh] h-screen grid grid-rows-4">
      <ScrollArea className="mb-2 row-span-3 w-full rounded-md border p-2 text-wrap">
        <div ref={scrollViewportRef}>
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-4 flex self-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h4>Upload your PDF and start your conversation! </h4>
            </div>
          )}
          <Messages messages={messages} isThinking={isThinking} />

          {/* Loading indicator */}
          {isThinking && <Thinking />}
        </div>
      </ScrollArea>
      <div className="row-span-1">
        <form
          className="w-full max-w-xl p-2 border bg-white border-gray-200 rounded shadow-xl space-y-2 z-20"
          onSubmit={async (event) => {
            event.preventDefault();

            const fileParts =
              files && files.length > 0
                ? await convertFilesToDataURLs(files)
                : [];

            sendMessage({
              role: "user",
              parts: [{ type: "text", text: input }, ...fileParts],
            });

            //Reset inputs
            setInput("");
            setFiles(undefined);

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          <Label htmlFor="pdf-upload" className="font-semibold text-sm">
            <Import className="w-5 h-5" /> Upload your pdf
          </Label>
          <Input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            className="mt-2 bg-slate-100 cursor-pointer text-sm"
            onChange={(event) => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            multiple
            ref={fileInputRef}
          />
          {/* Show selected file names for accessibility and usability */}
          {files && files.length > 0 && (
            <ul className="text-xs text-gray-600 mt-1" aria-live="polite">
              {Array.from(files).map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Type your message
            </label>
            <Input
              id="chat-input"
              className="w-full p-2 text-sm"
              value={input}
              placeholder="Ask something..."
              onChange={(e) => setInput(e.target.value)}
              aria-label="Type your message"
            />
            {isThinking ? (
              <Button disabled>
                <Loader2Icon className="animate-spin" />
                Asking
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  ((!files || files.length === 0) && messages.length === 0) ||
                  input.trim() === ""
                }
                variant="default"
                className="cursor-pointer "
              >
                Ask
                <Send />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
