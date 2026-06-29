import csv
from pathlib import Path
from typing import Any

from routes.services.geo_utils import get_city_coordinates


BASE_DIR = Path(__file__).resolve().parent.parent.parent
FUEL_PRICES_FILE = BASE_DIR / "data" / "fuel-prices-for-be-assessment.csv"


def load_fuel_prices(limit: int | None = None) -> list[dict[str, Any]]:
    fuel_stops = []

    with FUEL_PRICES_FILE.open(mode="r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)

        for row in reader:
            city = row.get("City", "").strip()
            state = row.get("State", "").strip()
            coordinates = get_city_coordinates(city, state)

            if not coordinates:
                continue

            fuel_stops.append(
                {
                    "opis_truckstop_id": row.get("OPIS Truckstop ID"),
                    "truckstop_name": row.get("Truckstop Name"),
                    "address": row.get("Address"),
                    "city": city,
                    "state": state,
                    "rack_id": row.get("Rack ID"),
                    "retail_price": float(row.get("Retail Price")),
                    "latitude": coordinates["latitude"],
                    "longitude": coordinates["longitude"],
                }
            )

            if limit and len(fuel_stops) >= limit:
                break

    return fuel_stops