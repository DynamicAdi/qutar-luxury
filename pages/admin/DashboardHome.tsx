"use client";

import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import LoaderScreen from "@/misc/LoaderScreen";
import { formatPrice } from "@/store/cms";
import axios from "axios";
import {
  Building2,
  Users,
  UserSquare2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sourceColors = [
  "hsl(41 78% 58%)",
  "hsl(38 60% 38%)",
  "hsl(30 18% 25%)",
  "hsl(44 78% 72%)",
  "hsl(30 8% 55%)",
];

export default function DashboardHome() {
  const [counts, setCounts] = useState({
    totalProperties: 0,
    totalLeads: 0,
    totalCustomers: 0,
    totalBudget: 0,
    soldItems: 0,
  });
  const [revenueData, setRevenueData] = useState();
  const [propertyCategory, setPropertyCategory] = useState<
    { category: ""; count: 0 }[]
  >([]);
  const [transition, startTransition] = useTransition();
  const [toProperties, setTopProperties] = useState<
    { id: string; title: string; category: string; _count: { Leads: number } }[]
  >([
    {
      id: "",
      title: "",
      category: "",
      _count: { Leads: 0 },
    },
  ]);

  const getData = () => {
    startTransition(async () => {
      const req = await axios.get("/api/home");
      if (req.status === 200) {
        console.log(req.data);
        setCounts(req.data.counts);
        setRevenueData(req.data.revenueData);
        setPropertyCategory(req.data.propertiesByCategory);
        setTopProperties(req.data.topProperties);
      }
    });
  };

  const categoryData = propertyCategory.map((c) => ({
    name: c.category,
    value: c.count,
  }));

  const proprtiesSources = toProperties.map((s) => ({
    id: s.id,
    name: s.title,
    category: s.category,
    value: s._count.Leads,
  }));

  const stats = [
    {
      label: "Total Properties",
      value: counts.totalProperties,
      icon: Building2,
    },
    {
      label: "Active Leads",
      value: counts.totalLeads,
      icon: Users,
    },
    {
      label: "Customers",
      value: counts.totalCustomers,
      icon: UserSquare2,
    },
    {
      label: "Portfolio Value",
      value: formatPrice(counts.totalBudget, "QAR"),
      icon: TrendingUp,
      small: true,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  if (transition) {
    return (
      <LoaderScreen />
    )
  }
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
            <div className="flex items-start justify-end">
              <div className="rounded-xl bg-gradient-gold-soft p-4">
                <s.icon className="h-6 w-6 text-primary-deep" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-success">
                {/* <ArrowUpRight className="h-3 w-3" /> {s.trend} */}
              </span>
            </div>
            <div className="mt-4">
              <div
                className={`font-grotesk font-semibold ${s.small ? "text-lg md:text-3xl" : "text-2xl md:text-4xl"}`}
              >
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {s.label}
              </div>
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
              <div className="text-xs text-muted-foreground">
                Last 12 months
              </div>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Revenue (M)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary-foreground" />{" "}
                Leads
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(41 78% 58%)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(41 78% 58%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(38 60% 38%)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(38 60% 38%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="customers"
                  stroke="hsl(41 78% 58%)"
                  strokeWidth={2.5}
                  fill="url(#g1)"
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="hsl(38 60% 38%)"
                  strokeWidth={2}
                  fill="url(#g2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card border-0">
          <div className="font-grotesk font-semibold">Top Properties Range</div>
          <div className="text-xs text-muted-foreground">
            Distribution by No. Of Leads
          </div>
          <div className="h-48 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={proprtiesSources}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {proprtiesSources.map((_, i) => (
                    <Cell
                      key={i}
                      fill={sourceColors[i % sourceColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {proprtiesSources.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center justify-between text-xs"
              >
                <Link
                  href={`/dashboard/properties/${s.category.toLowerCase()}/${s.id}/edit`}
                  className="flex items-center gap-2 hover:text-gradient-gold"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: sourceColors[i] }}
                  />
                  {s.name}
                </Link>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="rounded-2xl p-5 shadow-card border-0 lg:col-span-2">
          <div className="font-grotesk font-semibold mb-4">
            Properties by Category
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(162 78% 16%)"
                  radius={[200, 200, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card border-0 bg-primary text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.2em] opacity-80">
            Sold this period
          </div>
          <div className="font-grotesk text-5xl font-semibold mt-3">
            {counts.soldItems}
          </div>
          <div className="text-sm opacity-90 mt-1">properties closed</div>
          <div className="mt-6 rounded-xl bg-[hsl(30_18%_10%/0.15)] p-3 text-sm">
            Conversion rate{" "}
            <span className="font-semibold ml-1">
              {counts.totalLeads
                ? Math.round((counts.soldItems / counts.totalLeads) * 100)
                : 0}
              %
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
