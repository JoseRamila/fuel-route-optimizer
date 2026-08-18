from unittest.mock import patch

from django.test import SimpleTestCase
from rest_framework import status
from rest_framework.test import APIClient

from routes.services.routing_client import RoutingServiceError


class RoutesApiTests(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_returns_ok(self):
        response = self.client.get("/api/routes/health/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["service"], "fuel-route-optimizer-api")

    def test_optimize_fuel_route_rejects_empty_payload(self):
        response = self.client.post(
            "/api/routes/optimize-fuel/",
            data={},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("start", response.data)
        self.assertIn("finish", response.data)

    def test_optimize_fuel_route_rejects_same_start_and_finish(self):
        response = self.client.post(
            "/api/routes/optimize-fuel/",
            data={
                "start": "Chicago, IL",
                "finish": "Chicago, IL",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Start and finish locations must be different.", str(response.data))

    @patch("routes.views.get_route")
    def test_optimize_fuel_route_returns_502_when_routing_service_fails(
        self,
        mock_get_route,
    ):
        mock_get_route.side_effect = RoutingServiceError("Routing provider unavailable")

        response = self.client.post(
            "/api/routes/optimize-fuel/",
            data={
                "start": "Chicago, IL",
                "finish": "Houston, TX",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertEqual(response.data["detail"], "Routing provider unavailable")

    @patch("routes.views.calculate_fuel_costs")
    @patch("routes.views.select_optimal_fuel_stops")
    @patch("routes.views.get_fuel_stops_near_route")
    @patch("routes.views.get_route")
    def test_optimize_fuel_route_returns_successful_response(
        self,
        mock_get_route,
        mock_get_fuel_stops_near_route,
        mock_select_optimal_fuel_stops,
        mock_calculate_fuel_costs,
    ):
        mock_get_route.return_value = {
            "features": [
                {
                    "properties": {
                        "summary": {
                            "distance": 1080.9,
                        }
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [-87.6298, 41.8781],
                            [-95.3698, 29.7604],
                        ],
                    },
                }
            ]
        }

        mock_get_fuel_stops_near_route.return_value = [
            {
                "truckstop_name": "Mock Stop",
                "retail_price": 3.00,
                "distance_along_route_miles": 450,
            }
        ]

        mock_select_optimal_fuel_stops.return_value = {
            "selected_stops": [
                {
                    "truckstop_name": "Mock Stop",
                    "retail_price": 3.00,
                    "distance_along_route_miles": 450,
                }
            ],
            "warnings": [],
        }

        mock_calculate_fuel_costs.return_value = {
            "estimated_gallons_needed": 108.09,
            "total_fuel_cost": 326.54,
            "fuel_stops": [
                {
                    "truckstop_name": "Mock Stop",
                    "retail_price": 3.00,
                    "distance_along_route_miles": 450,
                    "segment_miles": 450,
                    "gallons_purchased": 45,
                    "estimated_cost": 135,
                }
            ],
            "final_segment": {
                "segment_miles": 630.9,
                "gallons_needed": 63.09,
                "price_per_gallon_used": 3.0,
                "estimated_cost": 191.54,
            },
        }

        response = self.client.post(
            "/api/routes/optimize-fuel/",
            data={
                "start": "Chicago, IL",
                "finish": "Houston, TX",
                "vehicle_range_miles": 500,
                "fuel_efficiency_mpg": 10,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Fuel route optimized successfully.")
        self.assertEqual(response.data["start"], "Chicago, IL")
        self.assertEqual(response.data["finish"], "Houston, TX")
        self.assertEqual(response.data["distance_miles"], 1080.9)
        self.assertEqual(response.data["vehicle_range_miles"], 500)
        self.assertEqual(response.data["fuel_efficiency_mpg"], 10)
        self.assertEqual(response.data["estimated_gallons_needed"], 108.09)
        self.assertEqual(response.data["total_fuel_cost"], 326.54)
        self.assertEqual(response.data["optimal_fuel_stops_count"], 1)
        self.assertEqual(response.data["warnings"], [])
        self.assertIn("assumptions", response.data)
        self.assertEqual(
            response.data["assumptions"]["optimization_strategy"],
            "Greedy selection of lowest-price reachable stop",
        )

        mock_get_route.assert_called_once_with(
            start="Chicago, IL",
            finish="Houston, TX",
        )

        mock_get_fuel_stops_near_route.assert_called_once()
        mock_select_optimal_fuel_stops.assert_called_once_with(
            nearby_fuel_stops=mock_get_fuel_stops_near_route.return_value,
            total_distance_miles=1080.9,
            vehicle_range_miles=500.0,
        )
        mock_calculate_fuel_costs.assert_called_once_with(
            selected_fuel_stops=mock_select_optimal_fuel_stops.return_value[
                "selected_stops"
            ],
            total_distance_miles=1080.9,
            fuel_efficiency_mpg=10.0,
        )