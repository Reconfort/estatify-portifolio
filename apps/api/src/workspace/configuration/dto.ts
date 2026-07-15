import { createZodDto } from "nestjs-zod";
import {
  createMediaUploadSchema,
  mediaListQuerySchema,
  updateAgencyProfileSchema,
  updateBrandIdentitySchema,
  updateSeoConfigurationSchema,
  updateWebsiteSettingsSchema,
} from "@estatify/types";

export class UpdateAgencyProfileDto extends createZodDto(updateAgencyProfileSchema) {}
export class UpdateBrandIdentityDto extends createZodDto(updateBrandIdentitySchema) {}
export class UpdateWebsiteSettingsDto extends createZodDto(updateWebsiteSettingsSchema) {}
export class UpdateSeoConfigurationDto extends createZodDto(updateSeoConfigurationSchema) {}
export class CreateMediaUploadDto extends createZodDto(createMediaUploadSchema) {}
export class MediaListQueryDto extends createZodDto(mediaListQuerySchema) {}
