
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatComparisonProps {
  title: string;
  icon: React.ReactNode;
  userData: any;
  friendData: any;
  stats: {
    label: string;
    userValue: string | number;
    friendValue: string | number;
    valueOnly?: boolean;
  }[];
}

const StatComparison = ({ 
  title, 
  icon, 
  userData, 
  friendData, 
  stats 
}: StatComparisonProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 text-center border-b border-zinc-800 pb-2">
            <div className="font-semibold text-sm">{userData.username}</div>
            <div className="font-semibold text-sm text-neutral-400">Stat</div>
            <div className="font-semibold text-sm">{friendData.username}</div>
          </div>
          
          {stats.map((stat, index) => {
            // Calculate if user is ahead or behind
            let comparison;
            let comparisonElement;
            
            if (typeof stat.userValue === 'number' && typeof stat.friendValue === 'number') {
              comparison = stat.userValue - stat.friendValue;
              
              if (comparison > 0) {
                comparisonElement = (
                  <div className="text-green-500 flex items-center justify-center">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {comparison}
                  </div>
                );
              } else if (comparison < 0) {
                comparisonElement = (
                  <div className="text-red-500 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    {Math.abs(comparison)}
                  </div>
                );
              } else {
                comparisonElement = (
                  <div className="text-yellow-400 flex items-center justify-center">
                    <Minus className="h-4 w-4 mr-1" />
                    Tied
                  </div>
                );
              }
            } else {
              comparisonElement = null;
            }
            
            return (
              <div key={index} className="grid grid-cols-3 items-center py-3 border-b border-zinc-800/40 last:border-0">
                <div className="text-center font-medium">{stat.userValue}</div>
                <div className="text-center">
                  <span className="text-sm text-neutral-400">{stat.label}</span>
                  {!stat.valueOnly && comparisonElement}
                </div>
                <div className="text-center font-medium">{stat.friendValue}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatComparison;
