import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { optimizeFuelRoute } from "../../services/routeOptimizerService";

import type { OptimizeFuelRouteResponse } from "../../types/routeOptimizer.types";

export function useRouteOptimization() {
  const [startLocation, setStartLocation] = useState("Chicago, IL");
  const [finishLocation, setFinishLocation] = useState("Houston, TX");
  const [vehicleRangeMiles, setVehicleRangeMiles] = useState(500);
  const [fuelEfficiencyMpg, setFuelEfficiencyMpg] = useState(10);
  const [routeResult, setRouteResult] =
    useState<OptimizeFuelRouteResponse | null>(null);

  const optimizeRouteMutation = useMutation({
    mutationFn: optimizeFuelRoute,
  });

  const swapLocations = () => {
    setStartLocation(finishLocation);
    setFinishLocation(startLocation);
  };

  const calculateRoute = () => {
    optimizeRouteMutation.mutate(
      {
        start: startLocation,
        finish: finishLocation,
        vehicle_range_miles: vehicleRangeMiles,
        fuel_efficiency_mpg: fuelEfficiencyMpg,
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

  return {
    startLocation,
    finishLocation,
    vehicleRangeMiles,
    fuelEfficiencyMpg,
    routeResult,
    isLoading: optimizeRouteMutation.isPending,
    isError: optimizeRouteMutation.isError,
    error: optimizeRouteMutation.error,
    setStartLocation,
    setFinishLocation,
    setVehicleRangeMiles,
    setFuelEfficiencyMpg,
    swapLocations,
    calculateRoute,
  };
}