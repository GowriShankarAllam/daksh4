import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { DataQualityMetric } from '../../types';

interface DataQualityChartProps {
  metrics: DataQualityMetric[];
}

const statusConfig = {
  good: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
  error: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
};

export default function DataQualityChart({ metrics }: DataQualityChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Data Quality Metrics</h2>
      <div className="space-y-4">
        {metrics.map((metric) => {
          const StatusIcon = statusConfig[metric.status].icon;
          const percentage = (metric.value / metric.threshold) * 100;
          
          return (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon 
                    className={`h-5 w-5 ${statusConfig[metric.status].color}`} 
                  />
                  <span className="font-medium dark:text-white">{metric.name}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.value.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${statusConfig[metric.status].bgColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}