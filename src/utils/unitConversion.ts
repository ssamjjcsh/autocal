/**
 * unitConversion.ts - 영국단위계와 SI단위계 간 변환 유틸리티
 * 
 * 재료 물성 데이터의 단위 변환을 위한 함수들
 */

import { MaterialProperties } from '@/types/materialProperties';

// 단위 변환 계수
export const CONVERSION_FACTORS = {
  // 밀도: lb/in³ → kg/m³
  density: 27679.9047,
  
  // 응력: psi → MPa
  stress: 0.00689476,
  
  // 온도: °F → °C
  temperature: {
    offset: 32,
    factor: 5/9
  },
  
  // 열팽창계수: μin/in/°F → μm/m/°C
  thermalExpansion: 1.8
};

// 단위 정보 인터페이스
export interface UnitInfo {
  imperial: string;
  si: string;
  conversionFactor?: number;
  isTemperature?: boolean;
}

// 물성별 단위 정보
export const UNIT_INFO: Record<string, UnitInfo> = {
  den: {
    imperial: 'lb/in³',
    si: 'kg/m³',
    conversionFactor: CONVERSION_FACTORS.density
  },
  yield_str: {
    imperial: 'psi',
    si: 'MPa',
    conversionFactor: CONVERSION_FACTORS.stress
  },
  ult_str: {
    imperial: 'psi',
    si: 'MPa',
    conversionFactor: CONVERSION_FACTORS.stress
  },
  elongation: {
    imperial: '%',
    si: '%'
  },
  moe: {
    imperial: 'psi',
    si: 'GPa',
    conversionFactor: CONVERSION_FACTORS.stress / 1000 // MPa to GPa
  },
  pr: {
    imperial: '%',
    si: '%'
  },
  max_service_temp: {
    imperial: '°F',
    si: '°C',
    isTemperature: true
  },
  coef_thermal_exp: {
    imperial: 'μin/in/°F',
    si: 'μm/m/°C',
    conversionFactor: CONVERSION_FACTORS.thermalExpansion
  },
  min_extrude_temp: {
    imperial: '°F',
    si: '°C',
    isTemperature: true
  },
  max_extrude_temp: {
    imperial: '°F',
    si: '°C',
    isTemperature: true
  },
  min_bed_temp: {
    imperial: '°F',
    si: '°C',
    isTemperature: true
  },
  max_bed_temp: {
    imperial: '°F',
    si: '°C',
    isTemperature: true
  }
};

/**
 * 화씨를 섭씨로 변환
 */
export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - CONVERSION_FACTORS.temperature.offset) * CONVERSION_FACTORS.temperature.factor;
};

/**
 * 섭씨를 화씨로 변환
 */
export const celsiusToFahrenheit = (celsius: number): number => {
  return celsius / CONVERSION_FACTORS.temperature.factor + CONVERSION_FACTORS.temperature.offset;
};

/**
 * 단일 물성값을 영국단위에서 SI단위로 변환
 */
export const convertPropertyToSI = (
  propertyKey: string, 
  value: number | undefined
): number | undefined => {
  if (value === undefined) return undefined;
  
  const unitInfo = UNIT_INFO[propertyKey];
  if (!unitInfo) return value;
  
  if (unitInfo.isTemperature) {
    return fahrenheitToCelsius(value);
  }
  
  if (unitInfo.conversionFactor) {
    return value * unitInfo.conversionFactor;
  }
  
  return value; // 단위 변환이 필요없는 경우 (%, 등)
};

/**
 * 단일 물성값을 SI단위에서 영국단위로 변환
 */
export const convertPropertyToImperial = (
  propertyKey: string, 
  value: number | undefined
): number | undefined => {
  if (value === undefined) return undefined;
  
  const unitInfo = UNIT_INFO[propertyKey];
  if (!unitInfo) return value;
  
  if (unitInfo.isTemperature) {
    return celsiusToFahrenheit(value);
  }
  
  if (unitInfo.conversionFactor) {
    return value / unitInfo.conversionFactor;
  }
  
  return value; // 단위 변환이 필요없는 경우 (%, 등)
};

/**
 * MaterialProperties 객체를 영국단위에서 SI단위로 변환
 */
export const convertPropertiesToSI = (properties: MaterialProperties): MaterialProperties => {
  const converted: MaterialProperties = {};
  
  Object.entries(properties).forEach(([key, value]) => {
    if (typeof value === 'number') {
      converted[key as keyof MaterialProperties] = convertPropertyToSI(key, value);
    }
  });
  
  return converted;
};

/**
 * MaterialProperties 객체를 SI단위에서 영국단위로 변환
 */
export const convertPropertiesToImperial = (properties: MaterialProperties): MaterialProperties => {
  const converted: MaterialProperties = {};
  
  Object.entries(properties).forEach(([key, value]) => {
    if (typeof value === 'number') {
      converted[key as keyof MaterialProperties] = convertPropertyToImperial(key, value);
    }
  });
  
  return converted;
};

/**
 * 물성값을 지정된 소수점 자리수로 반올림
 */
