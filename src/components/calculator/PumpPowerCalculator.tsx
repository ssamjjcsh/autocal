'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const unitConversions = {
  flow: {
    'm³/s': 1,
    'm³/min': 1 / 60,
    'm³/h': 1 / 3600,
    'L/s': 1 / 1000,
    'L/min': 1 / 60000,
    'L/h': 1 / 3600000,
    'ft³/s': 0.0283168,
    'gpm': 0.0000630902,
  },
  head: {
    'm': 1,
    'ft': 0.3048,
  },
  density: {
    'kg/m³': 1,
    'lb/ft³': 16.0185,
  },
};

const PumpPowerCalculator = () => {
  const [flowRate, setFlowRate] = useState<number | ''>(10);
  const [head, setHead] = useState<number | ''>(10);
  const [fluidDensity, setFluidDensity] = useState<number | ''>(1000);
  const [pumpEfficiency, setPumpEfficiency] = useState<number | ''>(70);
  const [flowRateUnit, setFlowRateUnit] = useState<keyof typeof unitConversions.flow>('m³/h');
  const [headUnit, setHeadUnit] = useState<keyof typeof unitConversions.head>('m');
  const [densityUnit, setDensityUnit] = useState<keyof typeof unitConversions.density>('kg/m³');
  const [calculatedPower, setCalculatedPower] = useState<number | null>(null);

  const calculatePumpPower = () => {
    if (flowRate === '' || head === '' || fluidDensity === '' || pumpEfficiency === '') {
      setCalculatedPower(null);
      return;
    }

    const g = 9.81; // 중력 가속도 (m/s²)

    // 단위를 SI 단위로 변환
    const flowRate_m3_s = flowRate * unitConversions.flow[flowRateUnit];
    const head_m = head * unitConversions.head[headUnit];
    const fluidDensity_kg_m3 = fluidDensity * unitConversions.density[densityUnit];
    const efficiency = pumpEfficiency / 100;

    if (efficiency === 0) {
      setCalculatedPower(null);
      return;
    }

    // 펌프 동력 계산 (kW)
    const power_kW = (fluidDensity_kg_m3 * g * head_m * flowRate_m3_s) / efficiency / 1000;
    setCalculatedPower(power_kW);
  };

  useEffect(() => {
    calculatePumpPower();
  }, [flowRate, head, fluidDensity, pumpEfficiency, flowRateUnit, headUnit, densityUnit]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">펌프 동력 계산기</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="flowRate">유량</Label>
            <div className="flex">
              <Input
                id="flowRate"
                type="number"
                value={flowRate}
                onChange={(e) => setFlowRate(parseFloat(e.target.value) || '')}
                placeholder="유량 입력"
              />
              <Select value={flowRateUnit} onValueChange={(value) => setFlowRateUnit(value as keyof typeof unitConversions.flow)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="단위" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(unitConversions.flow).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="head">양정</Label>
            <div className="flex">
              <Input
                id="head"
                type="number"
                value={head}
                onChange={(e) => setHead(parseFloat(e.target.value) || '')}
                placeholder="양정 입력"
              />
              <Select value={headUnit} onValueChange={(value) => setHeadUnit(value as keyof typeof unitConversions.head)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="단위" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(unitConversions.head).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fluidDensity">유체 밀도</Label>
            <div className="flex">
              <Input
                id="fluidDensity"
                type="number"
                value={fluidDensity}
                onChange={(e) => setFluidDensity(parseFloat(e.target.value) || '')}
                placeholder="유체 밀도 입력"
              />
              <Select value={densityUnit} onValueChange={(value) => setDensityUnit(value as keyof typeof unitConversions.density)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="단위" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(unitConversions.density).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pumpEfficiency">펌프 효율 (%)</Label>
            <Input
              id="pumpEfficiency"
              type="number"
              value={pumpEfficiency}
              onChange={(e) => setPumpEfficiency(parseFloat(e.target.value) || '')}
              placeholder="펌프 효율 입력 (예: 70)"
              min="0"
              max="100"
            />
          </div>
        </div>

        {calculatedPower !== null && (
          <Card className="bg-gray-100 dark:bg-gray-700">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">계산 결과</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {calculatedPower.toFixed(2)} kW
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default PumpPowerCalculator;