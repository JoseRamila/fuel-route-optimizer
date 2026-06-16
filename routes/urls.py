from django.urls import path

from routes.views import OptimizeFuelRouteView

urlpatterns = [
    path("optimize-fuel/", OptimizeFuelRouteView.as_view(), name="optimize-fuel"),
]