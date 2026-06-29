from math import asin, cos, radians, sin, sqrt


def calculate_distance_miles(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """
    Calculates the distance between two coordinates using the Haversine formula.
    Returns distance in miles.
    """
    earth_radius_miles = 3958.8

    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    lat_distance = lat2_rad - lat1_rad
    lon_distance = lon2_rad - lon1_rad

    a = (
        sin(lat_distance / 2) ** 2
        + cos(lat1_rad) * cos(lat2_rad) * sin(lon_distance / 2) ** 2
    )

    c = 2 * asin(sqrt(a))

    return earth_radius_miles * c


def find_nearest_route_point(
    fuel_stop: dict,
    route_coordinates: list[list[float]],
    step: int = 25,
) -> dict:
    """
    Finds the closest route coordinate to a fuel stop.

    OpenRouteService returns coordinates as [longitude, latitude].
    The step parameter keeps the calculation fast by checking every Nth point.
    """
    nearest_point = None
    nearest_distance = float("inf")
    nearest_index = 0

    sampled_coordinates = route_coordinates[::step]

    for index, coordinate in enumerate(sampled_coordinates):
        route_lon = coordinate[0]
        route_lat = coordinate[1]

        distance = calculate_distance_miles(
            fuel_stop["latitude"],
            fuel_stop["longitude"],
            route_lat,
            route_lon,
        )

        if distance < nearest_distance:
            nearest_distance = distance
            nearest_point = coordinate
            nearest_index = index * step

    return {
        "nearest_route_point": nearest_point,
        "distance_from_route_miles": nearest_distance,
        "nearest_route_index": nearest_index,
    }

def calculate_route_distance_until_index(
    route_coordinates: list[list[float]],
    target_index: int,
) -> float:
    """
    Calculates the approximate traveled distance from the route start
    to a specific coordinate index.
    """
    if target_index <= 0:
        return 0.0

    total_distance = 0.0
    safe_target_index = min(target_index, len(route_coordinates) - 1)

    for index in range(1, safe_target_index + 1):
        previous_lon, previous_lat = route_coordinates[index - 1]
        current_lon, current_lat = route_coordinates[index]

        total_distance += calculate_distance_miles(
            previous_lat,
            previous_lon,
            current_lat,
            current_lon,
        )

    return total_distance