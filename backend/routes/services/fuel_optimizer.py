from routes.services.distance_utils import (
    calculate_route_distance_until_index,
    find_nearest_route_point,
)
from routes.services.fuel_data import load_fuel_prices


VEHICLE_RANGE_MILES = 500
FUEL_EFFICIENCY_MPG = 10
REFUEL_SEARCH_START_MILES = 350


def get_fuel_stops_near_route(
    route_coordinates: list[list[float]],
    max_distance_from_route_miles: float = 25,
) -> list[dict]:
    """
    Loads fuel stops, enriches them with route proximity data,
    and keeps only stops close enough to the route.
    """
    fuel_stops = load_fuel_prices()

    nearby_fuel_stops = []

    for fuel_stop in fuel_stops:
        nearest_route_data = find_nearest_route_point(
            fuel_stop=fuel_stop,
            route_coordinates=route_coordinates,
        )

        distance_from_route = nearest_route_data["distance_from_route_miles"]

        if distance_from_route > max_distance_from_route_miles:
            continue

        distance_along_route = calculate_route_distance_until_index(
            route_coordinates=route_coordinates,
            target_index=nearest_route_data["nearest_route_index"],
        )

        nearby_fuel_stops.append(
            {
                **fuel_stop,
                "distance_from_route_miles": round(distance_from_route, 2),
                "distance_along_route_miles": round(distance_along_route, 2),
                "nearest_route_index": nearest_route_data["nearest_route_index"],
            }
        )

    nearby_fuel_stops.sort(key=lambda stop: stop["distance_along_route_miles"])

    return nearby_fuel_stops


def select_optimal_fuel_stops(
    nearby_fuel_stops: list[dict],
    total_distance_miles: float,
    vehicle_range_miles: float = VEHICLE_RANGE_MILES,
    refuel_search_start_miles: float = REFUEL_SEARCH_START_MILES,
) -> dict:
    """
    Selects cost-effective fuel stops along the route.

    The algorithm uses a greedy strategy:
    - The vehicle can travel up to vehicle_range_miles.
    - For each segment, it searches for fuel stops between
      refuel_search_start_miles and vehicle_range_miles from the last refuel point.
    - It selects the cheapest fuel stop within that reachable window.
    """
    selected_stops = []
    warnings = []
    current_position_miles = 0.0

    while total_distance_miles - current_position_miles > vehicle_range_miles:
        min_reachable_mile = current_position_miles + refuel_search_start_miles
        max_reachable_mile = current_position_miles + vehicle_range_miles

        candidate_stops = [
            stop
            for stop in nearby_fuel_stops
            if min_reachable_mile
            <= stop["distance_along_route_miles"]
            <= max_reachable_mile
        ]

        if not candidate_stops:
            candidate_stops = [
                stop
                for stop in nearby_fuel_stops
                if current_position_miles
                < stop["distance_along_route_miles"]
                <= max_reachable_mile
            ]

        if not candidate_stops:
            warnings.append(
                "No reachable fuel stop found between "
                f"mile {round(current_position_miles, 2)} and "
                f"mile {round(max_reachable_mile, 2)}."
            )
            break

        best_stop = min(candidate_stops, key=lambda stop: stop["retail_price"])

        selected_stops.append(best_stop)
        current_position_miles = best_stop["distance_along_route_miles"]

    return {
        "selected_stops": selected_stops,
        "warnings": warnings,
    }


def calculate_fuel_costs(
    selected_fuel_stops: list[dict],
    total_distance_miles: float,
    fuel_efficiency_mpg: float = FUEL_EFFICIENCY_MPG,
) -> dict:
    """
    Calculates gallons and estimated fuel cost for each route segment.

    Assumptions:
    - Vehicle fuel efficiency is fuel_efficiency_mpg.
    - The vehicle starts with enough fuel to reach the first selected stop.
    - Each selected stop price is used as the reference price for its segment.
    """
    estimated_gallons_needed = total_distance_miles / fuel_efficiency_mpg

    if not selected_fuel_stops:
        return {
            "estimated_gallons_needed": round(estimated_gallons_needed, 2),
            "total_fuel_cost": 0.0,
            "fuel_stops": [],
            "final_segment": {
                "segment_miles": round(total_distance_miles, 2),
                "gallons_needed": round(estimated_gallons_needed, 2),
                "price_per_gallon_used": None,
                "estimated_cost": 0.0,
                "note": "No fuel stop required within the vehicle range.",
            },
        }

    fuel_stops_with_costs = []
    total_cost = 0.0
    previous_position_miles = 0.0

    for fuel_stop in selected_fuel_stops:
        segment_miles = fuel_stop["distance_along_route_miles"] - previous_position_miles
        gallons_purchased = segment_miles / fuel_efficiency_mpg
        estimated_cost = gallons_purchased * fuel_stop["retail_price"]

        fuel_stops_with_costs.append(
            {
                **fuel_stop,
                "segment_miles": round(segment_miles, 2),
                "gallons_purchased": round(gallons_purchased, 2),
                "estimated_cost": round(estimated_cost, 2),
            }
        )

        total_cost += estimated_cost
        previous_position_miles = fuel_stop["distance_along_route_miles"]

    last_stop = selected_fuel_stops[-1]
    final_segment_miles = total_distance_miles - previous_position_miles
    final_segment_gallons = final_segment_miles / fuel_efficiency_mpg
    final_segment_cost = final_segment_gallons * last_stop["retail_price"]

    total_cost += final_segment_cost

    return {
        "estimated_gallons_needed": round(estimated_gallons_needed, 2),
        "total_fuel_cost": round(total_cost, 2),
        "fuel_stops": fuel_stops_with_costs,
        "final_segment": {
            "segment_miles": round(final_segment_miles, 2),
            "gallons_needed": round(final_segment_gallons, 2),
            "price_per_gallon_used": round(last_stop["retail_price"], 3),
            "estimated_cost": round(final_segment_cost, 2),
        },
    }