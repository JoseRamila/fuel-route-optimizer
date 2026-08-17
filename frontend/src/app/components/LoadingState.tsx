import { Loader2, MapPinned, Route } from "lucide-react";

export function LoadingState() {
  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-blue-600 p-2 text-white">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-blue-950">
            Calculating optimized route...
          </h3>

          <p className="mt-1 text-sm text-blue-800">
            Fetching route data, checking nearby fuel stops, and estimating trip
            fuel cost.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <LoadingStep
              icon={Route}
              title="Route analysis"
              description="Calculating total distance and route geometry."
            />

            <LoadingStep
              icon={MapPinned}
              title="Fuel stop selection"
              description="Finding reachable stops along the route."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoadingStepProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function LoadingStep({ icon: Icon, title, description }: LoadingStepProps) {
  return (
    <div className="rounded-md border border-blue-100 bg-white/70 p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />

        <p className="text-sm font-medium text-blue-950">{title}</p>
      </div>

      <p className="mt-1 text-xs text-blue-700">{description}</p>
    </div>
  );
}