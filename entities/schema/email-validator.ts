import { z } from "zod";

export const addFriendSchema = z.object({
    email: z.string({ required_error: "Email is required." }).email().min(2, {
      message: "Invalid email",
    }),
  });