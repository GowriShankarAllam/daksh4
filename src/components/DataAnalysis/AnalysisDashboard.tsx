import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie, Radar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Brain, TrendingUp, BarChart as ChartBar, PieChart, Activity, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import DataUploader from './DataUploader';
import { analyzeData, generateInsights, type DataInsight } from '../../services/DataAnalysisService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalysisDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [insights, setInsights] = useState<DataInsight[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'distribution' | 'correlation'>('overview');

  useEffect(() => {
    if (data.length > 0) {
      const analysisResults = analyzeData(data);
      const dataInsights = generateInsights(analysisResults);
      setInsights(dataInsights);
    }
  }, [data]);

  const handleDataUpload = (uploadedData: any[]) => {
    setData(uploadedData);
    if (uploadedData.length > 0) {
      setSelectedMetric(Object.keys(uploadedData[0])[0]);
    }
  };

  const getMetricSummary = (metric: string) => {
    if (!data.length) return null;
    const values = data.map(d => Number(d[metric])).filter(v => !isNaN(v));
    const latest = values[values.length - 1];
    const previous = values[values.length - 2];
    const change = ((latest - previous) / previous) * 100;
    
    return {
      value: latest.toFixed(2),
      change: change.toFixed(1),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const getChartData = () => {
    if (!data.length || !selectedMetric) return null;

    const filteredData = data.slice(-getTimeRangeInDays());
    const labels = filteredData.map(d => new Date(d.date).toLocaleDateString());
    const values = filteredData.map(d => Number(d[selectedMetric]));

    return {
      labels,
      datasets: [
        {
          label: selectedMetric,
          data: values,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
      ],
    };
  };

  const getDistributionData = () => {
    if (!data.length || !selectedMetric) return null;

    const values = data.map(d => Number(d[selectedMetric]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const buckets = 10;
    const bucketSize = range / buckets;

    const distribution = Array(buckets).fill(0);
    values.forEach(value => {
      const bucketIndex = Math.min(
        Math.floor((value - min) / bucketSize),
        buckets - 1
      );
      distribution[bucketIndex]++;
    });

    return {
      labels: distribution.map((_, i) => 
        `${(min + i * bucketSize).toFixed(1)} - ${(min + (i + 1) * bucketSize).toFixed(1)}`
      ),
      datasets: [{
        label: 'Frequency',
        data: distribution,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }],
    };
  };

  const getCorrelationData = () => {
    if (!data.length) return null;

    const metrics = Object.keys(data[0]).filter(key => key !== 'date');
    const correlations = metrics.map(metric1 => {
      const values1 = data.map(d => Number(d[metric1]));
      return metrics.map(metric2 => {
        const values2 = data.map(d => Number(d[metric2]));
        return calculateCorrelation(values1, values2);
      });
    });

    return {
      labels: metrics,
      datasets: [{
        label: 'Correlation Matrix',
        data: correlations.flat(),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }],
    };
  };

  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    const sum_x = x.reduce((a, b) => a + b, 0);
    const sum_y = y.reduce((a, b) => a + b, 0);
    const sum_xy = x.reduce((a, b, i) => a + b * y[i], 0);
    const sum_x2 = x.reduce((a, b) => a + b * b, 0);
    const sum_y2 = y.reduce((a, b) => a + b * b, 0);

    const correlation = (n * sum_xy - sum_x * sum_y) /
      Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

    return correlation;
  };

  const getTimeRangeInDays = () => {
    switch (timeRange) {
      case '1m': return 30;
      case '3m': return 90;
      case '6m': return 180;
      case '1y': return 365;
      default: return 30;
    }
  };

  return (
    <div className="space-y-6">
      <DataUploader onDataUpload={handleDataUpload} />

      {data.length > 0 && (
        <>
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(data[0])
              .filter(key => key !== 'date')
              .slice(0, 4)
              .map(metric => {
                const summary = getMetricSummary(metric);
                return (
                  <div key={metric} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric}</h3>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold dark:text-white">
                        {summary?.value}
                      </p>
                      <p className={`ml-2 flex items-center text-sm ${
                        summary?.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                        summary?.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`}>
                        {summary?.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> :
                         summary?.trend === 'down' ? <ArrowDownRight className="h-4 w-4" /> :
                         <Minus className="h-4 w-4" />}
                        {summary?.change}%
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Activity },
                { id: 'trends', name: 'Trends', icon: TrendingUp },
                { id: 'distribution', name: 'Distribution', icon: ChartBar },
                { id: 'correlation', name: 'Correlation', icon: PieChart },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    border-b-2 py-4 px-1 inline-flex items-center gap-2
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Area */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    {Object.keys(data[0])
                      .filter(key => key !== 'date')
                      .map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                  </select>
                  <div className="flex gap-2">
                    {(['1m', '3m', '6m', '1y'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded ${
                          timeRange === range
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeTab === 'overview' && getChartData() && (
                <Line
                  data={getChartData()!}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: `${selectedMetric} Over Time` }
                    }
                  }}
                />
              )}

              {activeTab === 'trends' && getChartData() && (
                <Bar
                  data={getChartData()!}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: `${selectedMetric} Trends` }
                    }
                  }}
                />
              )}

              {activeTab === 'distribution' && getDistributionData() && (
                <Bar
                  data={getDistributionData()!}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: `${selectedMetric} Distribution` }
                    }
                  }}
                />
              )}

              {activeTab === 'correlation' && getCorrelationData() && (
                <Radar
                  data={getCorrelationData()!}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Metric Correlations' }
                    }
                  }}
                />
              )}
            </div>

            {/* Insights Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                AI Insights
              </h3>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium dark:text-white">{insight.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                    {insight.recommendation && (
                      <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                        Recommendation: {insight.recommendation}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className={`flex items-center gap-1 ${
                        insight.trend === 'up' ? 'text-green-500' :
                        insight.trend === 'down' ? 'text-red-500' :
                        'text-blue-500'
                      }`}>
                        <TrendingUp className="h-4 w-4" />
                        {insight.trend === 'up' ? 'Increasing' :
                         insight.trend === 'down' ? 'Decreasing' :
                         'Stable'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Confidence: {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}