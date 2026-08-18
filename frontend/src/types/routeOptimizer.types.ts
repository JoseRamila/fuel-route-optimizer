export interface OptimizeFuelRouteRequest {
  start: string;
  finish: string;
  vehicle_range_miles?: number;
  fuel_efficiency_mpg?: number;
}

export interface RouteGeoJson {
  type: "LineString";
  coordinates: [number, number][];
}

export interface FuelStop {
  opis_truckstop_id?: string;
  truckstop_name: string;
  address?: string;
  city?: string;
  state?: string;
  rack_id?: string;
  retail_price: number;
  latitude?: number;
  longitude?: number;
  distance_along_route_miles: number;
  distance_from_route_miles?: number;
  nearest_route_index?: number;
  segment_miles?: number;
  gallons_purchased?: number;
  gallons_to_buy?: number;
  gallons_used?: number;
  fuel_cost?: number;
  estimated_cost?: number;
}

export interface FinalSegment {
  segment_miles: number;
  gallons_needed: number;
  price_per_gallon_used: number | null;
  estimated_cost: number;
  note?: string;
}

export interface RouteAssumptions {
  fuel_prices_source: string;
  fuel_stop_coordinates: string;
  optimization_strategy: string;
  refuel_search_window_miles: string;
  route_provider: string;
  route_units: string;
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
  warnings: string[];
  assumptions: RouteAssumptions;
}

export interface ApiErrorResponse {
  detail: string;
}