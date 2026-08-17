from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from routes.serializers import OptimizeFuelRouteRequestSerializer
from routes.services.fuel_optimizer import (
    REFUEL_SEARCH_START_MILES,
    calculate_fuel_costs,
    get_fuel_stops_near_route,
    select_optimal_fuel_stops,
)
from routes.services.routing_client import RoutingServiceError, get_route


class OptimizeFuelRouteView(APIView):
    def post(self, request):
        serializer = OptimizeFuelRouteRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        start = serializer.validated_data["start"]
        finish = serializer.validated_data["finish"]
        vehicle_range_miles = serializer.validated_data["vehicle_range_miles"]
        fuel_efficiency_mpg = serializer.validated_data["fuel_efficiency_mpg"]

        try:
            route_data = get_route(start=start, finish=finish)
        except RoutingServiceError as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        route_feature = route_data["features"][0]
        summary = route_feature["properties"]["summary"]
        geometry = route_feature["geometry"]

        nearby_fuel_stops = get_fuel_stops_near_route(
            route_coordinates=geometry["coordinates"],
            max_distance_from_route_miles=25,
        )

        optimization_result = select_optimal_fuel_stops(
            nearby_fuel_stops=nearby_fuel_stops,
            total_distance_miles=summary["distance"],
            vehicle_range_miles=vehicle_range_miles,
        )

        optimal_fuel_stops = optimization_result["selected_stops"]

        fuel_cost_data = calculate_fuel_costs(
            selected_fuel_stops=optimal_fuel_stops,
            total_distance_miles=summary["distance"],
            fuel_efficiency_mpg=fuel_efficiency_mpg,
        )

        return Response(
            {
                "message": "Fuel route optimized successfully.",
                "start": start,
                "finish": finish,
                "distance_miles": round(summary["distance"], 2),
                "vehicle_range_miles": vehicle_range_miles,
                "fuel_efficiency_mpg": fuel_efficiency_mpg,
                "estimated_gallons_needed": fuel_cost_data[
                    "estimated_gallons_needed"
                ],
                "total_fuel_cost": fuel_cost_data["total_fuel_cost"],
                "route_coordinate_count": len(geometry["coordinates"]),
                "nearby_fuel_stops_count": len(nearby_fuel_stops),
                "optimal_fuel_stops_count": len(fuel_cost_data["fuel_stops"]),
                "fuel_stops": fuel_cost_data["fuel_stops"],
                "final_segment": fuel_cost_data["final_segment"],
                "route_geojson": geometry,
                "warnings": optimization_result["warnings"],
                "assumptions": {
                    "fuel_prices_source": "Static CSV dataset",
                    "fuel_stop_coordinates": "Approximated using city/state coordinates",
                    "optimization_strategy": "Greedy selection of lowest-price reachable stop",
                    "refuel_search_window_miles": (
                        f"{REFUEL_SEARCH_START_MILES}-{vehicle_range_miles}"
                    ),
                    "route_provider": "OpenRouteService",
                    "route_units": "miles",
                },
            }
        )