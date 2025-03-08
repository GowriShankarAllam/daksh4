import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Database, Network as Api, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import type { DataSource } from '../../types';

interface DataSourceItemProps {
  source: DataSource;
}

const sourceTypeIcons = {
  sql: Database,
  nosql: Database,
  api: Api,
  spreadsheet: FileSpreadsheet,
};

const statusIcons = {
  connected: CheckCircle,
  processing: Loader2,
  error: AlertCircle,
};

const statusColors = {
  connected: 'text-green-500',
  processing: 'text-blue-500 animate-spin',
  error: 'text-red-500',
};

function DataSourceItem({ source }: DataSourceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: source.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = sourceTypeIcons[source.type];
  const StatusIcon = statusIcons[source.status];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md cursor-move border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium dark:text-white">{source.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {source.recordsProcessed.toLocaleString()} records processed
            </p>
          </div>
        </div>
        <StatusIcon className={`h-5 w-5 ${statusColors[source.status]}`} />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          Error Rate: {source.errorRate}%
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          Last Sync: {new Date(source.lastSync).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

interface DataSourceListProps {
  sources: DataSource[];
}

export default function DataSourceList({ sources }: DataSourceListProps) {
  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <DataSourceItem key={source.id} source={source} />
      ))}
    </div>
  );
}