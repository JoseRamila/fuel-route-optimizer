from rest_framework import serializers


class OptimizeFuelRouteRequestSerializer(serializers.Serializer):
    start = serializers.CharField(max_length=255)
    finish = serializers.CharField(max_length=255)