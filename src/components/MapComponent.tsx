import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '../lib/utils';

interface MapComponentProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

// 高德地图瓦片样式
const createGaodeStyle = (): StyleSpecification => {
  return {
    version: 8,
    sources: {
      'gaode-vec': {
        type: 'raster',
        tiles: [
          'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        ],
        tileSize: 256
      },
      'gaode-satellite': {
        type: 'raster',
        tiles: [
          'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'gaode-vec-layer',
        type: 'raster',
        source: 'gaode-vec',
        minzoom: 0,
        maxzoom: 18
      }
    ]
  } as StyleSpecification;
};

const MapComponent = ({
  className,
  initialCenter = [116.3912, 39.9073], // 默认北京位置
  initialZoom = 12,
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [mapStyle, setMapStyle] = useState<'vector' | 'satellite'>('vector');

  useEffect(() => {
    if (map.current) return; // 初始化地图实例
    
    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: createGaodeStyle(), // 使用高德地图样式
        center: initialCenter,
        zoom: initialZoom,
        attributionControl: false // 隐藏默认的归属控件
      });
      
      // 添加自定义归属信息
      map.current.addControl(
        new maplibregl.AttributionControl({
          customAttribution: '© 2024 高德地图 AutoNavi'
        })
      );
      
      // 添加控件
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');
      
      // 监听缩放变化
      map.current.on('zoom', () => {
        if (map.current) {
          setZoom(map.current.getZoom());
        }
      });
    }
    
    // 清理函数
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom]);

  // 切换地图图层
  const toggleMapStyle = () => {
    if (!map.current) return;
    
    const newStyle = mapStyle === 'vector' ? 'satellite' : 'vector';
    const style = createGaodeStyle();
    
    // 更新图层显示
    if (newStyle === 'satellite') {
      style.layers = [{
        id: 'gaode-satellite-layer',
        type: 'raster',
        source: 'gaode-satellite',
        minzoom: 0,
        maxzoom: 18
      }];
    }
    
    map.current.setStyle(style);
    setMapStyle(newStyle);
  };

  return (
    <div className={cn('relative h-full w-full', className)}>
      <div ref={mapContainer} className="absolute top-0 left-0 h-full w-full" />
      <div className="absolute bottom-5 right-5 bg-white bg-opacity-80 p-2 rounded-md shadow-md">
        <p className="text-sm font-medium">缩放级别: {zoom.toFixed(2)}</p>
      </div>
      <button 
        onClick={toggleMapStyle}
        className="absolute top-5 right-16 bg-white p-2 rounded-md shadow-md z-10"
      >
        切换为{mapStyle === 'vector' ? '卫星' : '矢量'}图
      </button>
    </div>
  );
};

export default MapComponent; 