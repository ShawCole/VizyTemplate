import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface VerticalBarChartProps {
  data: ChartData[];
  title: string;
  color: string;
  showUnknowns?: boolean;
}

export function VerticalBarChart({ data, title, color, showUnknowns = false }: VerticalBarChartProps) {
  const isFinancialChart = title.includes('Income') || title.includes('Net Worth');

  // Filter out Unknown data when showUnknowns is false
  const displayData = showUnknowns
    ? data
    : data.filter(item => item.name !== 'Unknown');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-[20px] font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 25
            }}
          >
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{
                fontSize: isFinancialChart || title.includes('Company Size') || title.includes('Company Revenue') ? 13 : 12
              }}
              tickMargin={4}
            />
            <YAxis
              tick={{
                fontSize: isFinancialChart || title.includes('Company Size') || title.includes('Company Revenue') ? 16 : 11
              }}
            />
            <Tooltip />
            <Bar
              key={`vertical-bar-${title}`}
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease"
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}