import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Icons
const RestaurantIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const UserIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const DeliveryIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    lat: number;
    lng: number;
    name?: string;
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  popupText?: string;
  height?: string;
  width?: string;
  trackOrder?: {
      restaurant: Location;
      user: Location;
      delivery?: Location;
  };
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to fetch and display route
function RoutingMachine({ start, end }: { start: Location, end: Location }) {
    const [routePath, setRoutePath] = useState<[number, number][]>([]);

    useEffect(() => {
        if (!start || !end) return;

        const fetchRoute = async () => {
            try {
                const response = await fetch(
                    `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    const coordinates = data.routes[0].geometry.coordinates;
                    // OSRM returns [lng, lat], Leaflet needs [lat, lng]
                    const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
                    setRoutePath(latLngs);
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        };

        fetchRoute();
    }, [start, end]);

    return routePath.length > 0 ? <Polyline positions={routePath} color="blue" weight={4} opacity={0.7} /> : null;
}

// ... (imports remain same)

// Check if a location has valid coordinates
const isValidLoc = (loc: any) => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number';

export default function MapView({ 
  center = [11.1271, 78.6569], // Tamil Nadu
  zoom = 7, 
  popupText = "Location",
  height = "400px",
  width = "100%",
  trackOrder
}: MapViewProps) {
  
  // Robust center calculation
  let mapCenter: [number, number] = center;
  
  if (trackOrder) {
      if (isValidLoc(trackOrder.delivery)) {
          mapCenter = [trackOrder.delivery!.lat, trackOrder.delivery!.lng];
      } else if (isValidLoc(trackOrder.restaurant)) {
          mapCenter = [trackOrder.restaurant.lat, trackOrder.restaurant.lng];
      } else if (isValidLoc(trackOrder.user)) {
          mapCenter = [trackOrder.user.lat, trackOrder.user.lng];
      }
  }

  return (
    <div style={{ height, width, overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={zoom} />
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Basic Single Marker Mode */}
        {!trackOrder && (
            <Marker position={center}>
                <Popup>{popupText}</Popup>
            </Marker>
        )}

        {/* Order Tracking Mode */}
        {trackOrder && (
            <>
                {/* Restaurant Marker */}
                {isValidLoc(trackOrder.restaurant) && (
                    <Marker position={[trackOrder.restaurant.lat, trackOrder.restaurant.lng]} icon={RestaurantIcon}>
                        <Popup className="font-bold">🏠 {trackOrder.restaurant.name || "Restaurant"}</Popup>
                    </Marker>
                )}

                {/* User Marker */}
                {isValidLoc(trackOrder.user) && (
                    <Marker position={[trackOrder.user.lat, trackOrder.user.lng]} icon={UserIcon}>
                        <Popup className="font-bold">📍 {trackOrder.user.name || "You"}</Popup>
                    </Marker>
                )}

                {/* Delivery Partner Marker */}
                {isValidLoc(trackOrder.delivery) && (
                    <Marker position={[trackOrder.delivery!.lat, trackOrder.delivery!.lng]} icon={DeliveryIcon}>
                        <Popup className="font-bold">🚴 Delivery Partner</Popup>
                    </Marker>
                )}

                {/* Route from Restaurant to User */}
                {isValidLoc(trackOrder.restaurant) && isValidLoc(trackOrder.user) && (
                    <RoutingMachine start={trackOrder.restaurant} end={trackOrder.user} />
                )}
            </>
        )}
      </MapContainer>
    </div>
  );
}
