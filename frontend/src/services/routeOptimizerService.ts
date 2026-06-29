import { optimizeFuelRouteApi } from "../api/routeOptimizerApi";

import type {
  OptimizeFuelRouteRequest,
  OptimizeFuelRouteResponse,
} from "../types/routeOptimizer.types";

export async function optimizeFuelRoute(
  payload: OptimizeFuelRouteRequest
): Promise<OptimizeFuelRouteResponse> {
  return optimizeFuelRouteApi(payload);
}