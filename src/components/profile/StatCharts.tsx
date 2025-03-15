
import React from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

type StatChartsProps = {
  chartType?: 'bar' | 'pie';
  rarityData?: Array<{name: string; value: number; color: string}>;
  genreData?: Array<{name: string; value: number; color: string}>;
  completionData?: Array<{month: string; value: number;}>;
};

export const StatCharts: React.FC<StatChartsProps> = ({ 
  chartType = 'bar',
  rarityData = [
    { name: 'Ultra Rare', value: 3, color: '#D946EF' },
    { name: 'Rare', value: 15, color: '#8B5CF6' },
    { name: 'Common', value: 27, color: '#0EA5E9' }
  ], 
  genreData = [
    { name: 'FPS', value: 35, color: '#F97316' },
    { name: 'RPG', value: 25, color: '#8B5CF6' },
    { name: 'Sport', value: 20, color: '#0EA5E9' },
    { name: 'Racing', value: 15, color: '#10B981' },
    { name: 'Other', value: 5, color: '#6B7280' }
  ],
  completionData = [
    { month: 'Jan', value: 2 },
    { month: 'Feb', value: 3 },
    { month: 'Mar', value: 1 },
    { month: 'Apr', value: 4 },
    { month: 'May', value: 2 },
    { month: 'Jun', value: 3 }
  ]
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-lg font-bold mb-2">Trophy Rarity Distribution</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rarityData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#8B5CF6', borderRadius: '0.5rem' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {rarityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-lg font-bold mb-2">Time by Genre</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={(entry) => entry.name}
                labelLine={{ stroke: '#8B5CF6', strokeWidth: 1 }}
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#8B5CF6', borderRadius: '0.5rem' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-lg font-bold mb-2">Completion Trendline</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#8B5CF6', borderRadius: '0.5rem' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#D946EF' }}
                activeDot={{ r: 6, fill: '#D946EF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatCharts;
