"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { useZodForm } from "@estatify/hooks";
import { Field } from "@estatify/ui";
import type { PageSection } from "@estatify/types";
import {
  ctaSectionConfigSchema,
  featuredPropertiesSectionConfigSchema,
  footerSectionConfigSchema,
  heroSectionConfigSchema,
} from "@estatify/types";
import { Button } from "@estatify/ui";

export function ComposerInspectorPanel({
  section,
  onUpdate,
  onRemove,
}: {
  section: PageSection | null;
  onUpdate: (config: PageSection["config"]) => void;
  onRemove: () => void;
}) {
  if (!section) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card p-4">
        <p className="text-body-sm text-muted-foreground">
          Select a section in the preview or structure panel to edit its settings.
        </p>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-body-sm font-semibold capitalize text-foreground">
          {section.type.replace("-", " ")}
        </h3>
      </div>
      <div className="flex-1 p-4">
        {section.type === "hero" ? (
          <HeroInspector config={section.config} onUpdate={onUpdate} />
        ) : null}
        {section.type === "featured-properties" ? (
          <FeaturedInspector config={section.config} onUpdate={onUpdate} />
        ) : null}
        {section.type === "cta" ? (
          <CtaInspector config={section.config} onUpdate={onUpdate} />
        ) : null}
        {section.type === "footer" ? (
          <FooterInspector config={section.config} onUpdate={onUpdate} />
        ) : null}
      </div>
      <div className="border-t border-border p-4">
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={onRemove}>
          Remove section
        </Button>
      </div>
    </aside>
  );
}

function HeroInspector({
  config,
  onUpdate,
}: {
  config: PageSection["config"];
  onUpdate: (config: PageSection["config"]) => void;
}) {
  const form = useZodForm(heroSectionConfigSchema, {
    defaultValues: heroSectionConfigSchema.parse(config),
  });

  React.useEffect(() => {
    form.reset(heroSectionConfigSchema.parse(config));
  }, [config, form]);

  React.useEffect(() => {
    const sub = form.watch((values) => {
      const parsed = heroSectionConfigSchema.safeParse(values);
      if (parsed.success) onUpdate(parsed.data);
    });
    return () => sub.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className="space-y-3">
      <Field control={form.control} name="title" type="text" label="Heading" />
      <Field control={form.control} name="subtitle" type="textarea" label="Subtitle" rows={2} />
      <Field control={form.control} name="ctaText" type="text" label="CTA text" />
      <Field control={form.control} name="ctaHref" type="text" label="CTA link" />
      <Field
        control={form.control}
        name="backgroundImage"
        type="url"
        label="Background image URL"
      />
      <Field
        control={form.control}
        name="alignment"
        type="select"
        label="Alignment"
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ]}
      />
      <Field
        control={form.control}
        name="height"
        type="select"
        label="Height"
        options={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
        ]}
      />
    </div>
  );
}

function FeaturedInspector({
  config,
  onUpdate,
}: {
  config: PageSection["config"];
  onUpdate: (config: PageSection["config"]) => void;
}) {
  const form = useZodForm(featuredPropertiesSectionConfigSchema, {
    defaultValues: featuredPropertiesSectionConfigSchema.parse(config),
  });

  React.useEffect(() => {
    form.reset(featuredPropertiesSectionConfigSchema.parse(config));
  }, [config, form]);

  React.useEffect(() => {
    const sub = form.watch((values) => {
      const parsed = featuredPropertiesSectionConfigSchema.safeParse(values);
      if (parsed.success) onUpdate(parsed.data);
    });
    return () => sub.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className="space-y-3">
      <Field control={form.control} name="title" type="text" label="Title" />
      <Field control={form.control} name="subtitle" type="textarea" label="Subtitle" rows={2} />
      <Field
        control={form.control}
        name="source"
        type="select"
        label="Source"
        options={[
          { value: "featured", label: "Featured" },
          { value: "latest", label: "Latest" },
          { value: "luxury", label: "Luxury" },
        ]}
      />
      <Field control={form.control} name="limit" type="number" label="Maximum properties" />
      <Field
        control={form.control}
        name="layout"
        type="select"
        label="Layout"
        options={[
          { value: "grid", label: "Grid" },
          { value: "carousel", label: "Carousel" },
        ]}
      />
      <Field control={form.control} name="columns" type="number" label="Columns" />
      <Field control={form.control} name="buttonText" type="text" label="Button text" />
      <Field control={form.control} name="buttonHref" type="text" label="Button link" />
    </div>
  );
}

function CtaInspector({
  config,
  onUpdate,
}: {
  config: PageSection["config"];
  onUpdate: (config: PageSection["config"]) => void;
}) {
  const form = useZodForm(ctaSectionConfigSchema, {
    defaultValues: ctaSectionConfigSchema.parse(config),
  });

  React.useEffect(() => {
    form.reset(ctaSectionConfigSchema.parse(config));
  }, [config, form]);

  React.useEffect(() => {
    const sub = form.watch((values) => {
      const parsed = ctaSectionConfigSchema.safeParse(values);
      if (parsed.success) onUpdate(parsed.data);
    });
    return () => sub.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className="space-y-3">
      <Field control={form.control} name="title" type="text" label="Title" />
      <Field control={form.control} name="subtitle" type="textarea" label="Subtitle" rows={2} />
      <Field control={form.control} name="buttonText" type="text" label="Button text" />
      <Field control={form.control} name="buttonHref" type="text" label="Button link" />
    </div>
  );
}

function FooterInspector({
  config,
  onUpdate,
}: {
  config: PageSection["config"];
  onUpdate: (config: PageSection["config"]) => void;
}) {
  const form = useZodForm(footerSectionConfigSchema, {
    defaultValues: footerSectionConfigSchema.parse(config),
  });

  React.useEffect(() => {
    form.reset(footerSectionConfigSchema.parse(config));
  }, [config, form]);

  React.useEffect(() => {
    const sub = form.watch((values) => {
      const parsed = footerSectionConfigSchema.safeParse(values);
      if (parsed.success) onUpdate(parsed.data);
    });
    return () => sub.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-body-sm">
        <Controller
          control={form.control}
          name="showSocialLinks"
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
        Show social links
      </label>
      <label className="flex items-center gap-2 text-body-sm">
        <Controller
          control={form.control}
          name="showQuickLinks"
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
        Show quick links
      </label>
      <p className="text-caption text-muted-foreground">
        Footer content is pulled from Website settings and Agency profile.
      </p>
    </div>
  );
}
