import { apiClient } from "./apiClient";

import type {
  OptimizeFuelRouteRequest,
  OptimizeFuelRouteResponse,
} from "../types/routeOptimizer.types";

export async function optimizeFuelRouteApi(
  payload: OptimizeFuelRouteRequest
): Promise<OptimizeFuelRouteResponse> {
  const response = await apiClient.post<OptimizeFuelRouteResponse>(
    "/api/routes/optimize-fuel/",
    payload
  );

  return response.data;
}