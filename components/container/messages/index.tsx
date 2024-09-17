"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FC, ReactElement, useRef, useState } from "react";

interface IMessagesProps {
  initialMessages?: Message[];
  sessionId?: string;
}
export const MessagesModule: FC<IMessagesProps> = ({
  initialMessages,
  sessionId,
}): ReactElement => {
  const [messages, setMessage] = useState<Message[]>(initialMessages || []);
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  return (
      <ScrollArea id="messages" className="flex h-full w-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto">
        {messages?.map((message, idx) => {
          const currentUser = message.senderId === sessionId;
          const isAnotherMessage =
            messages[idx - 1]?.senderId === messages[idx].senderId;

          return (
            <div key={`${message.id}-${message.timestamp}`}>
              <div
                className={cn(`flex items-end`, {
                  "justify-end": currentUser,
                })}
              >
                <div
                  className={cn(
                    "flex flex-col space-y-2 text-base max-w-xs mx-2",
                    {
                      "order-1 items-end": currentUser,
                      "order-2 items-start": !currentUser,
                    }
                  )}
                >
                  <span
                    className={cn("px-4 py-2 rounded-lg inline-block", {
                      "bg-slate-800 text-white": currentUser,
                      "bg-slate-50 text-slate-900": !currentUser,
                      "rounded-br-none": !isAnotherMessage && currentUser,
                      "rounded-bl-none": !isAnotherMessage && !currentUser,
                    })}
                  >
                    {message.text}{" "}
                    <span className="ml-2 text-xs text-slate-400">
                      {message.timestamp}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <ScrollBar ref={scrollDownRef}/>
      </ScrollArea>
  );
};
