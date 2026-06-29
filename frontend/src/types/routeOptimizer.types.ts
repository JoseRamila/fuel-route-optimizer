export interface OptimizeFuelRouteRequest {
  start: string;
  finish: string;
}

export interface RouteGeoJson {
  type: string;
  coordinates: [number, number][];
}

export interface FuelStop {
  truckstop_name?: string;
  name?: string;
  city?: string;
  state?: string;
  retail_price?: number;
  distance_along_route_miles?: number;
  distance_from_route_miles?: number;
  gallons_to_buy?: number;
  fuel_cost?: number;
}

export interface FinalSegment {
  distance_miles?: number;
  estimated_gallons_needed?: number;
  estimated_fuel_cost?: number;
}

export interface OptimizeFuelRouteResponse {
  message: string;
  start: string;
  finish: string;
  distance_miles: number;
  vehicle_range_miles: number;
  fuel_efficiency_mpg: number;
  estimated_gallons_needed: number;
  total_fuel_cost: number;
  route_coordinate_count: number;
  nearby_fuel_stops_count: number;
  optimal_fuel_stops_count: number;
  fuel_stops: FuelStop[];
  final_segment: FinalSegment;
  route_geojson: RouteGeoJson;
}

export interface ApiErrorResponse {
  detail: string;
}