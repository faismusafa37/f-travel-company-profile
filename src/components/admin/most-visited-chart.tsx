"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PageData {
  path: string;
  _count: {
    path: number;
  };
}

const COLORS = [
  '#f97316', // orange-500
  '#ea580c', // orange-600
  '#c2410c', // orange-700
  '#9a3412', // orange-800
  '#7c2d12', // orange-900
  '#fb923c', // orange-400
  '#fdba74', // orange-300
  '#0f172a', // slate-900
  '#334155', // slate-700
  '#64748b', // slate-500
];

export function MostVisitedChart({ data }: { data: PageData[] }) {
  const chartData = data.map(d => ({
    name: d.path,
    value: d._count.path
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available yet
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [value, "Views"]} 
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
