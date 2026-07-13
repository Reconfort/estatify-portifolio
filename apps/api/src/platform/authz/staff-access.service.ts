import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

export interface StaffContext {
  /** Set of permission keys the staff member holds via their role. */
  permissions: Set<string>;
  roleName: string | null;
}

/**
 * Resolves a user's platform-staff authorization context. Returns null if the
 * user is not an active staff member — the caller treats that as "no platform
 * access". StaffProfile/Role/Permission are global tables (no RLS).
 */
@Injectable()
export class StaffAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async getContext(userId: string): Promise<StaffContext | null> {
    const profile = await this.prisma.client.staffProfile.findUnique({
      where: { userId },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });

    if (!profile || profile.deletedAt || profile.status !== "active") return null;

    const permissions = new Set((profile.role?.permissions ?? []).map((rp) => rp.permission.key));
    return { permissions, roleName: profile.role?.name ?? null };
  }

  has(context: StaffContext, permission: string): boolean {
    return context.permissions.has(permission);
  }
}
