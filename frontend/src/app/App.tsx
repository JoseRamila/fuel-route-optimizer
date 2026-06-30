import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Fuel,
  ArrowLeftRight,
  Route,
  DollarSign,
  Gauge,
  MapPin,
  HelpCircle,
  Settings,
  Target,
} from "lucide-react";

import { RouteMap } from "./components/RouteMap";
import { MetricCard } from "./components/MetricCard";
import { FuelStopCard } from "./components/FuelStopCard";
import { optimizeFuelRoute } from "../services/routeOptimizerService";

import type {
  FuelStop,
  OptimizeFuelRouteResponse,
} from "../types/routeOptimizer.types";

type MapFuelStop = {
  name: string;
  location: string;
  position: [number, number];
  mile: number;
  price: number;
  estimatedCost: number;
};

type ExtendedFuelStop = FuelStop & {
  truckstop_name?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  lon?: number;
};

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return "—";

  return `$${value.toFixed(2)}`;
}

function formatMiles(value?: number) {
  if (value === undefined || value === null) return "—";

  return `${value.toLocaleString()} mi`;
}

function formatNumber(value?: number) {
  if (value === undefined || value === null) return "—";

  return value.toFixed(2);
}

function toLeafletCoordinates(coordinates: [number, number][]): [number, number][] {
  return coordinates.map(([longitude, latitude]) => [latitude, longitude]);
}

function buildMapFuelStops(fuelStops: ExtendedFuelStop[]): MapFuelStop[] {
  return fuelStops
    .map((stop) => {
      const latitude = stop.latitude ?? stop.lat;
      const longitude = stop.longitude ?? stop.lng ?? stop.lon;

      if (latitude === undefined || longitude === undefined) {
        return null;
      }

      return {
        name: stop.truckstop_name ?? "Unknown fuel stop",
        location:
          [stop.city, stop.state].filter(Boolean).join(", ") ||
          stop.address ||
          "Unknown location",
        position: [latitude, longitude] as [number, number],
        mile: stop.distance_along_route_miles ?? 0,
        price: stop.retail_price ?? 0,
        estimatedCost: stop.fuel_cost ?? 0,
        
      };
    })
    .filter((stop): stop is MapFuelStop => stop !== null);
}

export default function App() {
  const [startLocation, setStartLocation] = useState("Chicago, IL");
  const [finishLocation, setFinishLocation] = useState("Houston, TX");
  const [routeResult, setRouteResult] =
    useState<OptimizeFuelRouteResponse | null>(null);

  const optimizeRouteMutation = useMutation({
    mutationFn: optimizeFuelRoute,
  });

  const routePath = routeResult
    ? toLeafletCoordinates(routeResult.route_geojson.coordinates)
    : [];

  const startCoordinates = routePath[0] ?? ([41.8781, -87.6298] as [number, number]);
  const endCoordinates =
    routePath[routePath.length - 1] ?? ([29.7604, -95.3698] as [number, number]);

  const mapFuelStops = routeResult
    ? buildMapFuelStops(routeResult.fuel_stops as ExtendedFuelStop[])
    : [];

  const swapLocations = () => {
    setStartLocation(finishLocation);
    setFinishLocation(startLocation);
  };

  const handleCalculateRoute = () => {
    optimizeRouteMutation.mutate(
      {
        start: startLocation,
        finish: finishLocation,
      },
      {
        onSuccess: (data) => {
          setRouteResult(data);
        },
        onError: (error) => {
          console.error("API error:", error);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-green-500 p-3 rounded-xl">
                <Fuel className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Fuel Route Optimizer
                </h1>
                <p className="text-sm text-gray-600">
                  Route-based fuel stop optimization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Help</span>
              </button>

              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start location
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(event) => setStartLocation(event.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={swapLocations}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors mb-0.5"
              title="Swap locations"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finish location
              </label>
              <input
                type="text"
                value={finishLocation}
                onChange={(event) => setFinishLocation(event.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={handleCalculateRoute}
              disabled={optimizeRouteMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              {optimizeRouteMutation.isPending
                ? "Calculating..."
                : "Calculate Route"}
            </button>
          </div>

          {optimizeRouteMutation.isError && (
            <p className="mt-4 text-sm text-red-600">
              Unable to calculate route. Please verify the locations and try
              again.
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Route}
            label="Distance"
            value={formatMiles(routeResult?.distance_miles)}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
          />

          <MetricCard
            icon={DollarSign}
            label="Total fuel cost"
            value={formatCurrency(routeResult?.total_fuel_cost)}
            iconColor="text-green-600"
            iconBgColor="bg-green-50"
          />

          <MetricCard
            icon={MapPin}
            label="Fuel stops"
            value={
              routeResult ? String(routeResult.optimal_fuel_stops_count) : "—"
            }
            iconColor="text-purple-600"
            iconBgColor="bg-purple-50"
          />

          <MetricCard
            icon={Gauge}
            label="Estimated gallons"
            value={formatNumber(routeResult?.estimated_gallons_needed)}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-50"
          />
        </div>

        <div className="grid grid-cols-[1fr,400px] gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-[600px]">
            <RouteMap
              startLocation={startCoordinates}
              endLocation={endCoordinates}
              fuelStops={mapFuelStops}
              routePath={routePath.length > 0 ? routePath : [startCoordinates, endCoordinates]}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-green-600" />
              Recommended Fuel Stops
            </h2>

            <div className="space-y-4">
              {routeResult ? (
                <>
                  {(routeResult.fuel_stops as ExtendedFuelStop[]).map(
                    (stop, index) => (
                      <FuelStopCard
                        key={`${stop.opis_truckstop_id}-${index}`}
                        number={index + 1}
                        name={stop.truckstop_name}
                        location={
                          [stop.city, stop.state].filter(Boolean).join(", ") ||
                          stop.address ||
                          "Unknown location"
                        }
                        mile={stop.distance_along_route_miles ?? 0}
                        price={stop.retail_price ?? 0}
                        estimatedCost={stop.estimated_cost ?? stop.fuel_cost ?? 0}
                      />
                    )
                  )}

                  <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Final segment
                        </h4>

                        <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{routeResult.finish}</span>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">Distance: </span>
                          <span className="font-medium text-gray-900">
                            {formatMiles(routeResult.final_segment.segment_miles)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                  Calculate a route to see recommended fuel stops.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}