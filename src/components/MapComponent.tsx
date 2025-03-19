import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '../lib/utils';
import { useMapStore } from '../stores/mapStore';

interface MapComponentProps {
  className?: string;
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

// OpenStreetMap 样式
const createOSMStyle = (style: 'vector' | 'satellite' = 'vector'): StyleSpecification => {
  return {
    version: 8,
    sources: {
      'osm': {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      },
      'osm-satellite': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '© Esri'
      }
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: style === 'vector' ? 'osm' : 'osm-satellite',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  } as StyleSpecification;
};

// 天地图样式
const createTiandituStyle = (style: 'vector' | 'satellite' = 'vector'): StyleSpecification => {
  const key = import.meta.env.VITE_TIANDITU_KEY;
  if (!key) {
    console.warn('天地图 key 未配置，请检查环境变量 VITE_TIANDITU_KEY');
    return createOSMStyle(style); // 如果没有配置 key，默认使用 OSM
  }

  return {
    version: 8,
    sources: {
      'tianditu-vec': {
        type: 'raster',
        tiles: [
          `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`
        ],
        tileSize: 256,
        attribution: '© 天地图'
      },
      'tianditu-satellite': {
        type: 'raster',
        tiles: [
          `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`
        ],
        tileSize: 256,
        attribution: '© 天地图'
      }
    },
    layers: [
      {
        id: 'tianditu-layer',
        type: 'raster',
        source: style === 'vector' ? 'tianditu-vec' : 'tianditu-satellite',
        minzoom: 0,
        maxzoom: 18
      }
    ]
  } as StyleSpecification;
};

// 谷歌地图样式
const createGoogleStyle = (style: 'vector' | 'satellite' = 'vector'): StyleSpecification => {
  return {
    version: 8,
    sources: {
      'google-vec': {
        type: 'raster',
        tiles: [
          'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: '© Google Maps'
      },
      'google-satellite': {
        type: 'raster',
        tiles: [
          'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: '© Google Maps'
      }
    },
    layers: [
      {
        id: 'google-layer',
        type: 'raster',
        source: style === 'vector' ? 'google-vec' : 'google-satellite',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  } as StyleSpecification;
};

const MapComponent = ({ className }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const isUserInteraction = useRef(false);
  
  // 从 store 获取状态
  const {
    center,
    zoom,
    rotation,
    mapStyle,
    mapSource,
    setZoom,
    setMapStyle,
    setMapSource,
    setCenter,
    setRotation,
    selectedAirport,
  } = useMapStore();

  useEffect(() => {
    if (map.current) return;
    
    if (mapContainer.current) {
      const initialStyle = (() => {
        switch (mapSource) {
          case 'gaode':
            return createGaodeStyle();
          case 'osm':
            return createOSMStyle(mapStyle);
          case 'tianditu':
            return createTiandituStyle(mapStyle);
          case 'google':
            return createGoogleStyle(mapStyle);
        }
      })();
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: initialStyle,
        center: selectedAirport?.location,
        zoom: selectedAirport?.defaultZoom,
        bearing: (selectedAirport?.rotation ?? 0) - 124,
        attributionControl: false
      });
      
      // 添加自定义归属信息
      map.current.addControl(
        new maplibregl.AttributionControl({
          customAttribution: (() => {
            switch (mapSource) {
              case 'gaode':
                return '© 2024 高德地图 AutoNavi';
              case 'osm':
                return mapStyle === 'vector'
                  ? '© OpenStreetMap contributors'
                  : '© Esri';
              case 'tianditu':
                return '© 天地图';
              case 'google':
                return '© Google Maps';
            }
          })()
        })
      );
      
      // 添加控件
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

      // if (map.current) {
      //   isUserInteraction.current = true;
      //   map.current.flyTo({
      //     center: selectedAirport?.location,
      //     zoom: selectedAirport?.defaultZoom,
      //     // bearing: selectedAirport?.defaultBearing,
      //     duration: 1000,
      //     easing: (t) => t
      //   });
      // }
      
      // 监听地图移动
      map.current.on('moveend', () => {
        if (map.current) {
          setCenter(map.current.getCenter().toArray() as [number, number]);
          setZoom(map.current.getZoom());
          setRotation(map.current.getBearing());
        }
        isUserInteraction.current = false;
      });
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapSource, mapStyle, selectedAirport, setCenter, setZoom, setRotation]);

  // // 当 rotation 属性变化时，更新地图旋转角度
  // useEffect(() => {
  //   if (map.current) {
  //     map.current.rotateTo(rotation + 90, {
  //       duration: 1000,
  //       easing: (t) => t
  //     });
  //   }
  // }, [rotation]);

  // // 当选中机场变化时，更新地图视图
  // useEffect(() => {
  //   if (map.current) {
  //     isUserInteraction.current = true;
  //     map.current.flyTo({
  //       center: selectedAirport?.location,
  //       zoom: selectedAirport?.defaultZoom,
  //       bearing: selectedAirport?.defaultBearing,
  //       duration: 1000,
  //       easing: (t) => t
  //     });
  //   }
  // }, [selectedAirport]);

  // 切换地图图层
  const toggleMapStyle = () => {
    if (!map.current) return;
    
    const newStyle = mapStyle === 'vector' ? 'satellite' : 'vector';
    
    const newMapStyle = (() => {
      switch (mapSource) {
        case 'gaode': {
          const style = createGaodeStyle();
          if (newStyle === 'satellite') {
            style.layers = [{
              id: 'gaode-satellite-layer',
              type: 'raster',
              source: 'gaode-satellite',
              minzoom: 0,
              maxzoom: 18
            }];
          }
          return style;
        }
        case 'osm':
          return createOSMStyle(newStyle);
        case 'tianditu':
          return createTiandituStyle(newStyle);
        case 'google':
          return createGoogleStyle(newStyle);
      }
    })();
    
    map.current.setStyle(newMapStyle);
    setMapStyle(newStyle);
  };

  // 切换地图源
  const handleMapSourceChange = (source: 'gaode' | 'osm' | 'tianditu' | 'google') => {
    if (!map.current) return;
    
    setMapSource(source);
    const newStyle = (() => {
      switch (source) {
        case 'gaode':
          return createGaodeStyle();
        case 'osm':
          return createOSMStyle(mapStyle);
        case 'tianditu':
          return createTiandituStyle(mapStyle);
        case 'google':
          return createGoogleStyle(mapStyle);
      }
    })();
    
    map.current.setStyle(newStyle);
    
    // 更新归属信息
    map.current.addControl(
      new maplibregl.AttributionControl({
        customAttribution: (() => {
          switch (source) {
            case 'gaode':
              return '© 2024 高德地图 AutoNavi';
            case 'osm':
              return mapStyle === 'vector'
                ? '© OpenStreetMap contributors'
                : '© Esri';
            case 'tianditu':
              return '© 天地图';
            case 'google':
              return '© Google Maps';
          }
        })()
      })
    );
  };

  return (
    <div className={cn('relative h-full w-full', className)}>
      <div ref={mapContainer} className="absolute top-0 left-0 h-full w-full" />
      <div className="absolute bottom-5 right-5 bg-white bg-opacity-80 p-2 rounded-md shadow-md">
        <p className="text-sm font-medium">缩放级别: {zoom.toFixed(2)}</p>
      </div>
      <div className="absolute top-5 right-5 flex gap-2">
        <select
          value={mapSource}
          onChange={(e) => handleMapSourceChange(e.target.value as 'gaode' | 'osm' | 'tianditu' | 'google')}
          className="bg-white p-2 rounded-md shadow-md"
        >
          <option value="gaode">高德地图</option>
          <option value="osm">OpenStreetMap</option>
          <option value="tianditu">天地图</option>
          <option value="google">谷歌地图</option>
        </select>
        <button 
          onClick={toggleMapStyle}
          className="bg-white p-2 rounded-md shadow-md"
        >
          切换为{mapStyle === 'vector' ? '卫星' : '矢量'}图
        </button>
      </div>
    </div>
  );
};

export default MapComponent; 