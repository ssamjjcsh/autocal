'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const AnniversaryCalculator = () => {
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);

  const calculateAnniversary = () => {
    const base = new Date(baseDate);
    const today = new Date(todayDate);

    if (isNaN(base.getTime())) return;

    const diffTime = Math.abs(today.getTime() - base.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = today.getFullYear() - base.getFullYear();
    const months = today.getMonth() - base.getMonth();
    const days = today.getDate() - base.getDate();

    let totalYears = years;
    let totalMonths = months;
    let totalDays = days;

    if (totalDays < 0) {
      totalMonths -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      totalDays += prevMonth.getDate();
    }

    if (totalMonths < 0) {
      totalYears -= 1;
      totalMonths += 12;
    }

    const nextAnniversary = new Date(base);
    nextAnniversary.setFullYear(today.getFullYear());
    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(today.getFullYear() + 1);
    }

    const daysToNextAnniversary = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      nextAnniversary: nextAnniversary.toLocaleDateString(),
      daysToNextAnniversary,
      totalYears,
      totalMonths,
      totalDays,
      diffDays,
      diffWeeks: Math.floor(diffDays / 7),
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <Tabs defaultValue="wedding" className="w-full">
        <TabsList>
          <TabsTrigger value="wedding">결혼기념일</TabsTrigger>
          <TabsTrigger value="relationship">사귄날</TabsTrigger>
          <TabsTrigger value="other">기타</TabsTrigger>
        </TabsList>
        <TabsContent value="wedding">
          <div className="flex items-center space-x-4 mt-4">
            <label htmlFor="baseDate" className="w-24">날짜:</label>
            <CustomDatePickerWithPopover
              date={new Date(baseDate)}
              setDate={(date) => setBaseDate(date.toISOString().split('T')[0])}
            />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex items-center space-x-4">
        <label htmlFor="todayDate" className="w-24">오늘 날짜:</label>
        <CustomDatePickerWithPopover
          date={new Date(todayDate)}
          setDate={(date) => setTodayDate(date.toISOString().split('T')[0])}
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateAnniversary}>계산하기</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>초기화</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>다음 기념일:</span>
            <strong>{result.nextAnniversary}</strong>
          </div>
          <div className="flex justify-between">
            <span>다음 기념일까지:</span>
            <strong>{result.daysToNextAnniversary} 일</strong>
          </div>
          <div className="flex justify-between">
            <span>함께한 시간:</span>
            <strong>{result.totalYears} 년, {result.totalMonths} 개월, {result.totalDays} 일</strong>
          </div>
          <div className="flex justify-between">
            <span>햇수:</span>
            <strong>{result.totalYears} 년</strong>
          </div>
          <div className="flex justify-between">
            <span>개월수:</span>
            <strong>{result.totalYears * 12 + result.totalMonths} 개월</strong>
          </div>
          <div className="flex justify-between">
            <span>주수:</span>
            <strong>{result.diffWeeks} 주</strong>
          </div>
          <div className="flex justify-between">
            <span>일수:</span>
            <strong>{result.diffDays} 일</strong>
          </div>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: "결혼기념일, 사귄 날 등 특별한 날짜를 입력하고 오늘 날짜를 기준으로 얼마나 시간이 지났는지, 다음 기념일까지 며칠이 남았는지 등을 계산할 수 있습니다.",
    calculationFormula: "기념일 계산은 날짜 차이를 기반으로 합니다. 오늘 날짜와 기념일 사이의 일수, 주수, 개월수, 햇수를 계산하여 결과를 제공합니다.",
    usefulTips: [
      "결혼기념일은 매년 같은 날짜로 계산됩니다",
      "사귄 날 계산은 시작일부터 오늘까지의 기간을 계산합니다",
      "음력 기념일은 양력으로 변환하여 계산해야 합니다"
    ]
  };

  return (
    <CalculatorsLayout
      title="기념일 계산기"
      description="특별한 날로부터 얼마나 지났는지 계산해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default AnniversaryCalculator;