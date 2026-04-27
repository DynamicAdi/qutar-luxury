"use client";

import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { useCMS, formatPrice } from "@/store/cms";
import { Building2, Users, UserSquare2, TrendingUp, ArrowUpRight } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueData = months.map((m, i) => ({
  month: m,
  revenue: 4 + Math.round(Math.sin(i / 1.7) * 3 + i * 1.2 + Math.random() * 2),
  leads: 8 + Math.round(Math.cos(i / 2) * 4 + i * 0.8 + Math.random() * 3),
}));
const sourceColors = ["hsl(41 78% 58%)", "hsl(38 60% 38%)", "hsl(30 18% 25%)", "hsl(44 78% 72%)", "hsl(30 8% 55%)"];

export default function DashboardHome() {
  const { properties, leads, customers } = useCMS();
  const sold = properties.filter((p: any) => p.status === "Sold").length;
  const totalValue = properties.reduce((sum, p) => sum + p.price, 0);

  const categoryData = ["Buy", "Sell", "Rent", "Plots", "Residential"].map((c) => ({
    name: c,
    value: properties.filter((p) => p.category === c).length,
  }));

  const budgets = ["Under 1M", "1M – 5M", "5M – 10M", "10M+", "Rental"] as const;
  const leadSources = budgets.map((s) => ({
    name: s,
    value: leads.filter((l) => l.budget === s).length || 1,
  }));

  const stats = [
    { label: "Total Properties", value: properties.length, icon: Building2, trend: "+12%" },
    { label: "Active Leads", value: leads.length, icon: Users, trend: "+8%" },
    { label: "Customers", value: customers.length, icon: UserSquare2, trend: "+3%" },
    { label: "Portfolio Value", value: formatPrice(totalValue, "QAR"), icon: TrendingUp, trend: "+18%", small: true },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Welcome to QLP Console"
        subtitle="A snapshot of your luxury portfolio performance, leads and conversions."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            className="rounded-2xl p-4 md:p-5 shadow-card border-0 bg-card hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-gold-soft p-2.5">
                <s.icon className="h-4 w-4 text-primary-deep" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-success">
                <ArrowUpRight className="h-3 w-3" /> {s.trend}
              </span>
            </div>
            <div className="mt-4">
              <div className={`font-grotesk font-semibold ${s.small ? "text-lg md:text-xl" : "text-2xl md:text-3xl"}`}>
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
        <Card className="rounded-2xl p-5 shadow-card border-0 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-grotesk font-semibold">Revenue & Leads</div>
              <div className="text-xs text-muted-foreground">Last 12 months</div>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Revenue (M)</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-foreground" /> Leads</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(41 78% 58%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(41 78% 58%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(38 60% 38%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(38 60% 38%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(41 78% 58%)" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="leads" stroke="hsl(38 60% 38%)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card border-0">
          <div className="font-grotesk font-semibold">Lead Budget Range</div>
          <div className="text-xs text-muted-foreground">Distribution by price tier</div>
          <div className="h-48 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={leadSources} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {leadSources.map((_, i) => (
                    <Cell key={i} fill={sourceColors[i % sourceColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {leadSources.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: sourceColors[i] }} />
                  {s.name}
                </span>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="rounded-2xl p-5 shadow-card border-0 lg:col-span-2">
          <div className="font-grotesk font-semibold mb-4">Properties by Category</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(41 78% 58%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card border-0 bg-primary text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.2em] opacity-80">Sold this period</div>
          <div className="font-grotesk text-5xl font-semibold mt-3">{sold}</div>
          <div className="text-sm opacity-90 mt-1">properties closed</div>
          <div className="mt-6 rounded-xl bg-[hsl(30_18%_10%/0.15)] p-3 text-sm">
            Conversion rate <span className="font-semibold ml-1">{leads.length ? Math.round((sold / leads.length) * 100) : 0}%</span>
          </div>
        </Card>
      </div>
    </>
  );
}
