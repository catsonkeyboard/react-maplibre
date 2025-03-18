import { useState, useRef } from 'react'
import MapComponent from './components/MapComponent'
import MapLayout from './components/MapLayout'
import MapSidebar from './components/MapSidebar'
import maplibregl from 'maplibre-gl'

function App() {
  const [center, setCenter] = useState<[number, number]>([116.3912, 39.9073])
  const [zoom] = useState(12)
  const mapRef = useRef<maplibregl.Map | null>(null)

  const handleLocationSelect = (location: [number, number]) => {
    setCenter(location)
    
    // 如果需要立即移动地图视图
    mapRef.current?.flyTo({
      center: location,
      zoom: 12,
      essential: true
    })
  }

  const handleLayerToggle = (layerId: string, visible: boolean) => {
    console.log(`图层 ${layerId} 设置为 ${visible ? '可见' : '隐藏'}`)
    // 这里可以实现实际的图层控制逻辑
  }

  return (
    <MapLayout
      sidebar={
        <MapSidebar 
          onLocationSelect={handleLocationSelect}
          onLayerToggle={handleLayerToggle}
        />
      }
    >
      <MapComponent 
        initialCenter={center}
        initialZoom={zoom}
      />
    </MapLayout>
  )
}

export default App
