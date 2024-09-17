import { api } from "../api";
import { TSendMessage } from "./type";

export const sendMessageMutation = async ({ text, chatId }: TSendMessage):Promise<TSendMessage> => {
    const {data} = await api.post('/api/message/send', { text, chatId });
    return data;
};