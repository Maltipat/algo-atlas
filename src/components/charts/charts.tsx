"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";

const axis = { stroke: "var(--muted)", fontSize: 11, tickLine: false, axisLine: false } as const;
const grid = <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />;
const tooltipStyle = {
  contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)" },
  labelStyle: { color: "var(--muted)" },
  cursor: { fill: "var(--surface-2)" },
};

export function BarSeries({ data, x, bars, height = 220, stacked }: { data: object[]; x: string; bars: { key: string; name: string; color: string }[]; height?: number; stacked?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        {grid}
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} allowDecimals={false} />
        <Tooltip {...tooltipStyle} />
        {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />}
        {bars.map((b, i) => <Bar animationDuration={600} key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={stacked && i < bars.length - 1 ? 0 : [4, 4, 0, 0]} stackId={stacked ? "s" : undefined} maxBarSize={28} />)}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AreaSeries({ data, x, y, name, height = 240, color = "var(--chart-1)" }: { data: object[]; x: string; y: string; name: string; height?: number; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${y}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}
        <XAxis dataKey={x} {...axis} minTickGap={24} />
        <YAxis {...axis} allowDecimals={false} />
        <Tooltip {...tooltipStyle} />
        <Area animationDuration={600} type="monotone" dataKey={y} name={name} stroke={color} strokeWidth={2} fill={`url(#fill-${y})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LineSeries({ data, x, lines, height = 220, domain }: { data: object[]; x: string; lines: { key: string; name: string; color: string }[]; height?: number; domain?: [number, number] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        {grid}
        <XAxis dataKey={x} {...axis} minTickGap={16} />
        <YAxis {...axis} domain={domain} />
        <Tooltip {...tooltipStyle} />
        {lines.map((l) => <Line animationDuration={600} key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={{ r: 2.5 }} connectNulls />)}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, height = 200, inner = 58, outer = 80, center }: { data: { name: string; value: number; color: string }[]; height?: number; inner?: number; outer?: number; center?: React.ReactNode }) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip {...tooltipStyle} />
          <Pie animationDuration={600} data={data} dataKey="value" nameKey="name" innerRadius={inner} outerRadius={outer} paddingAngle={2} stroke="none">
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {center && <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">{center}</div>}
    </div>
  );
}

export function HorizontalBars({ data, height, color = "var(--chart-1)", max }: { data: { name: string; value: number }[]; height?: number; color?: string; max?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height ?? Math.max(160, data.length * 28)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" {...axis} domain={[0, max ?? "auto"]} allowDecimals={false} />
        <YAxis type="category" dataKey="name" {...axis} width={120} />
        <Tooltip {...tooltipStyle} />
        <Bar animationDuration={600} dataKey="value" name="Value" fill={color} radius={[0, 4, 4, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MasteryRadar({ data, height = 280 }: { data: { topic: string; value: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="topic" tick={{ fill: "var(--muted)", fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip {...tooltipStyle} />
        <Radar animationDuration={600} dataKey="value" name="Mastery %" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
