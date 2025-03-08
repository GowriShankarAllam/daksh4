import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface ThemeCustomizerProps {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onThemeChange: (theme: any) => void;
  onClose: () => void;
}

export default function ThemeCustomizer({ theme, onThemeChange, onClose }: ThemeCustomizerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Customize Theme</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Color
          </label>
          <HexColorPicker
            color={theme.primary}
            onChange={(color) => onThemeChange({ ...theme, primary: color })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secondary Color
          </label>
          <HexColorPicker
            color={theme.secondary}
            onChange={(color) => onThemeChange({ ...theme, secondary: color })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Accent Color
          </label>
          <HexColorPicker
            color={theme.accent}
            onChange={(color) => onThemeChange({ ...theme, accent: color })}
          />
        </div>

        <div className="pt-4 border-t dark:border-gray-700">
          <button
            onClick={() => onThemeChange({
              primary: '#3B82F6',
              secondary: '#10B981',
              accent: '#8B5CF6',
            })}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </motion.div>
  );
}