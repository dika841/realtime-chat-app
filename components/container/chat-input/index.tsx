"use client";
import { FC, ReactElement, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizontal } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendMessage } from "@/services/message-service/hook";

interface IChatInputProps {
  chatPartner: User;
  chatId: string;
}

const FormSchema = z.object({
  text: z.string().min(1, {
    message: "Bio must be at least 10 characters.",
  }),
  chatId: z.string(),
});
export const ChatInput: FC<IChatInputProps> = ({
  chatPartner,
  chatId,
}): ReactElement => {
  const { mutate, isPending } = useSendMessage();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });
  const onSendMessage = (data: z.infer<typeof FormSchema>) => {
    mutate(
      { text: data.text, chatId },
      {
        onSuccess: () => {
          form.reset();
          textareaRef.current?.focus();
        },
      }
    );
  };
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <div className="border-t border-slate-200 px-4 pt-4 mb-2 sm:mb-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSendMessage)}
          className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-slate-500"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl ref={textareaRef}>
                  <Textarea
                    placeholder={`Message ${chatPartner.name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSendMessage);
                      }
                    }}
                    rows={1}
                    className="block py-2 w-full outline-none resize-none border-0 bg-transparent shadow-none text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div
            onClick={() => textareaRef.current?.focus()}
            className="py-2"
            aria-hidden="true"
          >
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrin-0">
              <Button
                type="submit"
                size={"default"}
                className="text-center bg-slate-600"
              >
                {isPending ? <Loader2 /> : <SendHorizontal />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
