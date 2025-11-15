import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PumpPowerCalculatorProps {
  onCalculate: (shaftPower: number, motorPower: number, explanation: string) => void;
  setCalculationExplanation: (explanation: string | null) => void;
}

export default function PumpPowerCalculator({ onCalculate, setCalculationExplanation }: PumpPowerCalculatorProps) {
  const [flowRate, setFlowRate] = useState<number>(300); // m³/h
  const [head, setHead] = useState<number>(100); // m
  const [fluidDensity, setFluidDensity] = useState<number>(1000); // kg/m³
  const [pumpEfficiency, setPumpEfficiency] = useState<number>(70); // %
  const [motorEfficiency, setMotorEfficiency] = useState<number>(90); // %

  const calculatePumpPower = useCallback(() => {
    const g = 9.81; // 중력 가속도 m/s²
    const flowRate_m3s = flowRate / 3600; // m³/h를 m³/s로 변환
    const pumpEfficiency_decimal = pumpEfficiency / 100;
    const motorEfficiency_decimal = motorEfficiency / 100;

    if (pumpEfficiency_decimal === 0 || motorEfficiency_decimal === 0) {
      onCalculate(0, 0, "펌프 효율과 모터 효율은 0이 될 수 없습니다.");
      return;
    }

    // 축 동력 (kW)
    const shaft = (fluidDensity * g * head * flowRate_m3s) / (pumpEfficiency_decimal * 1000);

    // 모터 동력 (kW)
    const motor = shaft / motorEfficiency_decimal;

    const explanation = `축 동력은 펌프가 유체를 이송하는 데 필요한 실제 동력이며, 모터 동력은 펌프 효율과 모터 효율을 고려하여 펌프를 구동하는 데 필요한 총 동력입니다.`;

    onCalculate(shaft, motor, explanation);
  }, [flowRate, head, fluidDensity, pumpEfficiency, motorEfficiency, onCalculate]);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="flowRate">유량 (m³/h)</Label>
          <Input
            id="flowRate"
            type="number"
            value={flowRate}
            onChange={(e) => setFlowRate(Number(e.target.value))}
            placeholder="예: 300"
          />
        </div>
        <div>
          <Label htmlFor="head">양정 (m)</Label>
          <Input
            id="head"
            type="number"
            value={head}
            onChange={(e) => setHead(Number(e.target.value))}
            placeholder="예: 100"
          />
        </div>
        <div>
          <Label htmlFor="fluidDensity">유체 밀도 (kg/m³)</Label>
          <Input
            id="fluidDensity"
            type="number"
            value={fluidDensity}
            onChange={(e) => setFluidDensity(Number(e.target.value))}
            placeholder="예: 1000"
          />
        </div>
        <div>
          <Label htmlFor="pumpEfficiency">펌프 효율 (%)</Label>
          <Input
            id="pumpEfficiency"
            type="number"
            value={pumpEfficiency}
            onChange={(e) => setPumpEfficiency(Number(e.target.value))}
            placeholder="예: 70"
          />
        </div>
        <div>
          <Label htmlFor="motorEfficiency">모터 효율 (%)</Label>
          <Input
            id="motorEfficiency"
            type="number"
            value={motorEfficiency}
            onChange={(e) => setMotorEfficiency(Number(e.target.value))}
            placeholder="예: 90"
          />
        </div>
      </div>
      <Button onClick={calculatePumpPower} className="w-full">계산하기</Button>
    </div>
  );
}