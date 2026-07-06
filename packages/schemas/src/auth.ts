import { z } from "zod";
import { emailField, nameField, passwordField } from "./fields";

/** Sign-in credentials. */
export const signInSchema = z.object({
  email: emailField,
  password: passwordField,
});
export type SignInInput = z.infer<typeof signInSchema>;

/** New-account registration. */
export const signUpSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});
export type SignUpInput = z.infer<typeof signUpSchema>;
