import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ── Custom gold/orange pin icon ───────────────────────────────────────────────
const PinIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png', // Fallback standard icon
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// ── Smooth fly-to when coords change ─────────────────────────────────────────
function FlyTo({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.flyTo(coords, 16, { duration: 1.2 }); }, [coords, map]);
  return null;
}

// ── Reverse geocode helper ────────────────────────────────────────────────────
async function reverseGeocode(lat: number, lng: number, setAddress: (a: string) => void) {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=622381795a5c45e7980ea9cf54170eee`
    );
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      setAddress(data.features[0].properties.formatted);
    } else {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  } catch {
    setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  }
}

// ── Map interactive events component ──────────────────────────────────────────
function MapEvents({
  setPosition,
  setAddress,
}: {
  setPosition: (p: [number, number]) => void;
  setAddress: (a: string) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng, setAddress);
    },
  });
  return null;
}

// ── Main export ───────────────────────────────────────────────────────────────
interface CheckoutMapProps {
  coords: [number, number];
  setCoords: (p: [number, number]) => void;
  setAddress: (a: string) => void;
}

export default function CheckoutMap({ coords, setCoords, setAddress }: CheckoutMapProps) {
  const markerRef = useRef<L.Marker>(null);

  const dragHandlers = {
    dragend() {
      const m = markerRef.current;
      if (m) {
        const { lat, lng } = m.getLatLng();
        setCoords([lat, lng]);
        reverseGeocode(lat, lng, setAddress);
      }
    },
  };

  return (
    <MapContainer
      center={coords}
      zoom={15}
      style={{ height: "100%", width: "100%", background: "#1a1a1a" }}
      scrollWheelZoom={false}
    >
      <FlyTo coords={coords} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        maxZoom={19}
      />
      <MapEvents setPosition={setCoords} setAddress={setAddress} />
      <Marker
        position={coords}
        icon={PinIcon}
        draggable={true}
        ref={markerRef}
        eventHandlers={dragHandlers}
      />
    </MapContainer>
  );
}
