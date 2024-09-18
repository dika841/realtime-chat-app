export type TSidebar = {
  name: string;
  email: string;
  friends: User[];
  image: string;
  sessionId?: string;
  initFriendRequestCount?: number;
};
export interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}
