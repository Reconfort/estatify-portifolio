import { Module } from "@nestjs/common";
import { ConfigurationController } from "./configuration/configuration.controller";
import { ConfigurationRepository } from "./configuration/configuration.repository";
import { ConfigurationService } from "./configuration/configuration.service";
import { MediaController } from "./media/media.controller";
import { MediaService } from "./media/media.service";
import { ObjectStorageService } from "./media/object-storage.service";
import { PublicConfigurationController } from "./public/public-configuration.controller";
import { OnboardingController } from "./onboarding/onboarding.controller";
import { OnboardingRepository } from "./onboarding/onboarding.repository";
import { OnboardingService } from "./onboarding/onboarding.service";

/** Workspace tenant configuration — agency profile, brand, website, SEO, media. */
@Module({
  controllers: [
    ConfigurationController,
    MediaController,
    PublicConfigurationController,
    OnboardingController,
  ],
  providers: [
    ConfigurationRepository,
    ConfigurationService,
    MediaService,
    ObjectStorageService,
    OnboardingRepository,
    OnboardingService,
  ],
  exports: [ConfigurationService, OnboardingRepository],
})
export class WorkspaceModule {}
