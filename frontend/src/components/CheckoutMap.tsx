/**
 * CheckoutMap — lazy-loaded Leaflet map for the checkout delivery pin.
 * Imported via React.lazy() in Checkout.tsx so a Leaflet crash
 * cannot blank the entire checkout page.
 */
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ── Custom gold/orange pin icon ───────────────────────────────────────────────
const PinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;
    background:linear-gradient(135deg,#c9a84c,#fc8019);
    transform:rotate(-45deg);
    border:3px solid #fff;
    box-shadow:0 4px 12px rgba(0,0,0,0.5);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
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
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    if (data.display_name) setAddress(data.display_name);
  } catch {
    setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  }
}

// ── Draggable + clickable pin ─────────────────────────────────────────────────
function DraggablePin({
  position,
  setPosition,
  setAddress,
}: {
  position: [number, number];
  setPosition: (p: [number, number]) => void;
  setAddress: (a: string) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng, setAddress);
    },
  });

  return (
    <Marker
      position={position}
      icon={PinIcon}
      draggable
      ref={markerRef}
      eventHandlers={{
        dragend() {
          const m = markerRef.current;
          if (m) {
            const { lat, lng } = m.getLatLng();
            setPosition([lat, lng]);
            reverseGeocode(lat, lng, setAddress);
          }
        },
      }}
    />
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface CheckoutMapProps {
  coords: [number, number];
  setCoords: (p: [number, number]) => void;
  setAddress: (a: string) => void;
}

export default function CheckoutMap({ coords, setCoords, setAddress }: CheckoutMapProps) {
  return (
    <MapContainer
      key={`map-${coords[0].toFixed(3)}-${coords[1].toFixed(3)}`}
      center={coords}
      zoom={15}
      style={{ height: "100%", width: "100%", background: "#1a1a1a" }}
      scrollWheelZoom={false}
      ref={(mapInstance: any) => {
        if (mapInstance) {
          setTimeout(() => mapInstance.invalidateSize(), 150);
        }
      }}
    >
      <FlyTo coords={coords} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        maxZoom={19}
      />
      <DraggablePin
        position={coords}
        setPosition={setCoords}
        setAddress={setAddress}
      />
    </MapContainer>
  );
}
