import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { DataSource, DataQualityMetric } from '../../types';
import DataSourceList from './DataSourceList';
import DataQualityChart from './DataQualityChart';

const mockSources: DataSource[] = [
  {
    id: '1',
    name: 'Customer Database',
    type: 'sql',
    status: 'connected',
    lastSync: new Date().toISOString(),
    errorRate: 0.5,
    recordsProcessed: 150000,
  },
  {
    id: '2',
    name: 'Marketing API',
    type: 'api',
    status: 'processing',
    lastSync: new Date().toISOString(),
    errorRate: 2.1,
    recordsProcessed: 75000,
  },
  {
    id: '3',
    name: 'Sales Data',
    type: 'spreadsheet',
    status: 'error',
    lastSync: new Date().toISOString(),
    errorRate: 15.8,
    recordsProcessed: 25000,
  },
];

const mockMetrics: DataQualityMetric[] = [
  {
    id: '1',
    name: 'Data Completeness',
    value: 98.5,
    threshold: 99,
    status: 'good',
  },
  {
    id: '2',
    name: 'Data Accuracy',
    value: 85.2,
    threshold: 95,
    status: 'warning',
  },
  {
    id: '3',
    name: 'Schema Validation',
    value: 65.8,
    threshold: 90,
    status: 'error',
  },
];

export default function DataSourceManager() {
  const [sources, setSources] = useState(mockSources);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSources((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold dark:text-white">Data Sources</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Source
            </button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sources}
              strategy={verticalListSortingStrategy}
            >
              <DataSourceList sources={sources} />
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <div>
        <DataQualityChart metrics={mockMetrics} />
      </div>
    </div>
  );
}