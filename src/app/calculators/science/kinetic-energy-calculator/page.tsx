'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KineticEnergyCalculator = () => {
  const [calculationType, setCalculationType] = useState('linear'); // 'linear' or 'rotational'
  const [mass, setMass] = useState<number | ''>('');
  const [velocity, setVelocity] = useState<number | ''>('');
  const [momentOfInertia, setMomentOfInertia] = useState<number | ''>('');
  const [angularVelocity, setAngularVelocity] = useState<number | ''>('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let ke;
    if (calculationType === 'linear') {
      if (mass === '' || velocity === '') {
        alert('질량과 속도를 입력해주세요.');
        return;
      }
      ke = 0.5 * Number(mass) * Math.pow(Number(velocity), 2);
    } else {
      if (momentOfInertia === '' || angularVelocity === '') {
        alert('관성 모멘트와 각속도를 입력해주세요.');
        return;
      }
      ke = 0.5 * Number(momentOfInertia) * Math.pow(Number(angularVelocity), 2);
    }
    setResult({ kineticEnergy: ke });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => setCalculationType('linear')} 
          variant={calculationType === 'linear' ? 'default' : 'outline'}
          className="flex-1"
        >
          선형 운동
        </Button>
        <Button 
          onClick={() => setCalculationType('rotational')} 
          variant={calculationType === 'rotational' ? 'default' : 'outline'}
          className="flex-1"
        >
          회전 운동
        </Button>
      </div>

      {calculationType === 'linear' ? (
        <>
          <div className="space-y-2">
            <label htmlFor="mass" className="text-sm font-medium">질량 (kg)</label>
            <Input 
              id="mass" 
              type="number" 
              value={mass} 
              onChange={(e) => setMass(Number(e.target.value))} 
              placeholder="예: 10"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="velocity" className="text-sm font-medium">속도 (m/s)</label>
            <Input 
              id="velocity" 
              type="number" 
              value={velocity} 
              onChange={(e) => setVelocity(Number(e.target.value))} 
              placeholder="예: 5"
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="momentOfInertia" className="text-sm font-medium">관성 모멘트 (kg·m²)</label>
            <Input 
              id="momentOfInertia" 
              type="number" 
              value={momentOfInertia} 
              onChange={(e) => setMomentOfInertia(Number(e.target.value))} 
              placeholder="예: 0.5"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="angularVelocity" className="text-sm font-medium">각속도 (rad/s)</label>
            <Input 
              id="angularVelocity" 
              type="number" 
              value={angularVelocity} 
              onChange={(e) => setAngularVelocity(Number(e.target.value))} 
              placeholder="예: 10"
            />
          </div>
        </>
      )}
      <Button onClick={calculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  const resultSection = result ? (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-lg text-muted-foreground">계산된 운동 에너지</p>
      <div className="flex items-baseline my-4">
        <span className="text-6xl font-bold tracking-tight">
          {result.kineticEnergy.toLocaleString(undefined, { maximumFractionDigits: 4 })}
        </span>
        <span className="text-2xl font-medium text-muted-foreground ml-2">J</span>
      </div>
      <div className="bg-muted rounded-lg p-4 w-full">
        <p className="text-sm text-muted-foreground mb-2">입력값</p>
        <div className="text-sm space-y-1">
          {calculationType === 'linear' ? (
            <>
              <div className="flex justify-between">
                <span>질량:</span>
                <span className="font-medium">{mass} kg</span>
              </div>
              <div className="flex justify-between">
                <span>속도:</span>
                <span className="font-medium">{velocity} m/s</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>관성 모멘트:</span>
                <span className="font-medium">{momentOfInertia} kg·m²</span>
              </div>
              <div className="flex justify-between">
                <span>각속도:</span>
                <span className="font-medium">{angularVelocity} rad/s</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      정보를 입력하고 계산 버튼을 눌러주세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div>
        <p className="mb-4">
          운동 에너지(Kinetic Energy)는 물체가 운동할 때 가지는 에너지입니다. 물체의 질량과 속도에 의해 결정되며, 물체가 움직이고 있기 때문에 가지고 있는 에너지입니다. 이 계산기는 선형 운동 에너지와 회전 운동 에너지를 모두 계산할 수 있습니다.
        </p>
        <h4 className="font-semibold mb-2">운동 에너지의 종류</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>병진 운동 에너지 (Translational Kinetic Energy):</strong> 직선 또는 곡선을 따라 이동하는 물체의 운동 에너지입니다. 일반적으로 <strong>KE = 0.5 * m * v²</strong>로 계산합니다.
          </li>
          <li>
            <strong>회전 운동 에너지 (Rotational Kinetic Energy):</strong> 물체가 회전할 때 가지는 운동 에너지입니다. <strong>KE = 0.5 * I * ω²</strong>로 계산합니다.
          </li>
        </ul>
      </div>
    ),
    calculationFormula: (
      <div>
        <h4 className="font-semibold mb-2">선형 운동 에너지</h4>
        <p className="mb-2">KE = 0.5 * m * v²</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          <li><strong>KE</strong>: 운동 에너지 (단위: 줄, J)</li>
          <li><strong>m</strong>: 물체의 질량 (단위: 킬로그램, kg)</li>
          <li><strong>v</strong>: 물체의 속도 (단위: 미터/초, m/s)</li>
        </ul>
        <hr className="my-4" />
        <h4 className="font-semibold mb-2">회전 운동 에너지</h4>
        <p className="mb-2">KE = 0.5 * I * ω²</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          <li><strong>KE</strong>: 운동 에너지 (단위: 줄, J)</li>
          <li><strong>I</strong>: 관성 모멘트 (단위: kg·m²)</li>
          <li><strong>ω</strong>: 각속도 (단위: rad/s)</li>
        </ul>
      </div>
    ),
    usefulTips: (
      <div>
        <h4 className="font-semibold mb-2">일-에너지 정리 (Work-Energy Theorem)</h4>
        <p className="mb-2">
          물체에 가해진 알짜 일(Work)은 그 물체의 운동 에너지 변화량과 같습니다. 즉, 물체에 일을 가하면 운동 에너지가 증가하고, 물체가 외부에 일을 하면 운동 에너지가 감소합니다.
        </p>
        <h4 className="font-semibold mt-4 mb-2">실생활 응용</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>교통 안전:</strong> 자동차의 속도가 2배가 되면 운동 에너지는 4배로 증가합니다. 이는 사고 시 충격이 훨씬 커짐을 의미하므로, 과속의 위험성을 이해하는 데 중요합니다.
          </li>
          <li>
            <strong>스포츠:</strong> 투수나 타자는 공에 최대한의 운동 에너지를 전달하여 더 빠르고 강력한 공을 만들어냅니다.
          </li>
          <li>
            <strong>발전:</strong> 풍력 발전기는 바람의 운동 에너지를, 수력 발전기는 물의 운동 에너지를 전기 에너지로 변환합니다.
          </li>
        </ul>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="운동 에너지 계산기"
      description="질량과 속도 또는 관성 모멘트와 각속도를 입력하여 운동 에너지를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default KineticEnergyCalculator;