"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from "@/services/add-friend-service/hook";
import { Check, CircleX, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useEffect, useState } from "react";

interface IFriendRequestProps {
  incomingFriendRequests: IIncomingFriendRequest[];
  sessionId?: string;
}
export const FriendRequestModule: FC<IFriendRequestProps> = ({
  incomingFriendRequests,
  sessionId,
}): ReactElement => {
  const [friendRequest, setFriendRequest] = useState<IIncomingFriendRequest[]>(
    incomingFriendRequests
  );
  const {toast} = useToast()
  const { mutate: acceptFriendRequest } = useAcceptFriendRequest();
  const { mutate: declineFriendRequest } = useDeclineFriendRequest();
  const router = useRouter();


useEffect(()=>{
  pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
  const friendRequestHandler = ({
    senderId,
    senderEmail,
  }: IIncomingFriendRequest) => {
    console.log("function got called")
    setFriendRequest((prev) => [...prev, { senderId, senderEmail }])
  }

  pusherClient.bind('incoming_friend_requests', friendRequestHandler)
  return () => {
    pusherClient.unsubscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
  }
},[sessionId])

  const handleAcceptFriendRequest = (id: string) => {
    acceptFriendRequest(id, {
      onSuccess: () => {
        setFriendRequest((prev) =>
          prev.filter((request) => request.senderId !== id)
        );
        toast({
          title: "Friend Request Accepted",
          description: "You have accepted your friend request",
          variant: "success",
        })
        router.refresh();
      },
    });
  };

  const handleDeclineFriendRequest = (id: string) => {
    declineFriendRequest(id, {
      onSuccess: () => {
        setFriendRequest((prev) =>
          prev.filter((request) => request.senderId !== id)
        );
        toast({
          title: "Friend Request Declined",
          description: "You have declined your friend request",
          variant: "success",
        })
        router.refresh();
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-2 bg-white w-full md:w-5/6 p-2 min-h-40 h-auto rounded-lg mt-8 mx-auto shadow-md">
      {friendRequest?.length === 0 ? (
        <p className="text-center font-semibold">No friend requests</p>
      ) : (
        friendRequest?.map((request) => (
          <div
            key={request.senderId}
            className="flex items-center justify-between shadow-md rounded-lg p-2 hover:bg-slate-50 "
          >
            <div className="flex items-center gap-x-4">
              <Avatar>
                <AvatarImage src={request?.senderImage as string} />
                <AvatarFallback>
                  <UserPlus />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-semibold">{request.senderName}</p>
                <small className="text-xs">{request.senderEmail}</small>
              </div>
            </div>
            <div className="space-x-3">
              <Button
                aria-label="accept"
                title="Accept friend request"
                variant={"default"}
                size={"sm"}
                onClick={() => handleAcceptFriendRequest(request.senderId)}
              >
                <Check size={16}/>
              </Button>
              <Button
                aria-label="decline"
                title="Decline friend request"
                variant={"destructive"}
                size={"sm"}
                onClick={() => handleDeclineFriendRequest(request.senderId)}
              >
                <CircleX size={16}/>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
