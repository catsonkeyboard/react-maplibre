import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  LayersIcon, 
  MapPinIcon, 
  FileIcon, 
  SettingsIcon 
} from 'lucide-react';

interface MapSidebarProps {
  onLayerToggle?: (layerId: string, visible: boolean) => void;
  onLocationSelect?: (location: [number, number]) => void;
}

const MapSidebar = ({
  onLayerToggle,
  onLocationSelect
}: MapSidebarProps) => {
  const presetLocations = [
    { name: "北京", coordinates: [116.3912, 39.9073] },
    { name: "上海", coordinates: [121.4737, 31.2304] },
    { name: "广州", coordinates: [113.2644, 23.1291] },
    { name: "深圳", coordinates: [114.0579, 22.5431] }
  ];

  const availableLayers = [
    { id: "terrain", name: "地形图", active: true },
    { id: "satellite", name: "卫星图", active: false },
    { id: "traffic", name: "交通图", active: false },
    { id: "buildings", name: "建筑物", active: true }
  ];

  return (
    <div className="space-y-4">
      {/* 位置卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <CardTitle>常用位置</CardTitle>
          </div>
          <CardDescription>选择预设位置</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {presetLocations.map((location) => (
              <Button 
                key={location.name}
                variant="outline"
                onClick={() => onLocationSelect?.(location.coordinates as [number, number])}
                className="justify-start"
              >
                <MapPinIcon className="h-4 w-4 mr-2" />
                {location.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 图层卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LayersIcon className="h-5 w-5" />
            <CardTitle>图层</CardTitle>
          </div>
          <CardDescription>控制地图图层显示</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {availableLayers.map((layer) => (
              <div key={layer.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`layer-${layer.id}`}
                  defaultChecked={layer.active}
                  onChange={(e) => onLayerToggle?.(layer.id, e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`layer-${layer.id}`} className="text-sm">
                  {layer.name}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 工具按钮 */}
      <div className="flex gap-2">
        <Button className="flex-1" variant="outline">
          <FileIcon className="h-4 w-4 mr-2" />
          导出
        </Button>
        <Button className="flex-1" variant="outline">
          <SettingsIcon className="h-4 w-4 mr-2" />
          设置
        </Button>
      </div>
    </div>
  );
};

export default MapSidebar; 