import { useMapStore } from '../stores/mapStore';
import { airports } from '../config/airports';

interface MapSidebarProps {
  onLocationSelect: (location: [number, number], airportCode?: string) => void;
}

const MapSidebar = ({ onLocationSelect }: MapSidebarProps) => {
  const { selectedAirport, layerVisibility, toggleLayer } = useMapStore();

  return (
    <div className="w-64 bg-white/90 backdrop-blur-sm shadow-xl p-6 overflow-y-auto border-r border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">机场列表</h2>
      <div className="space-y-2">
        {airports.map((airport) => (
          <button
            key={airport.code}
            onClick={() => onLocationSelect(airport.location, airport.code)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              selectedAirport?.code === airport.code
                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
            }`}
          >
            {airport.name} ({airport.code})
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 border-b border-gray-200 pb-3">图层控制</h2>
      <div className="space-y-3">
        {Object.entries(layerVisibility).map(([layerId, visible]) => (
          <label key={layerId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <input
              type="checkbox"
              checked={visible as boolean}
              onChange={(e) => toggleLayer(layerId as keyof typeof layerVisibility, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-2"
            />
            <span className="text-gray-700 font-medium">
              {layerId === 'geofence' && '地理围栏'}
              {layerId === 'parking' && '停机位'}
              {layerId === 'runway' && '跑道'}
              {layerId === 'taxiway' && '滑行道'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MapSidebar; 