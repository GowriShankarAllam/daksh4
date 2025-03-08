export interface DataInsight {
  title: string;
  description: string;
  recommendation?: string;
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface AnalysisResult {
  metric: string;
  mean: number;
  median: number;
  stdDev: number;
  trend: 'up' | 'down' | 'stable';
  changeRate: number;
}

export function analyzeData(data: any[]): AnalysisResult[] {
  return Object.keys(data[0]).map(metric => {
    if (metric === 'date') return null;

    const values = data.map(d => Number(d[metric])).filter(v => !isNaN(v));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues[Math.floor(values.length / 2)];
    const stdDev = Math.sqrt(
      values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (values.length - 1)
    );

    // Calculate trend
    const recentValues = values.slice(-30);
    const oldValues = values.slice(0, 30);
    const recentMean = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const oldMean = oldValues.reduce((a, b) => a + b, 0) / oldValues.length;
    const changeRate = ((recentMean - oldMean) / oldMean) * 100;

    return {
      metric,
      mean,
      median,
      stdDev,
      trend: changeRate > 1 ? 'up' : changeRate < -1 ? 'down' : 'stable',
      changeRate
    };
  }).filter(Boolean) as AnalysisResult[];
}

export function generateInsights(analysisResults: AnalysisResult[]): DataInsight[] {
  return analysisResults.map(result => {
    const insight: DataInsight = {
      title: `${result.metric} Analysis`,
      description: '',
      metric: result.metric,
      value: Math.abs(result.changeRate),
      trend: result.trend,
      confidence: calculateConfidence(result.stdDev, result.mean)
    };

    if (result.trend === 'up') {
      insight.description = `${result.metric} has shown a significant increase of ${result.changeRate.toFixed(1)}% recently.`;
      insight.recommendation = `Consider optimizing resources to maintain this positive trend.`;
    } else if (result.trend === 'down') {
      insight.description = `${result.metric} has decreased by ${Math.abs(result.changeRate).toFixed(1)}% recently.`;
      insight.recommendation = `Investigate potential causes and implement corrective measures.`;
    } else {
      insight.description = `${result.metric} has remained stable with minimal fluctuations.`;
      insight.recommendation = `Monitor for any significant changes in the trend.`;
    }

    return insight;
  });
}

function calculateConfidence(stdDev: number, mean: number): number {
  const coefficientOfVariation = stdDev / mean;
  return Math.max(0, Math.min(1, 1 - coefficientOfVariation));
}