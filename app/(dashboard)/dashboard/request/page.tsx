import { FriendRequestModule } from "@/components/pages/dashboard/friend-request";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { NextPage } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const RequestFriendPage: NextPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const incomingSenderId = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];
  const incomingFriendRequests = await Promise.all(
    incomingSenderId.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;
      return {
        senderId,
        senderEmail: senderParsed.email,
        senderImage: senderParsed.image,
        senderName: senderParsed.name,
      };
    })
  );

  return (
    <div className="text-slate-700 flex-1 flex flex-col">
      <h1 className="text-3xl font-bold tracking-wide mt-4 md:mt-0">Friend Request</h1>
      <FriendRequestModule
        incomingFriendRequests={incomingFriendRequests}
        sessionId={session.user.id}
      />
     
    </div>
  );
};

export default RequestFriendPage;
