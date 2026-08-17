import { DollarSign, Fuel, MapPin, Route } from "lucide-react";

interface FuelStopCardProps {
  number: number;
  name: string;
  location: string;
  mile: number;
  price: number;
  estimatedCost: number;
  segmentMiles?: number;
  gallonsPurchased?: number;
}

function formatMiles(value?: number) {
  if (value === undefined || value === null) return "—";
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} mi`;
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return "—";
  return `$${value.toFixed(2)}`;
}

function formatGallons(value?: number) {
  if (value === undefined || value === null) return "—";
  return `${value.toFixed(2)} gal`;
}

export function FuelStopCard({
  number,
  name,
  location,
  mile,
  price,
  estimatedCost,
  segmentMiles,
  gallonsPurchased,
}: FuelStopCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
          {number}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 truncate">{name}</h4>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <MetricItem icon={Route} label="Route mile" value={formatMiles(mile)} />

            <MetricItem
              icon={DollarSign}
              label="Price"
              value={`${formatCurrency(price)}/gal`}
            />

            <MetricItem
              icon={Fuel}
              label="Gallons"
              value={formatGallons(gallonsPurchased)}
            />

            <MetricItem
              icon={DollarSign}
              label="Est. cost"
              value={formatCurrency(estimatedCost)}
              valueClassName="text-green-600"
            />
          </div>

          {segmentMiles !== undefined && (
            <div className="mt-3 rounded-md bg-gray-50 border border-gray-100 px-3 py-2 text-xs text-gray-600">
              Segment distance:{" "}
              <span className="font-medium text-gray-900">
                {formatMiles(segmentMiles)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
}

function MetricItem({
  icon: Icon,
  label,
  value,
  valueClassName = "text-gray-900",
}: MetricItemProps) {
  return (
    <div>
      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>

      <div className={`font-medium ${valueClassName}`}>{value}</div>
    </div>
  );
}