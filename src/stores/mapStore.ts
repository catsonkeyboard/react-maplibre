import { create } from 'zustand';
import type { AirportConfig } from '../config/airports';
import { airports } from '../config/airports';

export type MapSource = 'gaode' | 'osm' | 'tianditu' | 'google';

interface MapState {
  // 地图状态
  center: [number, number];
  zoom: number;
  rotation: number;
  mapStyle: 'vector' | 'satellite';
  mapSource: MapSource;
  
  // 图层状态
  layerVisibility: {
    geofence: boolean;
    parking: boolean;
    runway: boolean;
    taxiway: boolean;
  };
  
  // 当前选中的机场
  selectedAirport: AirportConfig | null;
  
  // Actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setMapStyle: (style: 'vector' | 'satellite') => void;
  setMapSource: (source: MapSource) => void;
  toggleLayer: (layerId: keyof MapState['layerVisibility'], visible: boolean) => void;
  selectAirport: (airportCode: string) => void;
}

// 默认使用温州机场的配置
const defaultAirport = airports.find(airport => airport.code === 'WNZ') || airports[0];

export const useMapStore = create<MapState>((set) => ({
  // 初始状态
  center: defaultAirport.location,
  zoom: defaultAirport.defaultZoom,
  rotation: defaultAirport.rotation || 0,
  mapStyle: 'vector',
  mapSource: 'gaode',
  layerVisibility: {
    geofence: true,
    parking: true,
    runway: true,
    taxiway: true,
  },
  selectedAirport: defaultAirport,

  // Actions
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setRotation: (rotation) => set({ rotation }),
  setMapStyle: (mapStyle) => set({ mapStyle }),
  setMapSource: (mapSource) => set({ mapSource }),
  toggleLayer: (layerId, visible) => 
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layerId]: visible,
      },
    })),
  selectAirport: (airportCode) => {
    const airport = airports.find(a => a.code === airportCode);
    if (airport) {
      set({
        center: airport.location,
        zoom: airport.defaultZoom,
        rotation: airport.rotation || 0,
        selectedAirport: airport,
      });
    }
  },
})); 