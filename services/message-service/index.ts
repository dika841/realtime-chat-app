import { api } from "../api";
import { TSendMessage, TSendMessageResponse } from "./type";

export const sendMessageMutation = async ({
  text,
  chatId,
}: TSendMessage): Promise<TSendMessageResponse> => {
  const { data } = await api.post("/message/send", { text, chatId });
  return data;
};
