import zod from "zod";

export const signupSchema = zod.object({
  username: zod
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  email: zod.email("Invalid email address"),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
});
