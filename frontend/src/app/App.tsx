import { useState } from 'react';
import { Fuel, ArrowLeftRight, Route, DollarSign, Gauge, MapPin, HelpCircle, Settings, Target } from 'lucide-react';
import { RouteMap } from './components/RouteMap';
import { MetricCard } from './components/MetricCard';
import { FuelStopCard } from './components/FuelStopCard';

export default function App() {
  const [startLocation, setStartLocation] = useState('Chicago, IL');
  const [finishLocation, setFinishLocation] = useState('Houston, TX');

  // Mock data for the route
  const chicagoCoords: [number, number] = [41.8781, -87.6298];
  const houstonCoords: [number, number] = [29.7604, -95.3698];
  
  const fuelStops = [
    {
      name: 'RHODES CONVENIENCE STORES',
      location: 'Sikeston, MO',
      position: [36.8769, -89.5878] as [number, number],
      mile: 393.28,
      price: 3.35,
      estimatedCost: 131.78,
    },
    {
      name: 'CEFCO #1117',
      location: 'Marshall, TX',
      position: [32.5448, -94.3674] as [number, number],
      mile: 865.09,
      price: 2.83,
      estimatedCost: 133.63,
    },
  ];

  // Simplified route path (in reality this would come from a routing API)
  const routePath: Array<[number, number]> = [
    chicagoCoords,
    [40.5, -88.5],
    [39.0, -89.5],
    [37.5, -89.8],
    [36.8769, -89.5878], // Sikeston, MO
    [35.5, -90.5],
    [34.0, -91.5],
    [33.0, -93.0],
    [32.5448, -94.3674], // Marshall, TX
    [31.5, -94.8],
    [30.5, -95.2],
    houstonCoords,
  ];

  const swapLocations = () => {
    setStartLocation(finishLocation);
    setFinishLocation(startLocation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-green-500 p-3 rounded-xl">
                <Fuel className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fuel Route Optimizer</h1>
                <p className="text-sm text-gray-600">Route-based fuel stop optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Help</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Search Panel */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start location
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <button
              onClick={swapLocations}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors mb-0.5"
              title="Swap locations"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finish location
              </label>
              <input
                type="text"
                value={finishLocation}
                onChange={(e) => setFinishLocation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
              Calculate Route
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Route}
            label="Distance"
            value="1080.9 mi"
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
          />
          <MetricCard
            icon={DollarSign}
            label="Total fuel cost"
            value="$326.53"
            iconColor="text-green-600"
            iconBgColor="bg-green-50"
          />
          <MetricCard
            icon={MapPin}
            label="Fuel stops"
            value="2"
            iconColor="text-purple-600"
            iconBgColor="bg-purple-50"
          />
          <MetricCard
            icon={Gauge}
            label="Estimated gallons"
            value="108.09"
            iconColor="text-orange-600"
            iconBgColor="bg-orange-50"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-[1fr,400px] gap-6">
          {/* Left Column - Map */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-[600px]">
            <RouteMap
              startLocation={chicagoCoords}
              endLocation={houstonCoords}
              fuelStops={fuelStops}
              routePath={routePath}
            />
          </div>

          {/* Right Column - Fuel Stops */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-green-600" />
              Recommended Fuel Stops
            </h2>
            
            <div className="space-y-4">
              {fuelStops.map((stop, index) => (
                <FuelStopCard
                  key={index}
                  number={index + 1}
                  name={stop.name}
                  location={stop.location}
                  mile={stop.mile}
                  price={stop.price}
                  estimatedCost={stop.estimatedCost}
                />
              ))}
              
              {/* Final Segment Card */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Final segment</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>Houston, TX</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Distance: </span>
                      <span className="font-medium text-gray-900">215.81 mi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
