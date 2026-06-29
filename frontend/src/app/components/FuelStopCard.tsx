import { MapPin, DollarSign } from 'lucide-react';

interface FuelStopCardProps {
  number: number;
  name: string;
  location: string;
  mile: number;
  price: number;
  estimatedCost: number;
}

export function FuelStopCard({ number, name, location, mile, price, estimatedCost }: FuelStopCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
          {number}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-gray-500 text-xs mb-1">Mile</div>
              <div className="font-medium text-gray-900">{mile.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Price</div>
              <div className="font-medium text-gray-900">${price.toFixed(2)}/gal</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Est. Cost</div>
              <div className="font-medium text-green-600 flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" />
                {estimatedCost.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
