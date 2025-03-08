export interface Feature {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  description: string;
  lastChecked: string;
  recommendations: string[];
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  uptime: number;
}

export interface AnalysisReport {
  timestamp: string;
  features: Feature[];
  metrics: SystemMetrics;
  recommendations: string[];
}

export interface DataSource {
  id: string;
  name: string;
  type: 'sql' | 'nosql' | 'api' | 'spreadsheet';
  status: 'connected' | 'processing' | 'error';
  lastSync: string;
  errorRate: number;
  recordsProcessed: number;
}

export interface DataQualityMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'good' | 'warning' | 'error';
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  metric: string;
  value: number;
  previousValue: number;
  change: number;
  recommendation?: string;
}

export interface ChartData {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AIAnalysis {
  query: string;
  timestamp: Date;
  insights: AIInsight[];
}

export interface AIInsight {
  type: 'trend' | 'anomaly' | 'prediction';
  metric: string;
  value: string;
  prediction?: string;
  alert?: string;
}