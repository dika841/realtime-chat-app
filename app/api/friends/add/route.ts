import { addFriendSchema } from "@/entities/schema/email-validator";
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
    const { email } = addFriendSchema.parse(body);

    const idToAdd = (await fetchRedis(
        'get',
        `user:email:${email}`
      )) as string

      if (!idToAdd) {
        return new Response(JSON.stringify({ message: "This person is not found" }), {
          status: 400,
        });
      }      
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    if (idToAdd === session.user.id) {
      return new Response(JSON.stringify({ message: "You cannot add yourself" }), {
        status: 400,
      });
    }
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1

    if (isAlreadyAdded) {
      return new Response('Already added this user', { status: 400 })
    }

    // check if user is already added
    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1

    if (isAlreadyFriends) {
      return new Response('Already friends with this user', { status: 400 })
    }


    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    )

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

    return new Response('Friend request has been send', { status: 200 })

  } catch (error) {
    console.log("catch error", error);
    if (error instanceof z.ZodError) {
        return new Response('Invalid request payload', { status: 422 })
      }
  
      return new Response('Invalid request', { status: 400 })
  }
};
