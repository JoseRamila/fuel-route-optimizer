import { ArrowLeftRight } from "lucide-react";

interface SearchPanelProps {
  startLocation: string;
  finishLocation: string;
  isLoading: boolean;
  onStartLocationChange: (value: string) => void;
  onFinishLocationChange: (value: string) => void;
  onSwapLocations: () => void;
  onCalculateRoute: () => void;
}

export function SearchPanel({
  startLocation,
  finishLocation,
  isLoading,
  onStartLocationChange,
  onFinishLocationChange,
  onSwapLocations,
  onCalculateRoute,
}: SearchPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start location
          </label>
          <input
            type="text"
            value={startLocation}
            onChange={(event) => onStartLocationChange(event.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={onSwapLocations}
          className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors mb-0.5"
          title="Swap locations"
          type="button"
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
            onChange={(event) => onFinishLocationChange(event.target.value)}
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
    </div>
  );
}