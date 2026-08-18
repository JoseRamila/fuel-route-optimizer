import { ArrowLeftRight } from "lucide-react";

interface SearchPanelProps {
  startLocation: string;
  finishLocation: string;
  vehicleRangeMiles: number;
  fuelEfficiencyMpg: number;
  isLoading: boolean;
  onStartLocationChange: (value: string) => void;
  onFinishLocationChange: (value: string) => void;
  onVehicleRangeMilesChange: (value: number) => void;
  onFuelEfficiencyMpgChange: (value: number) => void;
  onSwapLocations: () => void;
  onCalculateRoute: () => void;
}

export function SearchPanel({
  startLocation,
  finishLocation,
  vehicleRangeMiles,
  fuelEfficiencyMpg,
  isLoading,
  onStartLocationChange,
  onFinishLocationChange,
  onVehicleRangeMilesChange,
  onFuelEfficiencyMpgChange,
  onSwapLocations,
  onCalculateRoute,
}: SearchPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start location
          </label>
          <input
            type="text"
            value={startLocation}
            onChange={(event) => onStartLocationChange(event.target.value)}
            placeholder="Chicago, IL"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={onSwapLocations}
          className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors mb-0.5 disabled:opacity-50"
          title="Swap locations"
          type="button"
          disabled={isLoading}
        >
          <ArrowLeftRight className="w-5 h-5 text-gray-600" />
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Finish location
          </label>
          <input
            type="text"
            value={finishLocation}
            onChange={(event) => onFinishLocationChange(event.target.value)}
            placeholder="Houston, TX"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={onCalculateRoute}
          disabled={isLoading}
          type="button"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          {isLoading ? "Calculating..." : "Calculate Route"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle range
          </label>

          <div className="relative">
            <input
              type="number"
              min={1}
              value={vehicleRangeMiles}
              onChange={(event) =>
                onVehicleRangeMilesChange(Number(event.target.value))
              }
              className="w-full px-4 py-2.5 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              miles
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Maximum distance the vehicle can travel before refueling.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel efficiency
          </label>

          <div className="relative">
            <input
              type="number"
              min={1}
              value={fuelEfficiencyMpg}
              onChange={(event) =>
                onFuelEfficiencyMpgChange(Number(event.target.value))
              }
              className="w-full px-4 py-2.5 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              MPG
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Fuel efficiency used to estimate gallons and trip cost.
          </p>
        </div>
      </div>
    </div>
  );
}