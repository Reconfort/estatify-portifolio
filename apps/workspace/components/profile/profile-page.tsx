"use client";

import { useSession, useTenant } from "@estatify/auth";
import { ProfileDetails } from "./profile-details";
import { ProfileHeader } from "./profile-header";

function displayNameFromEmail(email: string | undefined): string {
  if (!email) return "User";
  const local = email.split("@")[0] ?? "user";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return "User";
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function roleLabel(role: string | undefined): string {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function ProfilePage() {
  const { user } = useSession();
  const { activeTenant } = useTenant();

  const displayName = displayNameFromEmail(user?.email);
  const initials = initialsFromName(displayName);
  const agencyName = activeTenant?.agencyName ?? activeTenant?.slug ?? "Your agency";
  const role = roleLabel(activeTenant?.role);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <ProfileHeader
        displayName={displayName}
        role={role}
        agencyName={agencyName}
        avatarInitials={initials}
      />
      <ProfileDetails user={user} />
    </div>
  );
}
