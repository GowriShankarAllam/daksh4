import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend: 'up' | 'down' | 'stable';
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: 'text-green-500',
  },
  down: {
    icon: TrendingDown,
    color: 'text-red-500',
  },
  stable: {
    icon: Minus,
    color: 'text-blue-500',
  },
};

export default function MetricsCard({ title, value, icon, trend }: MetricsCardProps) {
  const TrendIcon = trendConfig[trend].icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          {icon}
        </div>
        <TrendIcon className={`h-5 w-5 ${trendConfig[trend].color}`} />
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-semibold mt-1 dark:text-white">{value}</p>
    </div>
  );
}