import { api } from "../api";
import { TFriendRequest, TFriendResponse } from "./type";


export const addFriend = async (
  payload: TFriendRequest
): Promise<TFriendResponse> => {
  const { data } = await api<TFriendResponse>({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: "/friends/add",
    data: payload,
  });
  return data;
};
export const acceptFriendRequest = async(payload : string):Promise<TFriendResponse>=>{
  const {data} = await api({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: "/friends/accept",
    data: {
      id: payload
    }
  })
  return data
}

export const declineFriendRequest = async(payload : string):Promise<TFriendResponse>=>{
  const {data} = await api({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: "/friends/decline",
    data: {
      id: payload
    }
  })
  return data
}
