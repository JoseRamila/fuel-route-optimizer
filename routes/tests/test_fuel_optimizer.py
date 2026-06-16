from django.test import SimpleTestCase

from routes.services.fuel_optimizer import (
    calculate_fuel_costs,
    select_optimal_fuel_stops,
)


class FuelOptimizerTests(SimpleTestCase):
    def test_select_optimal_fuel_stops_for_long_route(self):
        nearby_fuel_stops = [
            {
                "truckstop_name": "Expensive Stop",
                "retail_price": 4.50,
                "distance_along_route_miles": 400,
            },
            {
                "truckstop_name": "Cheap Stop",
                "retail_price": 3.00,
                "distance_along_route_miles": 450,
            },
            {
                "truckstop_name": "Second Stop",
                "retail_price": 3.25,
                "distance_along_route_miles": 850,
            },
        ]

        selected_stops = select_optimal_fuel_stops(
            nearby_fuel_stops=nearby_fuel_stops,
            total_distance_miles=1000,
        )

        self.assertEqual(len(selected_stops), 2)
        self.assertEqual(selected_stops[0]["truckstop_name"], "Cheap Stop")
        self.assertEqual(selected_stops[1]["truckstop_name"], "Second Stop")

    def test_calculate_fuel_costs(self):
        selected_fuel_stops = [
            {
                "truckstop_name": "Cheap Stop",
                "retail_price": 3.00,
                "distance_along_route_miles": 400,
            }
        ]

        result = calculate_fuel_costs(
            selected_fuel_stops=selected_fuel_stops,
            total_distance_miles=700,
        )

        self.assertEqual(result["estimated_gallons_needed"], 70.0)
        self.assertEqual(result["total_fuel_cost"], 210.0)
        self.assertEqual(len(result["fuel_stops"]), 1)
        self.assertEqual(result["final_segment"]["estimated_cost"], 90.0)

    def test_calculate_fuel_costs_without_required_stop(self):
        result = calculate_fuel_costs(
            selected_fuel_stops=[],
            total_distance_miles=250,
        )

        self.assertEqual(result["estimated_gallons_needed"], 25.0)
        self.assertEqual(result["total_fuel_cost"], 0.0)
        self.assertEqual(result["fuel_stops"], [])
        self.assertEqual(
            result["final_segment"]["note"],
            "No fuel stop required within the 500-mile vehicle range.",
        )