"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { FC, ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string({ required_error: "Email is required." }).email().min(2, {
    message: "Invalid email",
  }),
});

export const Sidebar: FC = (): ReactElement => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>)=> {
    console.log(values);
    form.reset()
  }
  return (
    <aside className="top-0 left-0 z-[9999] text-slate-700 flex min-h-screen w-1/6 flex-col overflow-y-hidden ease-linear lg:static bg-transparent  shadow-md shadow-slate-700 p-4 lg:translate-x-0">
      <figure className="flex items-center gap-x-2">
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <figcaption className="text-lg font-medium tracking-wide">
          Randika
        </figcaption>
      </figure>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"lg"}>Add Friend +</Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-100 text-slate-700">
            <DialogHeader>Add friend with Email</DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the correct email format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="place-content-end">
                  Add Friend
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <h1>Friend request</h1>
    </aside>
  );
};
