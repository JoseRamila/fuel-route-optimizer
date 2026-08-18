from rest_framework import serializers


class OptimizeFuelRouteRequestSerializer(serializers.Serializer):
    start = serializers.CharField(
        max_length=255,
        trim_whitespace=True,
    )
    finish = serializers.CharField(
        max_length=255,
        trim_whitespace=True,
    )
    vehicle_range_miles = serializers.FloatField(
        required=False,
        default=500,
        min_value=1,
    )
    fuel_efficiency_mpg = serializers.FloatField(
        required=False,
        default=10,
        min_value=1,
    )

    def validate(self, data):
        start = data["start"].strip().lower()
        finish = data["finish"].strip().lower()

        if start == finish:
            raise serializers.ValidationError(
                "Start and finish locations must be different."
            )

        return data