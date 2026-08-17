import { DollarSign, Gauge, MapPin, Route } from "lucide-react";

import { MetricCard } from "../components/MetricCard";

import type { OptimizeFuelRouteResponse } from "../../types/routeOptimizer.types";

interface MetricsSectionProps {
  routeResult: OptimizeFuelRouteResponse | null;
}

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

export function MetricsSection({ routeResult }: MetricsSectionProps) {
  return (
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
        value={routeResult ? String(routeResult.optimal_fuel_stops_count) : "—"}
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
  );
}