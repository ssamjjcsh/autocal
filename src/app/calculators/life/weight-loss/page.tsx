'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const WeightLossCalculator = () => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [result, setResult] = useState<any>(null);

  const calculateWeightLoss = () => {
    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(cw) || isNaN(tw) || isNaN(h) || isNaN(a)) {
      alert('모든 값을 정확히 입력해주세요.');
      return;
    }

    let bmr;
    if (gender === 'male') {
      bmr = 10 * cw + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * cw + 6.25 * h - 5 * a - 161;
    }

    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2, // 거의 운동 안함
      light: 1.375, // 가벼운 활동
      moderate: 1.55, // 보통 활동
      active: 1.725, // 적극적인 활동
      veryActive: 1.9, // 매우 적극적인 활동
    };

    const tdee = bmr * activityMultipliers[activityLevel];
    const caloriesForWeightLoss = tdee - 500; // 주당 0.5kg 감량 목표

    const weightToLose = cw - tw;
    const weeksToLose = weightToLose / 0.5;

    setResult({
      caloriesForWeightLoss: caloriesForWeightLoss.toFixed(2),
      weeksToLose: weeksToLose.toFixed(2),
      targetDate: new Date(Date.now() + weeksToLose * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-32">현재 체중 (kg):</label>
        <Input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} placeholder="예: 70" />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">목표 체중 (kg):</label>
        <Input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="예: 65" />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">신장 (cm):</label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="예: 175" />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">나이:</label>
        <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="예: 30" />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">성별:</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">남성</SelectItem>
            <SelectItem value="female">여성</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">활동 수준:</label>
        <Select value={activityLevel} onValueChange={setActivityLevel}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">거의 운동 안함</SelectItem>
            <SelectItem value="light">가벼운 활동 (주 1-3일)</SelectItem>
            <SelectItem value="moderate">보통 활동 (주 3-5일)</SelectItem>
            <SelectItem value="active">적극적인 활동 (주 6-7일)</SelectItem>
            <SelectItem value="veryActive">매우 적극적인 활동 (매일 2회 이상)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateWeightLoss}>계산하기</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>초기화</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>체중 감량을 위한 일일 권장 칼로리:</span>
            <strong>{result.caloriesForWeightLoss} kcal</strong>
          </div>
          <div className="flex justify-between">
            <span>목표 체중 도달까지 예상 시간:</span>
            <strong>약 {result.weeksToLose} 주</strong>
          </div>
          <div className="flex justify-between">
            <span>예상 목표 달성일:</span>
            <strong>{result.targetDate}</strong>
          </div>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: "체중 감량 계산기는 목표 체중 달성을 위한 일일 권장 칼로리와 예상 소요 시간을 계산해주는 도구입니다. 기초대사량(BMR)과 총 에너지 소비량(TDEE)을 기반으로 건강하고 안전한 체중 감량 계획을 수립할 수 있도록 도와줍니다.",
    calculationFormula: "기초대사량(BMR): 남성 = 10 × 체중(kg) + 6.25 × 신장(cm) - 5 × 나이 + 5, 여성 = 10 × 체중(kg) + 6.25 × 신장(cm) - 5 × 나이 - 161\n총 에너지 소비량(TDEE) = BMR × 활동 계수\n체중 감량을 위한 일일 칼로리 = TDEE - 500 (주당 0.5kg 감량 목표)",
    usefulTips: "건강한 체중 감량을 위해 균형 잡힌 식단, 규칙적인 운동, 충분한 수분 섭취, 적절한 수면, 스트레스 관리를 유지하세요. 급격한 체중 감량은 건강에 해로울 수 있으므로 주당 0.5kg ~ 1kg 감량을 목표로 하는 것이 안전합니다."
  };

  return (
    <CalculatorsLayout
      title="체중 감량 계산기"
      description="목표 체중 달성을 위한 일일 권장 칼로리와 예상 소요 시간을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default WeightLossCalculator;