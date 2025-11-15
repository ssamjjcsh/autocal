'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TorqueCalculator = () => {
  const [force, setForce] = useState<number | ''>( '');
  const [distance, setDistance] = useState<number | ''>( '');
  const [forceUnit, setForceUnit] = useState('N');
  const [distanceUnit, setDistanceUnit] = useState('m');
  const [result, setResult] = useState<number | null>(null);

  const calculateTorque = () => {
    if (force === '' || distance === '') {
      alert('힘과 거리를 모두 입력해주세요.');
      return;
    }

    let forceInNewton = Number(force);
    if (forceUnit === 'kN') {
      forceInNewton *= 1000;
    } else if (forceUnit === 'lbf') {
      forceInNewton *= 4.44822;
    }

    let distanceInMeter = Number(distance);
    if (distanceUnit === 'cm') {
      distanceInMeter /= 100;
    } else if (distanceUnit === 'ft') {
      distanceInMeter *= 0.3048;
    }

    const torque = forceInNewton * distanceInMeter;
    setResult(torque);
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="force" className="w-24">힘 (F):</label>
        <Input
          id="force"
          type="number"
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          placeholder="예: 50"
          className="flex-grow"
        />
        <Select onValueChange={setForceUnit} value={forceUnit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N">N</SelectItem>
            <SelectItem value="kN">kN</SelectItem>
            <SelectItem value="lbf">lbf</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="distance" className="w-24">거리 (r):</label>
        <Input
          id="distance"
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          placeholder="예: 2"
          className="flex-grow"
        />
        <Select onValueChange={setDistanceUnit} value={distanceUnit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m">m</SelectItem>
            <SelectItem value="cm">cm</SelectItem>
            <SelectItem value="ft">ft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calculateTorque} className="self-start">계산</Button>
    </div>
  );

  const resultSection = (
    result !== null ? (
      <Card>
        <CardHeader>
          <CardTitle>계산 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{result.toLocaleString()} N·m</p>
          <p className="text-sm text-muted-foreground mt-2">토크는 {result.toLocaleString()} 뉴턴 미터입니다.</p>
        </CardContent>
      </Card>
    ) : (
      <div className="flex items-center justify-center text-muted-foreground h-full">
        힘과 거리를 입력하고 계산 버튼을 눌러주세요.
      </div>
    )
  );

  const infoSection = {
    calculatorDescription: "토크 계산기는 힘과 회전축으로부터의 거리를 이용하여 토크(돌림힘)를 계산하는 도구입니다. 토크는 물체를 회전시키는 힘의 척도입니다.",
    calculationFormula: "토크(τ) = F * r\n- F: 힘 (N)\n- r: 회전축으로부터의 거리 (m)",
    usefulTips: "힘과 거리의 단위가 결과에 영향을 미치므로, 정확한 단위를 선택하는 것이 중요합니다. 결과는 뉴턴 미터(N·m)로 표시됩니다."
  };

  return (
    <CalculatorsLayout
      title="토크 계산기"
      description="힘과 거리를 입력하여 토크(돌림힘)를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default TorqueCalculator;