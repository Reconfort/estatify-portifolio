"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import { DASH_EASE } from "./dashboard-card";

/**
 * Dashboard charts — dependency-free, token-only, fully interactive.
 * Hover/focus tooltips on every series; keyboard accessible; reduced-motion safe.
 * (Drop-in replaceable by Recharts later without touching widget callers.)
 */

/* ------------------------------ ChartTooltip ------------------------------ */

function ChartTooltip({
  title,
  rows,
  className,
  style,
}: {
  title: string;
  rows: readonly { label?: string | undefined; value: string; color: string }[];
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}) {
  return (
    <div
      role="tooltip"
      style={style}
      className={cn(
        "pointer-events-none z-20 w-max min-w-24 overflow-hidden rounded-lg border border-border/60 bg-popover shadow-lg",
        className,
      )}
    >
      <p className="border-b border-border/50 bg-muted/50 px-3 py-1.5 text-center text-caption font-semibold text-foreground">
        {title}
      </p>
      <div className="space-y-1 px-3 py-2">
        {rows.map((r, i) => (
          <p key={i} className="flex items-center justify-between gap-3 text-caption">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: r.color }}
                aria-hidden
              />
              {r.label}
            </span>
            <span className="font-bold tabular-nums text-foreground">{r.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/** Pick a tooltip alignment that stays inside the chart bounds. */
function edgeAlign(i: number, count: number) {
  if (i <= 1) return "left-0";
  if (i >= count - 2) return "right-0";
  return "left-1/2 -translate-x-1/2";
}

/* ------------------------------- MiniBarChart ------------------------------ */

export function MiniBarChart({
  values,
  labels,
  className,
  positive = true,
  formatValue = (v) => String(v),
}: {
  values: readonly number[];
  /** Tooltip labels, same length as values. */
  labels?: readonly string[] | undefined;
  className?: string | undefined;
  /** Colors the bars with success/destructive tint. */
  positive?: boolean | undefined;
  formatValue?: ((v: number) => string) | undefined;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState<number | null>(null);
  const max = Math.max(...values);
  const color = positive ? "var(--chart-2)" : "var(--destructive)";

  return (
    <div
      className={cn("relative flex h-10 items-end gap-[3px]", className)}
      role="img"
      aria-label={`Bar chart with ${values.length} data points`}
      onPointerLeave={() => setActive(null)}
    >
      {values.map((v, i) => (
        <button
          key={i}
          type="button"
          tabIndex={-1}
          aria-label={labels?.[i] ? `${labels[i]}: ${formatValue(v)}` : formatValue(v)}
          onPointerEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
          className="relative flex h-full w-1.5 cursor-default items-end rounded-sm outline-none"
        >
          <motion.span
            className="block w-full rounded-sm"
            style={{ backgroundColor: color }}
            initial={reduceMotion ? { height: `${(v / max) * 100}%` } : { height: "8%" }}
            whileInView={{ height: `${Math.max((v / max) * 100, 8)}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: DASH_EASE }}
            // Highlight active / last bar
            animate={{
              opacity:
                active === null ? (i === values.length - 1 ? 1 : 0.45) : active === i ? 1 : 0.3,
            }}
          />
        </button>
      ))}

      {active !== null && (
        <ChartTooltip
          title={labels?.[active] ?? `#${active + 1}`}
          rows={[{ value: formatValue(values[active] ?? 0), color }]}
          className={cn("absolute bottom-[calc(100%+0.5rem)]", edgeAlign(active, values.length))}
        />
      )}
    </div>
  );
}

/* ----------------------------- StackedBarChart ----------------------------- */

export interface StackedSeries {
  name: string;
  color: string;
  values: readonly number[];
}

/** Round the axis max up to a friendly step. */
function niceMax(raw: number) {
  const step = raw <= 40 ? 10 : 20;
  return Math.max(step, Math.ceil(raw / step) * step);
}

export function StackedBarChart({
  labels,
  series,
  className,
  formatValue = (v) => String(v),
}: {
  labels: readonly string[];
  series: readonly StackedSeries[];
  className?: string | undefined;
  formatValue?: ((v: number) => string) | undefined;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState<number | null>(null);
  const H = 190;
  const totals = labels.map((_, i) => series.reduce((s, sr) => s + (sr.values[i] ?? 0), 0));
  const max = niceMax(Math.max(...totals));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  return (
    <div
      className={cn("flex w-full gap-3", className)}
      role="img"
      aria-label={`Bar chart with ${series.length} data series: ${series.map((s) => s.name).join(", ")}`}
    >
      {/* Y axis */}
      <div
        className="flex shrink-0 flex-col justify-between text-right text-caption tabular-nums text-muted-foreground"
        style={{ height: H }}
        aria-hidden
      >
        {[...ticks].reverse().map((t) => (
          <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0">
            {t}
          </span>
        ))}
      </div>

      {/* Plot area */}
      <div className="relative flex-1" onPointerLeave={() => setActive(null)}>
        {/* Gridlines */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex flex-col justify-between"
          style={{ height: H }}
          aria-hidden
        >
          {ticks.map((t) => (
            <span key={t} className="border-t border-dashed border-border/60" />
          ))}
        </div>

        <div
          className="relative grid items-end gap-1.5 sm:gap-2.5"
          style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0,1fr))` }}
        >
          {labels.map((label, i) => {
            const isActive = active === i;
            const stackH = Math.round(((totals[i] ?? 0) / max) * H);
            return (
              <div key={label} className="relative flex flex-col items-center gap-2">
                <button
                  type="button"
                  aria-label={`${label}: ${series
                    .map((sr) => `${sr.name} ${formatValue(sr.values[i] ?? 0)}`)
                    .join(", ")}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="flex w-full cursor-default flex-col items-center justify-end rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ height: H }}
                >
                  <motion.div
                    className="flex w-full max-w-8 flex-col-reverse overflow-hidden rounded-md"
                    animate={{ opacity: active === null || isActive ? 1 : 0.35 }}
                    transition={{ duration: 0.15 }}
                  >
                    {series.map((sr, si) => {
                      const v = sr.values[i] ?? 0;
                      const h = Math.round((v / max) * H);
                      return (
                        <motion.span
                          key={sr.name}
                          initial={reduceMotion ? { height: h } : { height: 0 }}
                          whileInView={{ height: h }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.1 + i * 0.03 + si * 0.05,
                            duration: 0.45,
                            ease: DASH_EASE,
                          }}
                          style={{ backgroundColor: sr.color }}
                          className={cn("block w-full", si > 0 && "mt-px")}
                        />
                      );
                    })}
                  </motion.div>
                </button>
                <span
                  className={cn(
                    "text-caption transition-colors",
                    isActive ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>

                {isActive && (
                  <ChartTooltip
                    title={label}
                    rows={series.map((sr) => ({
                      label: sr.name,
                      value: formatValue(sr.values[i] ?? 0),
                      color: sr.color,
                    }))}
                    className={cn("absolute", edgeAlign(i, labels.length))}
                    style={{ bottom: stackH + 36 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- DonutChart ------------------------------- */

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

export function DonutChart({
  slices,
  centerLabel,
  centerValue,
  size = 176,
  thickness = 22,
  className,
  formatValue = (v) => String(v),
  showLegend = false,
}: {
  slices: readonly DonutSlice[];
  centerLabel?: string | undefined;
  centerValue?: string | undefined;
  size?: number | undefined;
  thickness?: number | undefined;
  className?: string | undefined;
  formatValue?: ((v: number) => string) | undefined;
  showLegend?: boolean | undefined;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState<number | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const segments = slices.map((s, i) => {
    const start = slices.slice(0, i).reduce((sum, x) => sum + x.value / total, 0);
    const frac = s.value / total;
    return { ...s, frac, offset: -start * c, dash: frac * c };
  });

  const activeSlice = active !== null ? slices[active] : undefined;

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div
        className="relative inline-flex items-center justify-center"
        onPointerLeave={() => setActive(null)}
      >
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: DASH_EASE }}
          role="img"
          aria-label={`Donut chart with ${slices.length} data series`}
        >
          {segments.map((s, i) => {
            const isActive = active === i;
            return (
              <motion.circle
                key={s.name}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeDasharray={`${Math.max(s.dash - 2, 0)} ${c - s.dash + 2}`}
                strokeDashoffset={s.offset}
                strokeLinecap="butt"
                className="cursor-pointer"
                onPointerEnter={() => setActive(i)}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                animate={{
                  strokeWidth: isActive ? thickness + 5 : thickness,
                  opacity: active === null ? 1 : isActive ? 1 : 0.35,
                }}
                transition={{ duration: 0.18 }}
              />
            );
          })}
        </motion.svg>

        {/* Center readout — swaps to the hovered slice */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {activeSlice ? (
            <>
              <span className="text-body-sm font-semibold" style={{ color: activeSlice.color }}>
                {activeSlice.name}
              </span>
              <span className="text-h3 font-semibold tracking-tight text-foreground">
                {formatValue(activeSlice.value)}
              </span>
            </>
          ) : (
            <>
              {centerLabel ? (
                <span className="text-caption text-muted-foreground">{centerLabel}</span>
              ) : null}
              <span className="text-h3 font-semibold tracking-tight text-foreground">
                {centerValue}
              </span>
            </>
          )}
        </div>
      </div>

      {showLegend ? (
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {slices.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="flex items-center gap-2 rounded-md px-1 py-0.5 text-body-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                  aria-hidden
                />
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ------------------------------ RadialProgress ----------------------------- */

export function RadialProgress({
  value,
  size = 56,
  thickness = 6,
  className,
  label,
}: {
  /** 0–100 */
  value: number;
  size?: number | undefined;
  thickness?: number | undefined;
  className?: string | undefined;
  label?: string | undefined;
}) {
  const reduceMotion = useReducedMotion();
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="img"
      aria-label={label ? `${label}: ${value}%` : `${value}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={thickness}
          opacity={0.5}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--chart-2)"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={
            reduceMotion ? { strokeDashoffset: c * (1 - value / 100) } : { strokeDashoffset: c }
          }
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: DASH_EASE }}
        />
      </svg>
      <span className="absolute text-caption font-bold text-foreground">{value}</span>
    </div>
  );
}

/* ------------------------------ LineAreaChart ------------------------------ */

export interface LinePoint {
  label: string;
  value: number;
}

/**
 * LineAreaChart — smooth line + soft area fill with hover crosshair tooltip.
 * Pure SVG; x is evenly spaced by label.
 */
export function LineAreaChart({
  points,
  className,
  color = "var(--chart-1)",
  height = 200,
  formatValue = (v) => String(v),
}: {
  points: readonly LinePoint[];
  className?: string | undefined;
  color?: string | undefined;
  height?: number | undefined;
  formatValue?: ((v: number) => string) | undefined;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState<number | null>(null);
  const W = 600;
  const H = height;
  const PAD = 8;
  const max = niceMax(Math.max(...points.map((p) => p.value)));
  const x = (i: number) => PAD + (i / Math.max(points.length - 1, 1)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);

  // Catmull-Rom → bezier for a smooth line
  const d = points
    .map((p, i, arr) => {
      if (i === 0) return `M ${x(0)} ${y(p.value)}`;
      const p0 = arr[Math.max(i - 2, 0)]!;
      const p1 = arr[i - 1]!;
      const p2 = p;
      const p3 = arr[Math.min(i + 1, arr.length - 1)]!;
      const c1x = x(i - 1) + (x(i) - x(Math.max(i - 2, 0))) / 6;
      const c1y = y(p1.value) + (y(p2.value) - y(p0.value)) / 6;
      const c2x = x(i) - (x(Math.min(i + 1, arr.length - 1)) - x(i - 1)) / 6;
      const c2y = y(p2.value) - (y(p3.value) - y(p1.value)) / 6;
      return `C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x(i)} ${y(p2.value)}`;
    })
    .join(" ");

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const gradId = React.useId();

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-3">
        {/* Y axis */}
        <div
          className="flex shrink-0 flex-col justify-between text-right text-caption tabular-nums text-muted-foreground"
          style={{ height: H }}
          aria-hidden
        >
          {[...ticks].reverse().map((t) => (
            <span key={t} className="leading-none">
              {t}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1" onPointerLeave={() => setActive(null)}>
          {/* Gridlines */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 flex flex-col justify-between"
            style={{ height: H }}
            aria-hidden
          >
            {ticks.map((t) => (
              <span key={t} className="border-t border-dashed border-border/60" />
            ))}
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="block w-full"
            style={{ height: H }}
            role="img"
            aria-label={`Line chart with ${points.length} data points`}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${d} L ${x(points.length - 1)} ${H} L ${x(0)} ${H} Z`}
              fill={`url(#${gradId})`}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
            <motion.path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: DASH_EASE }}
            />
            {active !== null && (
              <line
                x1={x(active)}
                x2={x(active)}
                y1={PAD}
                y2={H - PAD}
                stroke="var(--border)"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {/* Hover hit zones */}
            {points.map((p, i) => (
              <rect
                key={p.label + i}
                x={i === 0 ? 0 : (x(i) + x(i - 1)) / 2}
                y={0}
                width={
                  i === 0
                    ? (x(1) ?? W) / 2
                    : i === points.length - 1
                      ? W - (x(i) + x(i - 1)) / 2
                      : (x(i + 1) - x(i - 1)) / 2
                }
                height={H}
                fill="transparent"
                onPointerEnter={() => setActive(i)}
              />
            ))}
            {active !== null && points[active] ? (
              <circle
                cx={x(active)}
                cy={y(points[active].value)}
                r="4.5"
                fill={color}
                stroke="var(--card)"
                strokeWidth="2"
              />
            ) : null}
          </svg>

          {active !== null && points[active] ? (
            <ChartTooltip
              title={points[active].label}
              rows={[{ value: formatValue(points[active].value), color }]}
              className={cn(
                "absolute top-0",
                active <= 1
                  ? "left-0"
                  : active >= points.length - 2
                    ? "right-0"
                    : "left-1/2 -translate-x-1/2",
              )}
            />
          ) : null}
        </div>
      </div>

      {/* X labels (sparse) */}
      <div
        className="mt-2 flex justify-between pl-9 text-caption text-muted-foreground"
        aria-hidden
      >
        {points.map((p, i) =>
          points.length <= 8 || i % Math.ceil(points.length / 8) === 0 ? (
            <span key={p.label + i}>{p.label}</span>
          ) : null,
        )}
      </div>
    </div>
  );
}
