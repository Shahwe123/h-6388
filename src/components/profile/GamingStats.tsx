
import { useState } from 'react';
import { BarChart, ChartPie } from 'lucide-react';
import StatCharts from '@/components/profile/StatCharts';

/**
 * GamingStats component
 * Displays user's gaming statistics with toggleable chart types
 * Allows switching between bar chart and pie chart views
 */
const GamingStats = () => {
  // State to track currently selected chart type
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gaming Stats</h2>

        {/* Chart type toggle buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-400">View:</span>
          <div className="flex space-x-1 bg-black/30 p-1 rounded-md">
            <button 
              className={`p-1 rounded ${chartType === 'bar' ? 'bg-neon-purple/30' : ''}`}
              onClick={() => setChartType('bar')}
            >
              <BarChart className="h-4 w-4" />
            </button>
            <button 
              className={`p-1 rounded ${chartType === 'pie' ? 'bg-neon-purple/30' : ''}`}
              onClick={() => setChartType('pie')}
            >
              <ChartPie className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Render the appropriate chart based on selected type */}
      <StatCharts chartType={chartType} />
    </div>
  );
};

export default GamingStats;
