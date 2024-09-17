import { TMetaErrorResponse } from "@/entities/common";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { acceptFriendRequest, addFriend, declineFriendRequest } from ".";
import { TFriendRequest, TFriendResponse } from "./type";
export const useAddFriend = (): UseMutationResult<
  TFriendResponse,
  TMetaErrorResponse,
  TFriendRequest
> => {
  return useMutation({
    mutationKey: ["add-friend"],
    mutationFn: async (payload) => await addFriend(payload),
  });
};
export const useAcceptFriendRequest = (): UseMutationResult<
  TFriendResponse,
  TMetaErrorResponse,
  string
> => {
  return useMutation({
    mutationKey: ["accept-friend-request"],
    mutationFn: async (payload) => await acceptFriendRequest(payload),
  });
}

export const useDeclineFriendRequest = (): UseMutationResult<
  TFriendResponse,
  TMetaErrorResponse,
  string
> => {
  return useMutation({
    mutationKey: ["decline-friend-request"],
    mutationFn: async (payload) => await declineFriendRequest(payload),
  });
}