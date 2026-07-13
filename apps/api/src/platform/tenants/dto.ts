import { createZodDto } from "nestjs-zod";
import { createTenantSchema, tenantListQuerySchema, updateTenantSchema } from "@estatify/types";

export class TenantListQueryDto extends createZodDto(tenantListQuerySchema) {}
export class CreateTenantDto extends createZodDto(createTenantSchema) {}
export class UpdateTenantDto extends createZodDto(updateTenantSchema) {}
