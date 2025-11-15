'use client';

import React, { useState, useCallback } from 'react';
import PumpPowerCalculator from '@/components/engineering-calculator/PumpPowerCalculator';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

export default function PumpPowerCalculatorPage() {
  const [displayedShaftPower, setDisplayedShaftPower] = useState<number | undefined>(undefined);
  const [displayedMotorPower, setDisplayedMotorPower] = useState<number | undefined>(undefined);
  const [displayedCalculationExplanation, setDisplayedCalculationExplanation] = useState<string | null>(null);

  const handleCalculate = useCallback((shaft: number, motor: number, explanation: string) => {
    setDisplayedShaftPower(shaft);
    setDisplayedMotorPower(motor);
    setDisplayedCalculationExplanation(explanation);
  }, []);

  return (
    <CalculatorsLayout
      title="펌프 동력 계산기"
      description="펌프의 동력을 계산합니다."
      inputSection={
        <PumpPowerCalculator
          onCalculate={handleCalculate}
          setCalculationExplanation={setDisplayedCalculationExplanation}
        />
      }
      resultSection={
        <div className="h-full flex flex-col justify-center items-center p-4 border rounded-lg bg-gray-50">
          {displayedShaftPower !== undefined && displayedMotorPower !== undefined ? (
             <div className="w-full text-center space-y-4">
               <div className="p-4 bg-white rounded-lg shadow-sm">
                 <p className="text-lg font-semibold text-gray-700">축 동력</p>
                 <p className="text-3xl font-bold text-green-600">{displayedShaftPower.toFixed(2)} kW</p>
               </div>
               <div className="p-4 bg-white rounded-lg shadow-sm">
                 <p className="text-lg font-semibold text-gray-700">모터 동력</p>
                 <p className="text-3xl font-bold text-green-600">{displayedMotorPower.toFixed(2)} kW</p>
               </div>
               {displayedCalculationExplanation && (
                 <div className="mt-6 pt-4 border-t border-gray-200">
                   <p className="text-sm text-gray-600 leading-relaxed">
                     {displayedCalculationExplanation}
                   </p>
                 </div>
               )}
             </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">계산하기 버튼을 눌러주세요.</p>
          )}
        </div>
      }
      infoSection={{
       calculatorDescription: (
         <p>
           펌프 동력 계산기는 유체 이송에 필요한 펌프의 동력을 계산하는 도구입니다.
           유량, 양정, 유체 밀도, 펌프 효율을 입력하여 필요한 동력을 산출할 수 있습니다.
         </p>
       ),
       calculationFormula: (
         <p>
           펌프 동력 (kW) = (유체 밀도 (kg/m³) × 중력 가속도 (m/s²) × 양정 (m) × 유량 (m³/s)) / 펌프 효율 / 1000
         </p>
       ),
       usefulTips: (
         <ul className="list-disc list-inside">
           <li>펌프 효율은 일반적으로 0.6 ~ 0.85 사이의 값을 가집니다.</li>
           <li>유체 밀도는 물의 경우 약 1000 kg/m³ 입니다.</li>
           <li>정확한 계산을 위해 각 단위가 일치하는지 확인하세요.</li>
         </ul>
       ),
     }}
   />
 );
}