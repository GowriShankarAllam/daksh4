import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mockLocations = [
  { id: 1, lat: 40.7128, lng: -74.0060, name: 'New York', value: 850000 },
  { id: 2, lat: 34.0522, lng: -118.2437, name: 'Los Angeles', value: 650000 },
  { id: 3, lat: 51.5074, lng: -0.1278, name: 'London', value: 920000 },
  { id: 4, lat: 35.6762, lng: 139.6503, name: 'Tokyo', value: 1250000 },
];

export default function GeoMap() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Geographic Distribution</h2>
        <div className="flex gap-2">
          <select className="px-2 py-1 rounded border dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <option value="revenue">Revenue</option>
            <option value="users">Users</option>
            <option value="engagement">Engagement</option>
          </select>
        </div>
      </div>
      
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="dark:invert"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {mockLocations.map((location) => (
            <CircleMarker
              key={location.id}
              center={[location.lat, location.lng]}
              radius={Math.sqrt(location.value) / 100}
              fillColor="#3B82F6"
              color="#2563EB"
              weight={2}
              opacity={0.8}
              fillOpacity={0.4}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{location.name}</h3>
                  <p>Value: ${location.value.toLocaleString()}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}