export type TSendMessage = {
    text: string;
    chatId: string;
}
export type TSendMessageResponse = {
    id?: string
    text?: string
    senderId?: string
    chatId?: string
    timestamp?: string
}