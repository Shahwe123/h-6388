
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const RecentActivityChart: React.FC = () => {
  // Mock data for recent achievements over time (last 7 days)
  const activityData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 8 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 12 },
    { day: 'Fri', count: 7 },
    { day: 'Sat', count: 15 },
    { day: 'Sun', count: 10 }
  ];

  return (
    <div className="h-48 w-full">
      <ChartContainer
        config={{
          count: {
            theme: { light: '#8B5CF6', dark: '#8B5CF6' },
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activityData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-neon-purple/20" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#A78BFA' }}
              axisLine={{ stroke: '#A78BFA' }}
              tickLine={{ stroke: '#A78BFA' }}
            />
            <YAxis
              tick={{ fill: '#A78BFA' }}
              axisLine={{ stroke: '#A78BFA' }}
              tickLine={{ stroke: '#A78BFA' }}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <ChartTooltipContent
                    className="bg-black/80 border-neon-purple"
                    payload={payload}
                    label={label}
                    formatter={(value) => [`${value} achievements`, 'Count']}
                  />
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorCount)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default RecentActivityChart;
