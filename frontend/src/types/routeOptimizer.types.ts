export interface OptimizeFuelRouteRequest {
  start: string;
  finish: string;
}

export interface RouteGeoJson {
  type: "LineString";
  coordinates: [number, number][];
}

export interface FuelStop {
  opis_truckstop_id: string;
  truckstop_name: string;
  address?: string;
  city: string;
  state: string;
  retail_price: number;
  latitude?: number;
  longitude?: number;
  distance_along_route_miles: number;
  distance_from_route_miles: number;
  gallons_to_buy?: number;
  gallons_used?: number;
  fuel_cost?: number;
  estimated_cost?: number;
}

export interface FinalSegment {
  segment_miles: number;
  gallons_needed: number;
  price_per_gallon_used: number;
  estimated_cost: number;
  

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