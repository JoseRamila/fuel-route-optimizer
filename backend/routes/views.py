from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from routes.serializers import OptimizeFuelRouteRequestSerializer
from routes.services.fuel_optimizer import (
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

        optimal_fuel_stops = select_optimal_fuel_stops(
            nearby_fuel_stops=nearby_fuel_stops,
            total_distance_miles=summary["distance"],
        )

        fuel_cost_data = calculate_fuel_costs(
            selected_fuel_stops=optimal_fuel_stops,
            total_distance_miles=summary["distance"],
        )

        return Response(
            {
                "message": "Fuel route optimized successfully.",
                "start": start,
                "finish": finish,
                "distance_miles": round(summary["distance"], 2),
                "vehicle_range_miles": 500,
                "fuel_efficiency_mpg": 10,
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
            }
        )