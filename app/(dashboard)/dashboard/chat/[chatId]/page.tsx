import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { messageArrayValidator } from "@/entities/schema/message-validator";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface Props {
  params: {
    chatId: string;
  };
}
const getMessage = async (chatId: string) => {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);
    return messages;
  } catch (error) {
    notFound();
  }
};

const ChatPage = async ({ params }: Props) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) notFound();
  const partnerChatId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${partnerChatId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const initMessage = await getMessage(chatId);
  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <div className=" flex gap-x-4 items-center w-full py-4 px-8 shadow-md bg-white-400 text-slate-700">
        <figure>
          <Avatar>
            <AvatarImage src={chatPartner.image} />
            <AvatarFallback>{chatPartner.name[0]}</AvatarFallback>
          </Avatar>
        </figure>
        <figcaption className="text-base font-semibold">
          {chatPartner.name}
        </figcaption>
      </div>
    </section>
  );
};
export default ChatPage;
