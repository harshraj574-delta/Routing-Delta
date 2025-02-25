import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import ZoneLayer from '../components/ZoneLayer';
import MapComponent from '../components/MapComponent';
import LoadingOverlay from '../components/LoadingOverlay';
import { loadZoneData } from '../utils/dataLoader';
import 'leaflet/dist/leaflet.css';

function RouteVisualization() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const routeData = location.state?.routes || {};
  const routes = Array.isArray(routeData.routeData) ? routeData.routeData : [];
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [zones, setZones] = useState([]);
  const [highCapacityZones, setHighCapacityZones] = useState(new Set());

  const facility = [28.402910, 76.998015];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const zoneData = await loadZoneData();
        setZones(zoneData.features || []);
        
        // Set initial selected route
        if (routes.length > 0) {
          setSelectedRoute(routes[0]);
        }

        // Identify high capacity zones based on employee count
        const highCapacityZoneSet = new Set();
        routes.forEach(route => {
          if (route.employees && route.employees.length > routeData.averageOccupancy) {
            highCapacityZoneSet.add(route.zone);
          }
        });
        setHighCapacityZones(highCapacityZoneSet);
      } catch (error) {
        console.error('Failed to load zone data:', error);
        setError('Failed to load zone data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [routes, routeData.averageOccupancy]);

  return (
    <div className="route-visualization-page">
      {isLoading && <LoadingOverlay />}
      {error && <div className="error-message">{error}</div>}
      
      <div className="route-visualization-content" style={{ display: 'flex', height: '100vh' }}>
        <div className="left-panel" style={{ width: '300px', overflowY: 'auto' }}>
          <h2>Route Information</h2>
          <div className="route-summary">
            <p>Total Routes: {routeData.totalRoutes || 0}</p>
            <p>Total Employees: {routeData.totalEmployees || 0}</p>
            <p>Average Occupancy: {routeData.averageOccupancy?.toFixed(2) || '0.00'}</p>
            <p>Date: {routeData.date || 'N/A'}</p>
            <p>Shift: {routeData.shift || 'N/A'}</p>
          </div>
          <div className="route-list">
            {Array.isArray(routes) && routes.map((route, index) => (
              <div
                key={route.uniqueKey || `route_${index}`}
                className={`route-item ${selectedRoute === route ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                <h3>Route {index + 1} - {route.zone}</h3>
                <p>Employees: {route.employees?.length || 0}</p>
                {route.employees?.length > routeData.averageOccupancy && (
                  <p className="high-capacity-warning">High Capacity Zone</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="map-container" style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={facility}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ZoneLayer zones={zones} highCapacityZones={highCapacityZones} />
            <MapComponent
              route={selectedRoute}
              facility={facility}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default RouteVisualization;