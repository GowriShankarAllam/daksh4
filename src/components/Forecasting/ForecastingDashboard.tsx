import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Brain, TrendingUp, AlertTriangle, Settings } from 'lucide-react';
import { aiForecasting, type ScenarioParams } from '../../services/AIForecastingService';
import type { ForecastResult } from '../../services/AIForecastingService';

interface ForecastingDashboardProps {
  historicalData: number[][];
}

export default function ForecastingDashboard({ historicalData }: ForecastingDashboardProps) {
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [scenario, setScenario] = useState<ScenarioParams>({
    marketingBudget: 0,
    pricing: 0,
    seasonality: 0,
    competitorActivity: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeForecasting();
  }, [historicalData]);

  const initializeForecasting = async () => {
    setIsLoading(true);
    try {
      await aiForecasting.initialize(historicalData);
      const initialForecast = await aiForecasting.forecast(12); // 12 months horizon
      setForecast(initialForecast);
    } catch (error) {
      console.error('Failed to initialize forecasting:', error);
    }
    setIsLoading(false);
  };

  const handleScenarioChange = async (params: Partial<ScenarioParams>) => {
    const newScenario = { ...scenario, ...params };
    setScenario(newScenario);
    
    setIsLoading(true);
    try {
      const scenarioForecast = await aiForecasting.simulateScenario(newScenario);
      setForecast(scenarioForecast);
    } catch (error) {
      console.error('Failed to simulate scenario:', error);
    }
    setIsLoading(false);
  };

  const chartData = {
    labels: forecast?.predictions.map((_, i) => `Month ${i + 1}`) || [],
    datasets: [
      {
        label: 'Forecast',
        data: forecast?.predictions || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'AI-Powered Business Forecast'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold dark:text-white">AI Forecasting Engine</h2>
        </div>
        <div className="flex items-center gap-4">
          {forecast?.trends && (
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-5 w-5 ${
                forecast.trends.direction === 'up' ? 'text-green-500' :
                forecast.trends.direction === 'down' ? 'text-red-500' :
                'text-blue-500'
              }`} />
              <span className="text-sm font-medium dark:text-white">
                {Math.round(forecast.trends.strength * 100)}% Confidence
              </span>
            </div>
          )}
          {forecast?.anomalies.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium dark:text-white">
                {forecast.anomalies.length} Anomalies Detected
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Scenario Simulation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marketing Budget Adjustment (%)
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={scenario.marketingBudget}
                  onChange={(e) => handleScenarioChange({ marketingBudget: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {scenario.marketingBudget}%
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pricing Adjustment (%)
                </label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={scenario.pricing}
                  onChange={(e) => handleScenarioChange({ pricing: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {scenario.pricing}%
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seasonality Impact (%)
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={scenario.seasonality}
                  onChange={(e) => handleScenarioChange({ seasonality: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {scenario.seasonality}%
                </span>
              </div>
            </div>
          </div>

          {forecast && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 dark:text-white">AI Insights</h3>
              <div className="space-y-2">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Trend Analysis:</strong> {forecast.trends.direction} trend with
                  {' '}{Math.round(forecast.trends.strength * 100)}% strength
                </p>
                {forecast.anomalies.length > 0 && (
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Anomalies:</strong> Detected at months{' '}
                    {forecast.anomalies.map(i => i + 1).join(', ')}
                  </p>
                )}
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Confidence Score:</strong> {Math.round(forecast.confidence * 100)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}