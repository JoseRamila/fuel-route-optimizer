# Fuel Route Optimizer API

A Django REST API that calculates an optimized fuel plan for a driving route within the USA.

The API receives a start and finish location, retrieves the route using OpenRouteService, finds nearby fuel stops from the provided fuel price dataset, selects cost-effective fuel stops along the route, and calculates the estimated total fuel cost assuming a vehicle fuel efficiency of 10 miles per gallon.

## Features

* Django REST Framework API
* Start and finish location input
* Route calculation using OpenRouteService
* Fuel price loading from the provided CSV file
* Local fuel stop enrichment using city and state coordinates
* Nearby fuel stop filtering
* Greedy fuel stop optimization
* Total fuel cost estimation
* GeoJSON route output

## Tech Stack

* Python
* Django
* Django REST Framework
* OpenRouteService
* geonamescache
* requests
* python-dotenv

## Main Endpoint

```txt
POST /api/routes/optimize-fuel/
```

### Request Body

```json
{
  "start": "Chicago, IL",
  "finish": "Houston, TX"
}
```

### Example Response

```json
{
  "message": "Fuel route optimized successfully.",
  "start": "Chicago, IL",
  "finish": "Houston, TX",
  "distance_miles": 1084.32,
  "vehicle_range_miles": 500,
  "fuel_efficiency_mpg": 10,
  "estimated_gallons_needed": 108.43,
  "total_fuel_cost": 326.53,
  "route_coordinate_count": 1132,
  "nearby_fuel_stops_count": 289,
  "optimal_fuel_stops_count": 2,
  "fuel_stops": [
    {
      "opis_truckstop_id": "123",
      "truckstop_name": "Example Truck Stop",
      "address": "I-40, Exit 123",
      "city": "Example City",
      "state": "MO",
      "rack_id": "456",
      "retail_price": 3.199,
      "latitude": 38.12345,
      "longitude": -92.12345,
      "distance_from_route_miles": 4.32,
      "distance_along_route_miles": 430.25,
      "nearest_route_index": 450,
      "segment_miles": 430.25,
      "gallons_purchased": 43.03,
      "estimated_cost": 137.65
    }
  ],
  "final_segment": {
    "segment_miles": 284.12,
    "gallons_needed": 28.41,
    "price_per_gallon_used": 3.199,
    "estimated_cost": 90.89
  },
  "route_geojson": {
    "type": "LineString",
    "coordinates": []
  }
}
```

## Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd fuel-route-optimizer
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv
```

On Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
OPENROUTESERVICE_API_KEY=your_openrouteservice_api_key
```

You can use `.env.example` as a reference.

### 5. Add the fuel price dataset

Place the provided CSV file inside the `data/` directory:

```txt
data/fuel-prices-for-be-assessment.csv
```

The CSV file should include the following columns:

```txt
OPIS Truckstop ID
Truckstop Name
Address
City
State
Rack ID
Retail Price
```

### 6. Run migrations

```bash
python manage.py migrate
```

### 7. Run the development server

```bash
python manage.py runserver
```

The API will be available at:

```txt
http://127.0.0.1:8000/api/routes/optimize-fuel/
```

## How the Optimization Works

The API uses OpenRouteService to retrieve the driving route between the start and finish locations. This is the only routing API call needed for the request.

After the route is retrieved, the application loads the provided fuel price CSV locally. Since the dataset does not include latitude and longitude, the app enriches fuel stops using city and state coordinates through a local lookup. This avoids calling an external geocoding API for every fuel station and keeps the response faster.

The optimizer then filters fuel stops that are close to the route and calculates their approximate distance along the route.

The vehicle assumptions are:

```txt
Maximum range: 500 miles
Fuel efficiency: 10 miles per gallon
```

The selected approach is a greedy optimization strategy:

1. Start at mile 0.
2. Search for fuel stops between 350 and 500 miles from the current position.
3. Select the cheapest fuel stop in that reachable window.
4. Repeat until the destination can be reached within the remaining 500-mile range.
5. Calculate gallons and estimated fuel cost for each segment.

## Map Output

The API returns the route as GeoJSON:

```json
"route_geojson": {
  "type": "LineString",
  "coordinates": []
}
```

This can be rendered by any frontend map library, such as Leaflet, Mapbox, or OpenLayers.

## Important Implementation Notes

The provided fuel price file does not include exact coordinates for each truck stop. To keep the API fast and avoid excessive calls to external services, the application uses city/state-based coordinate enrichment.

This means fuel stop locations are approximate, but the API still satisfies the core requirement of selecting cost-effective fuel stops along the route using the provided fuel price dataset.

## Error Handling

If the route or geocoding service fails, the API returns a `502 Bad Gateway` response with a descriptive error message.

Example:

```json
{
  "detail": "Routing failed: ..."
}
```

If required input fields are missing, Django REST Framework returns a validation error.

Example:

```json
{
  "start": ["This field is required."],
  "finish": ["This field is required."]
}
```

## Project Structure

```txt
fuel-route-optimizer/
├── config/
│   ├── settings.py
│   └── urls.py
├── data/
│   └── fuel-prices-for-be-assessment.csv
├── routes/
│   ├── services/
│   │   ├── distance_utils.py
│   │   ├── fuel_data.py
│   │   ├── fuel_optimizer.py
│   │   ├── geo_utils.py
│   │   └── routing_client.py
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_fuel_optimizer.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
├── .dockerignore
├── .env.example
├── .gitignore
├── manage.py
├── README.md
└── requirements.txt
```

## API Testing

You can test the endpoint using Postman, Insomnia, curl, or the Django REST Framework browsable API.

### curl example for macOS/Linux

```bash
curl -X POST http://127.0.0.1:8000/api/routes/optimize-fuel/ \
  -H "Content-Type: application/json" \
  -d "{\"start\":\"Chicago, IL\",\"finish\":\"Houston, TX\"}"
```

### PowerShell example

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/routes/optimize-fuel/" `
  -H "Content-Type: application/json" `
  -d "{\"start\":\"Chicago, IL\",\"finish\":\"Houston, TX\"}"
```

## Running Tests

To run the automated tests:

```bash
python manage.py test routes
```

The current test suite validates:

* Fuel stop selection for long routes
* Fuel cost calculation
* Short routes that do not require a fuel stop

## Future Improvements

* Add more API endpoint tests with mocked routing responses
* Add route response caching to reduce repeated routing API calls
* Add Docker support
* Improve fuel stop geocoding with preprocessed exact coordinates
* Add a frontend map visualization
* Add pagination or compact response mode for large route GeoJSON output
* Add configurable vehicle range and MPG values
