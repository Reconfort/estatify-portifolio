import { createZodDto } from "nestjs-zod";
import { createStaffSchema, staffListQuerySchema, updateStaffSchema } from "@estatify/types";

export class StaffListQueryDto extends createZodDto(staffListQuerySchema) {}
export class CreateStaffDto extends createZodDto(createStaffSchema) {}
export class UpdateStaffDto extends createZodDto(updateStaffSchema) {}
