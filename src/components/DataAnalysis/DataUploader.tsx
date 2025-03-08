import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface DataUploaderProps {
  onDataUpload: (data: any[]) => void;
}

export default function DataUploader({ onDataUpload }: DataUploaderProps) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });

        onDataUpload(data);
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    };

    reader.readAsText(file);
  }, [onDataUpload]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold dark:text-white">Data Upload</h2>
      </div>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Click to upload
            </span>
            {' '}or drag and drop
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            CSV files only
          </p>
        </label>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <AlertCircle className="h-4 w-4" />
        <p>Maximum file size: 10MB</p>
      </div>
    </div>
  );
}