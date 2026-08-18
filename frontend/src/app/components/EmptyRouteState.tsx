import { Fuel, MapPinned, Route } from "lucide-react";

export function EmptyRouteState() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200">
        <Route className="h-6 w-6 text-gray-500" />
      </div>

      <h3 className="text-base font-semibold text-gray-900">
        No route calculated yet
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        Enter a start and finish location to generate route metrics, fuel stops,
        and estimated trip cost.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 text-left">
        <EmptyStateItem
          icon={MapPinned}
          title="Route metrics"
          description="Distance, route geometry, and travel data."
        />

        <EmptyStateItem
          icon={Fuel}
          title="Fuel stop recommendations"
          description="Suggested stops based on range, MPG, and fuel prices."
        />
      </div>
    </div>
  );
}

interface EmptyStateItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function EmptyStateItem({
  icon: Icon,
  title,
  description,
}: EmptyStateItemProps) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />

        <p className="text-sm font-medium text-gray-900">{title}</p>
      </div>

      <p className="mt-1 text-xs text-gray-600">{description}</p>
    </div>
  );
}