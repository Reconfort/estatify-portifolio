import { z } from "zod";
import { emailField, messageField, nameField, phoneField, requiredChoice } from "./fields";

/** Marketing-site enquiry / callback request. */
export const enquirySchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  topic: requiredChoice("Select what you're enquiring about"),
  message: messageField,
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
