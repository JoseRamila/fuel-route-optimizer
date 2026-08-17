import { AlertTriangle, Info } from "lucide-react";

import type { OptimizeFuelRouteResponse } from "../../types/routeOptimizer.types";

interface OptimizationDetailsSectionProps {
  routeResult: OptimizeFuelRouteResponse | null;
}

export function OptimizationDetailsSection({
  routeResult,
}: OptimizationDetailsSectionProps) {
  if (!routeResult) {
    return null;
  }

  const assumptions = routeResult.assumptions;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Optimization Details
        </h2>
      </div>

      {routeResult.warnings.length > 0 && (
        <div className="mb-5 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />

            <div>
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                Optimization warnings
              </h3>

              <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
                {routeResult.warnings.map((warning, index) => (
                  <li key={`${warning}-${index}`}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <DetailItem
          label="Strategy"
          value={assumptions.optimization_strategy}
        />

        <DetailItem
          label="Refuel window"
          value={`${assumptions.refuel_search_window_miles} miles`}
        />

        <DetailItem
          label="Route provider"
          value={assumptions.route_provider}
        />

        <DetailItem
          label="Route units"
          value={assumptions.route_units}
        />

        <DetailItem
          label="Fuel prices"
          value={assumptions.fuel_prices_source}
        />

        <DetailItem
          label="Fuel stop coordinates"
          value={assumptions.fuel_stop_coordinates}
        />
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}