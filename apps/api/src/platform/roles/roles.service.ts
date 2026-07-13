import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { CreateRoleInput, RoleDetail, RoleListItem, UpdateRoleInput } from "@estatify/types";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Roles CRUD + permission assignment. Role/RolePermission are global tables
 * (no RLS). System roles (Super Admin) are protected from edit/delete so the
 * platform can never lock itself out.
 */
@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<RoleListItem[]> {
    const roles = await this.prisma.client.role.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { permissions: true, staff: true } } },
      orderBy: { name: "asc" },
    });
    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      membersCount: r._count.staff,
      permissionsCount: r._count.permissions,
      isSystem: r.isSystem,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async getDetail(id: string): Promise<RoleDetail> {
    const role = await this.prisma.client.role.findFirst({
      where: { id, deletedAt: null },
      include: {
        permissions: { include: { permission: { select: { key: true } } } },
        _count: { select: { permissions: true, staff: true } },
      },
    });
    if (!role) throw new NotFoundException("Role not found");
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      membersCount: role._count.staff,
      permissionsCount: role._count.permissions,
      isSystem: role.isSystem,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
      permissionKeys: role.permissions.map((rp) => rp.permission.key),
    };
  }

  async create(input: CreateRoleInput): Promise<RoleDetail> {
    if (
      await this.prisma.client.role.findUnique({
        where: { name: input.name },
        select: { id: true },
      })
    ) {
      throw new ConflictException("A role with that name already exists");
    }
    const permissionIds = await this.resolvePermissionIds(input.permissionKeys);
    const role = await this.prisma.client.role.create({
      data: {
        name: input.name,
        description: input.description,
        permissions: { create: permissionIds.map((permissionId) => ({ permissionId })) },
      },
    });
    return this.getDetail(role.id);
  }

  async update(id: string, input: UpdateRoleInput): Promise<RoleDetail> {
    const role = await this.prisma.client.role.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, isSystem: true },
    });
    if (!role) throw new NotFoundException("Role not found");
    if (role.isSystem) throw new ForbiddenException("System roles cannot be modified");

    if (input.name) {
      const clash = await this.prisma.client.role.findFirst({
        where: { name: input.name, id: { not: id } },
        select: { id: true },
      });
      if (clash) throw new ConflictException("A role with that name already exists");
    }

    const permissionIds = input.permissionKeys
      ? await this.resolvePermissionIds(input.permissionKeys)
      : null;

    await this.prisma.client.$transaction(async (tx) => {
      await tx.role.update({
        where: { id },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
        },
      });
      if (permissionIds) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
          skipDuplicates: true,
        });
      }
    });
    return this.getDetail(id);
  }

  async remove(id: string): Promise<void> {
    const role = await this.prisma.client.role.findFirst({
      where: { id, deletedAt: null },
      include: { _count: { select: { staff: true } } },
    });
    if (!role) throw new NotFoundException("Role not found");
    if (role.isSystem) throw new ForbiddenException("System roles cannot be deleted");
    if (role._count.staff > 0) {
      throw new ConflictException("Reassign staff before deleting this role");
    }
    await this.prisma.client.role.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private async resolvePermissionIds(keys: string[]): Promise<string[]> {
    if (keys.length === 0) return [];
    const perms = await this.prisma.client.permission.findMany({
      where: { key: { in: keys } },
      select: { id: true },
    });
    return perms.map((p) => p.id);
  }
}
