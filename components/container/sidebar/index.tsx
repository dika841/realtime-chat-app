"use client";
import { FC, ReactElement, useState } from "react";
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
import { TSidebar } from "./type";
import { Loader2, Send, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useAddFriend } from "@/services/add-friend-service/hook";

export const Sidebar: FC<TSidebar> = ({
  email,
  name,
  image,
  sessionId,
  initFriendRequestCount,
}): ReactElement => {
  const [friednRequestCount, setFriendRequestCount] = useState<number | undefined>(
    initFriendRequestCount
  );
  const { mutate: addFriend, isPending } = useAddFriend();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof addFriendSchema>>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      email: "",
    },
  });
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
  return (
    <aside className="top-0 left-0 z-[9999] text-slate-700 flex min-h-screen w-1/4 flex-col overflow-y-hidden ease-linear lg:static bg-transparent  shadow-md shadow-slate-700 p-4 lg:translate-x-0">
      <div className="flex items-center gap-x-2 mx-auto">
        <h1 className="text-2xl font-bold tracking-wide italic">Connectify</h1>
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
                <DialogTitle className="text-lg font-semibold">Add friend with Email</DialogTitle>
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
            {
              friednRequestCount > 0 && <span className="text-xs font-semibold ml-4 bg-red-600
            text-slate-50 rounded-full size-5 flex justify-center items-center ">{friednRequestCount}</span>
            }
          </Link>
        </div>
      </div>
    </aside>
  );
};
