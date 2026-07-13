import { Injectable } from "@nestjs/common";
import type { Prisma } from "@estatify/database";
import type { Paginated, PermissionListItem, PermissionListQuery } from "@estatify/types";
import { PrismaService } from "../../prisma/prisma.service";

/** Read-only catalog view. Permissions are code-defined; roles reference them. */
@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: PermissionListQuery): Promise<Paginated<PermissionListItem>> {
    const { page, pageSize, search, module } = query;
    const where: Prisma.PermissionWhereInput = {
      ...(module ? { module } : {}),
      ...(search
        ? {
            OR: [
              { key: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.client.permission.findMany({
        where,
        include: { roles: { include: { role: { select: { name: true, deletedAt: true } } } } },
        orderBy: [{ module: "asc" }, { key: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.client.permission.count({ where }),
    ]);

    const items: PermissionListItem[] = rows.map((p) => ({
      key: p.key,
      module: p.module,
      action: p.action,
      description: p.description,
      assignedRoles: p.roles
        .filter((r) => !r.role.deletedAt)
        .map((r) => r.role.name)
        .sort(),
      createdAt: p.createdAt.toISOString(),
    }));

    return { items, total, page, pageSize };
  }
}
