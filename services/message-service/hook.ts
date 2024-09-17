import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { sendMessageMutation } from ".";
import { TSendMessage, TSendMessageResponse } from "./type";
import { TMetaErrorResponse } from "@/entities/common";

export const useSendMessage = ():UseMutationResult<TSendMessageResponse,TMetaErrorResponse,TSendMessage>=>{
    return useMutation({
        mutationKey: ["send-message"],
        mutationFn : async (payload) => await sendMessageMutation(payload)
    })

} 