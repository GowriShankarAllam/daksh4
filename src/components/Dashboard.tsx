import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertCircle, CheckCircle2, Download, 
  MessageSquare, Moon, Sun, Terminal, Layout, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GridLayout from 'react-grid-layout';
import { Feature, SystemMetrics, AnalysisReport } from '../types';
import FeatureList from './FeatureList';
import MetricsCard from './MetricsCard';
import AIChat from './AIChat';
import DataSourceManager from './DataIntegration/DataSourceManager';
import AnalyticsOverview from './Analytics/AnalyticsOverview';
import GeoMap from './Visualization/GeoMap';
import ThemeCustomizer from './ThemeCustomizer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const mockData: AnalysisReport = {
  timestamp: new Date().toISOString(),
  features: [
    {
      id: '1',
      name: 'Authentication Service',
      status: 'healthy',
      description: 'User authentication and authorization system',
      lastChecked: new Date().toISOString(),
      recommendations: ['Consider implementing 2FA for enhanced security']
    },
    {
      id: '2',
      name: 'Data Processing Pipeline',
      status: 'warning',
      description: 'Real-time data processing and analysis',
      lastChecked: new Date().toISOString(),
      recommendations: ['Optimize batch processing', 'Add error recovery mechanism']
    },
    {
      id: '3',
      name: 'API Gateway',
      status: 'error',
      description: 'API routing and management',
      lastChecked: new Date().toISOString(),
      recommendations: ['Implement rate limiting', 'Add request validation']
    }
  ],
  metrics: {
    cpuUsage: 45,
    memoryUsage: 68,
    responseTime: 250,
    uptime: 99.9
  },
  recommendations: [
    'Implement caching layer for better performance',
    'Add monitoring for API endpoints',
    'Update security protocols'
  ]
};

const defaultLayout = [
  { i: 'metrics', x: 0, y: 0, w: 12, h: 2 },
  { i: 'analytics', x: 0, y: 2, w: 12, h: 4 },
  { i: 'map', x: 0, y: 6, w: 8, h: 4 },
  { i: 'features', x: 8, y: 6, w: 4, h: 4 },
];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [layout, setLayout] = useState(defaultLayout);
  const [theme, setTheme] = useState({
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
  });

  useEffect(() => {
    // Load saved layout and theme preferences
    const savedLayout = localStorage.getItem('dashboardLayout');
    const savedTheme = localStorage.getItem('dashboardTheme');
    
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    }
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const downloadReport = () => {
    const report = JSON.stringify(mockData, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-report-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  };

  const handleThemeChange = (newTheme: any) => {
    setTheme(newTheme);
    localStorage.setItem('dashboardTheme', JSON.stringify(newTheme));
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--color-primary', newTheme.primary);
    document.documentElement.style.setProperty('--color-secondary', newTheme.secondary);
    document.documentElement.style.setProperty('--color-accent', newTheme.accent);
  };

  return (
    <div 
      className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
      style={{
        '--color-primary': theme.primary,
        '--color-secondary': theme.secondary,
        '--color-accent': theme.accent,
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            AI Business Intelligence
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCustomizer(true)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-yellow-400" />
              ) : (
                <Moon className="h-6 w-6 text-gray-600" />
              )}
            </button>
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </motion.div>

        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          width={1200}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
        >
          <div key="metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="CPU Usage"
                value={`${mockData.metrics.cpuUsage}%`}
                icon={<Terminal className="h-6 w-6" />}
                trend="up"
              />
              <MetricsCard
                title="Memory Usage"
                value={`${mockData.metrics.memoryUsage}%`}
                icon={<AlertCircle className="h-6 w-6" />}
                trend="down"
              />
              <MetricsCard
                title="Response Time"
                value={`${mockData.metrics.responseTime}ms`}
                icon={<Activity className="h-6 w-6" />}
                trend="stable"
              />
              <MetricsCard
                title="Uptime"
                value={`${mockData.metrics.uptime}%`}
                icon={<CheckCircle2 className="h-6 w-6" />}
                trend="up"
              />
            </div>
          </div>

          <div key="analytics">
            <AnalyticsOverview />
          </div>

          <div key="map">
            <GeoMap />
          </div>

          <div key="features">
            <FeatureList features={mockData.features} />
          </div>
        </GridLayout>

        <AnimatePresence>
          {showCustomizer && (
            <ThemeCustomizer
              theme={theme}
              onThemeChange={handleThemeChange}
              onClose={() => setShowCustomizer(false)}
            />
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageSquare className="h-6 w-6" />
        </motion.button>

        {showChat && <AIChat onClose={() => setShowChat(false)} />}
      </div>
    </div>
  );
}