from django.urls import path

from routes.views import HealthCheckView, OptimizeFuelRouteView


urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("optimize-fuel/", OptimizeFuelRouteView.as_view(), name="optimize-fuel"),
]