import { Fuel, HelpCircle, MapPin, Settings, Target } from "lucide-react";

import { RouteMap } from "./components/RouteMap";
import { FuelStopCard } from "./components/FuelStopCard";
import { useRouteOptimization } from "./hooks/useRouteOptimization";
import { MetricsSection } from "./sections/MetricsSection";
import { SearchPanel } from "./sections/SearchPanel";

import type { FuelStop } from "../types/routeOptimizer.types";

type MapFuelStop = {
  name: string;
  location: string;
  position: [number, number];
  mile: number;
  price: number;
  estimatedCost: number;
};

function formatMiles(value?: number) {
  if (value === undefined || value === null) return "—";
  return `${value.toLocaleString()} mi`;
}

function toLeafletCoordinates(
  coordinates: [number, number][]
): [number, number][] {
  return coordinates.map(([longitude, latitude]) => [latitude, longitude]);
}

function buildMapFuelStops(fuelStops: FuelStop[]): MapFuelStop[] {
  return fuelStops
    .map((stop) => {
      if (stop.latitude === undefined || stop.longitude === undefined) {
        return null;
      }

      return {
        name: stop.truckstop_name,
        location:
          [stop.city, stop.state].filter(Boolean).join(", ") ||
          stop.address ||
          "Unknown location",
        position: [stop.latitude, stop.longitude],
        mile: stop.distance_along_route_miles,
        price: stop.retail_price,
        estimatedCost: stop.estimated_cost ?? stop.fuel_cost ?? 0,
      };
    })
    .filter((stop): stop is MapFuelStop => stop !== null);
}

export default function App() {
  const {
  startLocation,
  finishLocation,
  vehicleRangeMiles,
  fuelEfficiencyMpg,
  routeResult,
  isLoading,
  isError,
  setStartLocation,
  setFinishLocation,
  setVehicleRangeMiles,
  setFuelEfficiencyMpg,
  swapLocations,
  calculateRoute,
} = useRouteOptimization();

  const routePath = routeResult
    ? toLeafletCoordinates(routeResult.route_geojson.coordinates)
    : [];

  const startCoordinates =
    routePath[0] ?? ([41.8781, -87.6298] as [number, number]);

  const endCoordinates =
    routePath[routePath.length - 1] ?? ([29.7604, -95.3698] as [number, number]);

  const mapFuelStops = routeResult
    ? buildMapFuelStops(routeResult.fuel_stops)
    : [];

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
        <SearchPanel
          startLocation={startLocation}
          finishLocation={finishLocation}
          vehicleRangeMiles={vehicleRangeMiles}
          fuelEfficiencyMpg={fuelEfficiencyMpg}
          isLoading={isLoading}
          onStartLocationChange={setStartLocation}
          onFinishLocationChange={setFinishLocation}
          onVehicleRangeMilesChange={setVehicleRangeMiles}
          onFuelEfficiencyMpgChange={setFuelEfficiencyMpg}
          onSwapLocations={swapLocations}
          onCalculateRoute={calculateRoute}
        />

        {isError && (
          <p className="mb-4 text-sm text-red-600">
            Unable to calculate route. Please verify the locations and try
            again.
          </p>
        )}

        <MetricsSection routeResult={routeResult} />

        <div className="grid grid-cols-[1fr,400px] gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-[600px]">
            <RouteMap
              startLocation={startCoordinates}
              endLocation={endCoordinates}
              fuelStops={mapFuelStops}
              routePath={
                routePath.length > 0
                  ? routePath
                  : [startCoordinates, endCoordinates]
              }
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
                  {routeResult.fuel_stops.map((stop, index) => (
                    <FuelStopCard
                      key={`${stop.opis_truckstop_id}-${index}`}
                      number={index + 1}
                      name={stop.truckstop_name}
                      location={
                        [stop.city, stop.state].filter(Boolean).join(", ") ||
                        stop.address ||
                        "Unknown location"
                      }
                      mile={stop.distance_along_route_miles}
                      price={stop.retail_price}
                      estimatedCost={stop.estimated_cost ?? stop.fuel_cost ?? 0}
                    />
                  ))}

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