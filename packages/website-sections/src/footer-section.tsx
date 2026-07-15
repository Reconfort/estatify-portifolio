"use client";

import Link from "next/link";
import type { AgencyProfile, FooterSectionConfig, WebsiteSettings } from "@estatify/types";

export function FooterSection({
  config,
  website,
  profile,
}: {
  config: FooterSectionConfig;
  website: WebsiteSettings;
  profile: AgencyProfile;
}) {
  const company = profile.basic.companyName || website.general.websiteName;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-[var(--site-secondary)] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">{company}</p>
          {website.footer.description ? (
            <p className="mt-2 text-sm text-white/75">{website.footer.description}</p>
          ) : profile.basic.companyDescription ? (
            <p className="mt-2 text-sm text-white/75">{profile.basic.companyDescription}</p>
          ) : null}
        </div>

        {config.showQuickLinks && website.footer.quickLinks.length > 0 ? (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Links</p>
            <ul className="mt-3 space-y-2">
              {website.footer.quickLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-sm text-white/85 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {website.contact.websiteEmail ? <li>{website.contact.websiteEmail}</li> : null}
            {profile.contact.primaryPhone ? <li>{profile.contact.primaryPhone}</li> : null}
            {profile.address.city ? (
              <li>
                {profile.address.city}
                {profile.address.country ? `, ${profile.address.country}` : ""}
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-6xl border-t border-white/15 pt-6 text-center text-xs text-white/60">
        {website.footer.copyright ?? `© ${year} ${company}. All rights reserved.`}
      </p>
    </footer>
  );
}
