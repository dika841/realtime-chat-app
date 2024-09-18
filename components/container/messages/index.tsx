"use client";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { cn, formatTimestamp, toPusherKey } from "@/lib/utils";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface IMessagesProps {
  initialMessages: Message[]
  sessionId: string
  chatId: string
  sessionImg: string | null | undefined
  chatPartner: User
}
export const MessagesModule: FC<IMessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}): ReactElement => {
  const [messages, setMessage] = useState<Message[]>(initialMessages || []);
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    )

    const messageHandler = (message: Message) => {
      setMessage((prev) => [message, ...prev])
    }

    pusherClient.bind('incoming-message', messageHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      )
      pusherClient.unbind('incoming-message', messageHandler)
    }
  }, [chatId])
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

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
                    "bg-slate-100 text-slate-900": !currentUser,
                    "rounded-br-none": !isAnotherMessage && currentUser,
                    "rounded-bl-none": !isAnotherMessage && !currentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-slate-400">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>
              <div className={cn('relative size-6',{
                'order-2' : currentUser,
                'order-1' : !currentUser,
                'invisible': isAnotherMessage,
              })}>
                <Image fill src={currentUser ? (sessionImg as string): chatPartner?.image} alt="profile" referrerPolicy="no-referrer" className="rounded-full"/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
