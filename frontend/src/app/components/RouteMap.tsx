import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function makePinIcon(color: string) {
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(
        `<svg width="32" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24c0-8.8-7.2-16-16-16z" fill="${color}"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`
      ),
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

const startIcon = makePinIcon("#2563eb");
const endIcon = makePinIcon("#dc2626");
const fuelIcon = makePinIcon("#16a34a");

interface RouteMapProps {
  startLocation: [number, number];
  endLocation: [number, number];
  fuelStops: Array<{
    name: string;
    location: string;
    position: [number, number];
  }>;
  routePath: Array<[number, number]>;
}

export function RouteMap({
  startLocation,
  endLocation,
  fuelStops,
  routePath,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: false }).setView(
      startLocation,
      6
    );

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    const validRoutePath =
      routePath.length > 0 ? routePath : [startLocation, endLocation];

    L.polyline(validRoutePath, {
      color: "#2563eb",
      weight: 4,
      opacity: 0.75,
    }).addTo(routeLayerRef.current);

    L.marker(startLocation, { icon: startIcon })
      .addTo(routeLayerRef.current)
      .bindPopup("<div class='font-medium'>Start</div>");

    L.marker(endLocation, { icon: endIcon })
      .addTo(routeLayerRef.current)
      .bindPopup("<div class='font-medium'>End</div>");

    fuelStops.forEach((stop) => {
      L.marker(stop.position, { icon: fuelIcon })
        .addTo(routeLayerRef.current!)
        .bindPopup(
          `<div><div class='font-semibold'>${stop.name}</div><div class='text-sm text-gray-600'>${stop.location}</div></div>`
        );
    });

    const bounds = L.latLngBounds(validRoutePath);

    fuelStops.forEach((stop) => {
      bounds.extend(stop.position);
    });

    mapRef.current.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 7,
    });
  }, [startLocation, endLocation, fuelStops, routePath]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1 bg-white rounded-lg shadow-md">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="px-3 py-2 hover:bg-gray-100 transition-colors text-lg font-semibold border-b border-gray-200"
        >
          +
        </button>

        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="px-3 py-2 hover:bg-gray-100 transition-colors text-lg font-semibold"
        >
          −
        </button>
      </div>

      <div className="absolute bottom-2 right-2 z-[1000] bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
        Leaflet | OpenStreetMap
      </div>
    </div>
  );
}