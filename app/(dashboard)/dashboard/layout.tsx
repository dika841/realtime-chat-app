import { Sidebar } from "@/components/container/sidebar";
import { getFriendsByUserId } from "@/helpers/get-friend-by-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Connectify | Dashboard",
  description: "Your dashboard",
};
const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const friends = await getFriendsByUserId(session.user.id)

  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length
  return (
    <main className="w-full flex max-w-[1440px] bg-slate-50 min-h-screen">
      <Sidebar
        email={session?.user?.email as string}
        name={session?.user?.name as string}
        image={session?.user?.image as string}
        friends={friends}
        sessionId={session?.user?.id}
        initFriendRequestCount={unseenRequestCount}
      />
     <section className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </section>
    </main>
  );
};

export default Layout;
