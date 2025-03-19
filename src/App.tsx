import MapComponent from './components/MapComponent'
import MapSidebar from './components/MapSidebar'
import { useMapStore } from './stores/mapStore'

function App() {
  const { selectAirport } = useMapStore()

  const handleLocationSelect = (location: [number, number], airportCode?: string) => {
    if (airportCode) {
      selectAirport(airportCode)
    }
  }

  return (
    <div className="flex h-screen">
      <MapSidebar
        onLocationSelect={handleLocationSelect}
      />
      <div className="flex-1">
        <MapComponent />
      </div>
    </div>
  )
}

export default App
