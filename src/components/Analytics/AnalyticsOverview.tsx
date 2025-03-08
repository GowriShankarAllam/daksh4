import React from 'react';
import { Brain } from 'lucide-react';
import type { AnalyticsInsight } from '../../types';
import InsightCard from './InsightCard';

const mockInsights: AnalyticsInsight[] = [
  {
    id: '1',
    type: 'anomaly',
    title: 'Unusual Customer Churn Spike',
    description: 'Detected abnormal increase in customer churn rate in the last 24 hours',
    impact: 'high',
    timestamp: new Date().toISOString(),
    metric: 'Churn Rate',
    value: 8.5,
    previousValue: 3.2,
    change: 165.6,
    recommendation: 'Analyze recent product changes and customer feedback. Consider implementing immediate retention strategies.'
  },
  {
    id: '2',
    type: 'prediction',
    title: 'Revenue Growth Forecast',
    description: 'AI-powered prediction for next quarter revenue based on current trends',
    impact: 'medium',
    timestamp: new Date().toISOString(),
    metric: 'Projected Revenue',
    value: 850000,
    previousValue: 720000,
    change: 18.1,
    recommendation: 'Increase marketing budget for high-performing channels to maximize growth potential.'
  },
  {
    id: '3',
    type: 'trend',
    title: 'Marketing Campaign Performance',
    description: 'Analysis of ongoing marketing campaigns effectiveness',
    impact: 'low',
    timestamp: new Date().toISOString(),
    metric: 'Conversion Rate',
    value: 4.2,
    previousValue: 3.8,
    change: 10.5,
    recommendation: 'Focus on email campaigns which show 2.5x better ROI than social media ads.'
  }
];

export default function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold dark:text-white">AI-Powered Insights</h2>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}