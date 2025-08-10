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
    <div className="px-3 mt-5 max-w-xl mx-auto h-screen">
      <ScrollArea className="mb-2 h-[600px] w-full rounded-md border p-2  text-wrap ">
        <div ref={scrollViewportRef}>
          <Messages messages={messages} isThinking={isThinking} />

          {/* Loading indicator */}
          {isThinking && <Thinking />}
        </div>
      </ScrollArea>

      <form
        className="w-full max-w-xl p-2 mb-8 border bg-white border-gray-200 rounded shadow-xl space-y-2 z-20"
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

          //Reset
          setInput("");
          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <Label className="font-semibold text-sm">
          <Import className="w-5 h-5" /> Import your pdf
        </Label>
        <Input
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

        <div className="flex gap-2">
          <Input
            className="w-full p-2 text-sm"
            value={input}
            placeholder="Ask something..."
            onChange={(e) => setInput(e.target.value)}
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
  );
}
