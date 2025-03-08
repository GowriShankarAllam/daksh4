import React from 'react';
import { Feature } from '../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface FeatureListProps {
  features: Feature[];
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
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

export default function FeatureList({ features }: FeatureListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Feature Analysis</h2>
      <div className="space-y-4">
        {features.map((feature) => {
          const StatusIcon = statusConfig[feature.status].icon;
          return (
            <div
              key={feature.id}
              className="border dark:border-gray-700 rounded-lg p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${statusConfig[feature.status].bgColor}`}>
                    <StatusIcon className={`h-5 w-5 ${statusConfig[feature.status].color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{feature.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last checked: {new Date(feature.lastChecked).toLocaleTimeString()}
                </span>
              </div>
              {feature.recommendations.length > 0 && (
                <div className="mt-4 pl-12">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recommendations:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    {feature.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}