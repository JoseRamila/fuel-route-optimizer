import geonamescache


gc = geonamescache.GeonamesCache()


US_STATE_NAMES_BY_CODE = {
    state_data["code"]: state_data["name"]
    for state_data in gc.get_us_states().values()
}


def get_city_coordinates(city: str, state_code: str) -> dict | None:
    cities = gc.get_cities_by_name(city)

    if not cities:
        return None

    expected_state_name = US_STATE_NAMES_BY_CODE.get(state_code.upper())

    for city_match in cities:
        for city_data in city_match.values():
            if city_data.get("countrycode") != "US":
                continue

            if city_data.get("admin1code") == state_code.upper():
                return {
                    "latitude": float(city_data["latitude"]),
                    "longitude": float(city_data["longitude"]),
                }

            if expected_state_name and city_data.get("admin1code") == expected_state_name:
                return {
                    "latitude": float(city_data["latitude"]),
                    "longitude": float(city_data["longitude"]),
                }

    return None