import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { id } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      id
    )

    if (isAlreadyFriends) {
      return new Response('Already friends', { status: 400 })
    }

    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      id
    )

    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 })
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis('get', `user:${session.user.id}`),
      fetchRedis('get', `user:${id}`),
    ])) as [string, string]

    const user = JSON.parse(userRaw) as User
    const friend = JSON.parse(friendRaw) as User


    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${id}:friends`),
        'new_friend',
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        'new_friend',
        friend
      ),
      db.sadd(`user:${session.user.id}:friends`, id),
      db.sadd(`user:${id}:friends`, session.user.id),
      db.srem(`user:${session.user.id}:incoming_friend_requests`, id),
    ])

    return new Response("Friend request accepted", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
};