export const roundToDecimalPlaces = (value: number | undefined, decimals: number = 2): number | undefined => {
  if (value === undefined) return undefined;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * 물성값을 포맷팅하여 문자열로 반환 (단위 포함)
 */
export const formatPropertyValue = (
  propertyKey: string,
  value: number | undefined,
  useSI: boolean = false,
  decimals: number = 2
): string => {
  if (value === undefined) return '-';
  
  const unitInfo = UNIT_INFO[propertyKey];
  if (!unitInfo) return value.toString();
  
  const roundedValue = roundToDecimalPlaces(value, decimals);
  if (roundedValue === undefined) return '-';
  
  const unit = useSI ? unitInfo.si : unitInfo.imperial;
  return `${roundedValue.toLocaleString()} ${unit}`;
};

/**
 * 단위 시스템 타입
 */
export type UnitSystem = 'imperial' | 'si';

/**
 * 현재 단위 시스템에 따라 물성값을 변환
 */
export const UNIT_DEFINITIONS: { [key: string]: any } = {
  energy: {
    name: '열에너지',
    baseUnit: 'kcal/h',
    units: {
      'kcal/h': 1,
      'W': 1.163,
      'kW': 0.001163,
      'HP': 0.0015596,
      'USRt': 1 / 3024,
      'CRt': 1 / 3320,
    }
  },
  length: {
    name: '길이',
    baseUnit: 'm',
    units: {
      'm': 1,
      'cm': 100,
      'mm': 1000,
      'km': 0.001,
      'in': 39.3701,
      'ft': 3.28084,
      'yd': 1.09361,
      'mile': 0.000621371,
    }
  },
  area: {
    name: '면적',
    baseUnit: 'm²',
    units: {
      'm²': 1,
      'cm²': 10000,
      'km²': 0.000001,
      'in²': 1550,
      'ft²': 10.7639,
      'yd²': 1.19599,
      'acre': 0.000247105,
    }
  },
  volume: {
    name: '체적',
    baseUnit: 'm³',
    units: {
      'm³': 1,
      'L': 1000,
      'cm³': 1000000,
      'in³': 61023.7,
      'ft³': 35.3147,
      'gal (US)': 264.172,
    }
  },
  temperature: {
    name: '온도',
    baseUnit: '°C',
    units: {
      '°C': 1,
      '°F': 1,
      'K': 1,
    }
  },
  flow: {
    name: '유량',
    baseUnit: 'm³/s',
    units: {
      'm³/s': 1,
      'm³/h': 3600,
      'L/s': 1000,
      'L/min': 60000,
      'ft³/s': 35.3147,
      'ft³/min': 2118.88,
      'gpm (US)': 15850.3,
    }
  },
  pressure: {
    name: '압력',
    baseUnit: 'Pa',
    units: {
      'Pa': 1,
      'kPa': 0.001,
      'MPa': 0.000001,
      'bar': 0.00001,
      'psi': 0.000145038,
      'atm': 0.00000986923,
      'mmHg': 0.00750062,
    }
  },
  mass: {
    name: '질량',
    baseUnit: 'kg',
    units: {
      'kg': 1,
      'g': 1000,
      'mg': 1000000,
      'ton(SI)': 0.001, // Metric Ton
      'ton(미국)': 1 / 907.184, // US Ton (Short Ton)
      'ton(영국)': 1 / 1016.0469, // UK Ton (Long Ton)
      'lb': 2.20462,
      'oz': 35.274,
    }
  },
  enthalpy: {
    name: '엔탈피',
    baseUnit: 'kJ/kg',
    units: {
      'kJ/kg': 1,
      'kcal/kg': 0.239006,
      'BTU/lb': 0.429923,
    }
  },
};

export const convert = (value: number, fromUnit: string, toUnit: string, category: string): number => {
  const categoryData = UNIT_DEFINITIONS[category];
  if (!categoryData) {
    throw new Error(`알 수 없는 카테고리: ${category}`);
  }

  // 온도 변환은 별도 처리
  if (category === 'temperature') {
    if (fromUnit === '°C' && toUnit === '°F') return value * 9/5 + 32;
    if (fromUnit === '°F' && toUnit === '°C') return (value - 32) * 5/9;
    if (fromUnit === '°C' && toUnit === 'K') return value + 273.15;
    if (fromUnit === 'K' && toUnit === '°C') return value - 273.15;
    if (fromUnit === '°F' && toUnit === 'K') return (value - 32) * 5/9 + 273.15;
    if (fromUnit === 'K' && toUnit === '°F') return (value - 273.15) * 9/5 + 32;
    return value; // 같은 단위
  }

  const fromFactor = categoryData.units[fromUnit];
  const toFactor = categoryData.units[toUnit];

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error(`카테고리 ${category}에 유효하지 않은 단위가 있습니다.`);
  }

  // 기준 단위로 변환 후, 목표 단위로 다시 변환
  const valueInBaseUnit = value / fromFactor;
  const result = valueInBaseUnit * toFactor;

  return result;
}