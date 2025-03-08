import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, LineChart, Brain } from 'lucide-react';
import type { AnalyticsInsight } from '../../types';

interface InsightCardProps {
  insight: AnalyticsInsight;
}

const typeConfig = {
  trend: {
    icon: LineChart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  anomaly: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
  },
  prediction: {
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
};

const impactColors = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-green-500',
};

export default function InsightCard({ insight }: InsightCardProps) {
  const Icon = typeConfig[insight.type].icon;
  const TrendIcon = insight.change > 0 ? TrendingUp : insight.change < 0 ? TrendingDown : Minus;
  const trendColor = insight.change > 0 ? 'text-green-500' : insight.change < 0 ? 'text-red-500' : 'text-blue-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${typeConfig[insight.type].bgColor}`}>
            <Icon className={`h-5 w-5 ${typeConfig[insight.type].color}`} />
          </div>
          <div>
            <h3 className="font-medium dark:text-white">{insight.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
          </div>
        </div>
        <span className={`text-sm font-medium ${impactColors[insight.impact]}`}>
          {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{insight.metric}</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold dark:text-white">
              {insight.value.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <span className={`text-sm ${trendColor}`}>
                {Math.abs(insight.change)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {insight.recommendation && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>AI Recommendation:</strong> {insight.recommendation}
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Generated {new Date(insight.timestamp).toLocaleString()}
      </div>
    </div>
  );
}