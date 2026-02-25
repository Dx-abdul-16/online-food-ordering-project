import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

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
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
}

function RoutingMachine({ start, end }: { start: Location, end: Location }) {
    const [routePath, setRoutePath] = useState<[number, number][]>([]);

    useEffect(() => {
        if (!start || !end) return;

        const fetchRoute = async () => {
            try {
                const response = await fetch(
                    `https://api.geoapify.com/v1/routing?waypoints=${start.lat},${start.lng}|${end.lat},${end.lng}&mode=drive&apiKey=622381795a5c45e7980ea9cf54170eee`
                );
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    const rawCoords = data.features[0].geometry.coordinates;
                    // MultiLineString comes back as [[[lng, lat], [lng, lat]], [...]]
                    // So we flatten it to simple [[lng, lat], ...]
                    const flatCoords = rawCoords.flat(1);
                    const latLngs = flatCoords.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
                    setRoutePath(latLngs);
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        };

        fetchRoute();
    }, [start, end]);

    return routePath.length > 0 ? <Polyline positions={routePath} color="#c9a84c" weight={4} opacity={0.8} /> : null;
}

const isValidLoc = (loc: any) => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number';

export default function MapView({ 
  center = [11.0168, 76.9558], 
  zoom = 14, 
  popupText = "Location",
  height = "400px",
  width = "100%",
  trackOrder
}: MapViewProps) {
  
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
    <div style={{ height, width, overflow: 'hidden', borderRadius: '1rem', border: '1px solid #2a2a2a' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: '#1a1a1a', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={zoom} />
        <TileLayer
            attribution='&copy; OSM'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {!trackOrder && (
            <Marker position={center}>
                <Popup><span className="text-black font-bold">{popupText}</span></Popup>
            </Marker>
        )}

        {trackOrder && (
            <>
                {isValidLoc(trackOrder.restaurant) && (
                    <Marker position={[trackOrder.restaurant.lat, trackOrder.restaurant.lng]} icon={RestaurantIcon}>
                        <Popup><span className="text-black font-bold">🏠 {trackOrder.restaurant.name || "Restaurant"}</span></Popup>
                    </Marker>
                )}

                {isValidLoc(trackOrder.user) && (
                    <Marker position={[trackOrder.user.lat, trackOrder.user.lng]} icon={UserIcon}>
                        <Popup><span className="text-black font-bold">📍 {trackOrder.user.name || "You"}</span></Popup>
                    </Marker>
                )}

                {isValidLoc(trackOrder.delivery) && (
                    <Marker position={[trackOrder.delivery!.lat, trackOrder.delivery!.lng]} icon={DeliveryIcon}>
                        <Popup><span className="text-black font-bold">🚴 Delivery Partner</span></Popup>
                    </Marker>
                )}

                {isValidLoc(trackOrder.restaurant) && isValidLoc(trackOrder.user) && (
                    <RoutingMachine start={trackOrder.restaurant} end={trackOrder.user} />
                )}
            </>
        )}
      </MapContainer>
    </div>
  );
}
