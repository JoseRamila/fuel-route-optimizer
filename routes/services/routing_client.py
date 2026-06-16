import requests
from django.conf import settings


OPENROUTESERVICE_BASE_URL = "https://api.openrouteservice.org"


class RoutingServiceError(Exception):
    pass


def get_route(start: str, finish: str) -> dict:
    """
    Gets a driving route from OpenRouteService using text locations.

    The function does two things:
    1. Geocodes the start and finish locations.
    2. Requests a driving route between both coordinates.
    """
    start_coordinates = geocode_location(start)
    finish_coordinates = geocode_location(finish)

    return get_driving_route(start_coordinates, finish_coordinates)


def geocode_location(location: str) -> list[float]:
    url = f"{OPENROUTESERVICE_BASE_URL}/geocode/search"

    params = {
        "api_key": settings.OPENROUTESERVICE_API_KEY,
        "text": location,
        "boundary.country": "USA",
        "size": 1,
    }

    response = requests.get(url, params=params, timeout=15)

    if response.status_code != 200:
        raise RoutingServiceError(f"Geocoding failed: {response.text}")

    data = response.json()
    features = data.get("features", [])

    if not features:
        raise RoutingServiceError(f"No coordinates found for location: {location}")

    return features[0]["geometry"]["coordinates"]


def get_driving_route(
    start_coordinates: list[float],
    finish_coordinates: list[float],
) -> dict:
    url = f"{OPENROUTESERVICE_BASE_URL}/v2/directions/driving-car/geojson"

    headers = {
        "Authorization": settings.OPENROUTESERVICE_API_KEY,
        "Content-Type": "application/json",
    }

    payload = {
        "coordinates": [
            start_coordinates,
            finish_coordinates,
        ],
        "units": "mi",
    }

    response = requests.post(url, json=payload, headers=headers, timeout=30)

    if response.status_code != 200:
        raise RoutingServiceError(f"Routing failed: {response.text}")

    return response.json()