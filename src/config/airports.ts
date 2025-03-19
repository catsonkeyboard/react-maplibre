export interface AirportConfig {
  name: string;
  code: string;
  location: [number, number];
  defaultZoom: number;
  rotation?: number;
}

export const airports: AirportConfig[] = [
  {
    name: '温州龙湾国际机场',
    code: 'WNZ',
    location: [120.84804469204668, 27.908917928544973],
    defaultZoom: 17,
    rotation: 242.16
  },
  {
    name: '澳门国际机场',
    code: 'MFM',
    location: [113.58344294221139, 22.14885494463295],
    defaultZoom: 16,
    rotation: 289
  },
  {
    name: '南阳姜营机场',
    code: 'NNY',
    location: [112.61590528659953, 32.98301160023536],
    defaultZoom: 16,
    rotation: 48
  },
  {
    name: '哈尔滨太平国际机场',
    code: 'HRB',
    location: [126.2490, 45.6251],
    defaultZoom: 15,
    rotation: 231
  },
  {
    name: '上海浦东国际机场',
    code: 'PVG',
    location: [121.8053, 31.1443],
    defaultZoom: 15
  },
  {
    name: '昆明长水国际机场',
    code: 'KMG',
    location: [102.93533650951389, 25.11040567469039],
    defaultZoom: 16,
    rotation: 52
  }
]; 