import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-red-600 p-2 text-white">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-red-950">
            Unable to calculate route
          </h3>

          <p className="mt-1 text-sm text-red-800">
            Please verify the start and finish locations, then try again. The
            routing provider or backend service may also be temporarily
            unavailable.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <div className="rounded-md border border-red-200 bg-white/70 px-3 py-2 text-xs text-red-700">
              Example format: Chicago, IL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}