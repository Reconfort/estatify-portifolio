import { createZodDto } from "nestjs-zod";
import { createRoleSchema, updateRoleSchema } from "@estatify/types";

export class CreateRoleDto extends createZodDto(createRoleSchema) {}
export class UpdateRoleDto extends createZodDto(updateRoleSchema) {}
