"use client";
import { FC, ReactElement, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addFriendSchema } from "@/entities/schema/email-validator";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ExtendedMessage, TSidebar } from "./type";
import { Loader2, Send, UserPlus, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { useAddFriend } from "@/services/add-friend-service/hook";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { ToastAction } from "@/components/ui/toast";
import Image from "next/image";
export const Sidebar: FC<TSidebar> = ({
  email,
  name,
  image,
  sessionId,
  friends,
  initFriendRequestCount,
}): ReactElement => {
  const [friednRequestCount, setFriendRequestCount] = useState<number>(
    initFriendRequestCount || 0
  );
  const [activeChats, setActiveChats] = useState<User[]>(friends);
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const { mutate: addFriend, isPending } = useAddFriend();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof addFriendSchema>>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setFriendRequestCount((prev) => prev + 1);
    };

    const addedFriendHandler = () => {
      setFriendRequestCount((prev) => prev - 1);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);
    pusherClient.bind("new_friend", addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_friend", addedFriendHandler);
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      console.log("received new user", newFriend);
      setActiveChats((prev) => [...prev, newFriend]);
    };
    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(
          sessionId as string,
          message.senderId
        )}`;

      if (!shouldNotify) return;

      toast({
        title: "New Message",
        description: (
          <div className="max-w-[250px]">
            <strong>{message.senderName}</strong> has sent you a new message
            <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
              {message.text}
            </p>
          </div>
        ),
        variant: "subtle",
        action: (
          <ToastAction
            altText="Go to message"
            onClick={() =>
              router.push(
                `/dashboard/chat/${chatHrefConstructor(
                  sessionId as string,
                  message.senderId
                )}`
              )
            }
          >
            Go to message
          </ToastAction>
        ),
        key: message.senderId,
      });

      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, router, sessionId, toast]);
  const onSubmit = (values: z.infer<typeof addFriendSchema>) => {
    addFriend(values, {
      onSuccess: () => {
        toast({
          title: "Add Friend",
          description: "We have scheduled an email to be sent to your friend",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Add Friend",
          description: error.response?.data.message,
          variant: "destructive",
        });
      },
    });
  };

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);
  return (
    <aside className="realtive top-0 left-0 z-[9999] text-slate-700 flex min-h-screen w-1/4 flex-col overflow-y-hidden ease-linear lg:static bg-transparent  shadow-md shadow-slate-700 p-4 lg:translate-x-0">
      <div className="flex items-center gap-x-2 mx-auto mt-4">
        <Link
          href={"/"}
          className="text-2xl font-bold tracking-wide italic cursor-pointer"
        >
          Connectify
        </Link>
        <Send className="rotate-12" />
      </div>
      <div className="mt-8">
        <figure className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <figcaption className="flex flex-col tracking-wide">
            <h3 className="text-sm font-semibold">{name}</h3>
            <small className="text-xs">{email}</small>
          </figcaption>
        </figure>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-semibold">Friend</h3>
        <div className="p-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"default"} variant="ghost" className="gap-x-2">
                <UserPlus size={20} />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-100 text-slate-700">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Add friend with Email
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@example.com"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the correct email format.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="place-content-end">
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Link
            href={"/dashboard/request"}
            className={buttonVariants({ variant: "ghost", size: "default" })}
          >
            <div className="flex items-center gap-x-2">
              <Users size={20} />
              Friend request
            </div>
            {friednRequestCount > 0 ? (
              <span
                className="text-xs font-semibold ml-2 bg-red-600
            text-slate-50 rounded-full size-5 flex justify-center items-center "
              >
                {friednRequestCount}
              </span>
            ) : null}
          </Link>
        </div>
        <section className="mt-2">
          <h3 className="text-sm font-semibold">Your Chats</h3>
          <ScrollArea className="h-60 w-full  text-slate-800 p-2">
            <ul className="flex flex-col gap-2 ">
              {activeChats
                .sort()
                ?.sort()
                .map((friend) => {
                  const unseenMessagesCount = unseenMessages.filter(
                    (unseenMsg) => {
                      return unseenMsg.senderId === friend.id;
                    }
                  ).length;

                  return (
                    <li
                      key={friend.id}
                      className="flex items-center group px-2 shadow-sm"
                    >
                      <Link
                        href={`/dashboard/chat/${chatHrefConstructor(
                          sessionId as string,
                          friend.id
                        )}`}
                        className="w-full text-gray-700 group-hover:text-slate-600 group-hover:bg-gray-50 group flex items-center gap-x-3 p-2 text-sm leading-6 font-semibold py-2"
                      >
                        <div className="relative size-6">
                          <Image
                            fill
                            src={friend.image}
                            alt="profile"
                            className="rounded-full"
                          />
                        </div>
                        <span>{friend.name}</span>
                        {unseenMessagesCount > 0 ? (
                          <div className="bg-red-500 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                            {unseenMessagesCount}
                          </div>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </ScrollArea>
        </section>
      </div>
      <div className="fixed shadow-lg w-[90%] bottom-0 ">
        <Button
          variant={"secondary"}
          className="w-full py-4 flex items-center justify-center hover:bg-neutral-100 transition-all duration-300 ease-in-out"
          onClick={async () => {
            setIsSigningOut(true);
            try {
              await signOut();
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
              });
            } finally {
              setIsSigningOut(false);
            }
          }}
        >
          {isSigningOut ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : (
            <LogOut className="w-5 h-5 mr-2 " />
          )}
          <span className=" font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};
