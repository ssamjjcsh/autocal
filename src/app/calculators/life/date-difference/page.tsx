'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

import { differenceInDays, differenceInMonths, differenceInYears, addDays, intervalToDuration } from 'date-fns';

const DateDifferenceCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [includeStartDate, setIncludeStartDate] = useState(false);
  const [result, setResult] = useState<{
    totalYears: number;
    totalMonths: number;
    totalDays: number;
    diffDays: number;
  } | null>(null);

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      setResult(null);
      return;
    }

    let start = new Date(startDate);
    let end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      [start, end] = [end, start]; // Swap dates if end is before start
    }

    const duration = intervalToDuration({ start, end });

    let diffDays = differenceInDays(end, start);

    if (includeStartDate) {
      diffDays += 1;
    }

    setResult({
      totalYears: duration.years || 0,
      totalMonths: duration.months || 0,
      totalDays: duration.days || 0,
      diffDays,
    });
  };

  const resetFields = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setIncludeStartDate(false);
    setResult(null);
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="startDate" className="w-24">시작일:</label>
        <CustomDatePickerWithPopover date={startDate} setDate={setStartDate} placeholder="시작일 선택" />
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor="endDate" className="w-24">종료일:</label>
        <CustomDatePickerWithPopover date={endDate} setDate={setEndDate} placeholder="종료일 선택" />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="includeStartDate"
          checked={includeStartDate}
          onChange={(e) => setIncludeStartDate(e.target.checked)}
          className="form-checkbox"
        />
        <label htmlFor="includeStartDate">초일 산입</label>
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateDateDifference}>계산</Button>
        <Button variant="secondary" onClick={resetFields}>초기화</Button>
      </div>
    </div>
  );

  const resultSection = result && (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <h3 className="text-xl font-semibold mb-2">날짜차이 계산결과</h3>
      <p className="text-lg">
        총 기간은 <span className="font-bold text-blue-600">{result.totalYears}년 {result.totalMonths}개월 {result.totalDays}일</span> 이고,
      </p>
      <p className="text-lg">
        총 일수는 <span className="font-bold text-blue-600">{result.diffDays}일</span> 입니다.
      </p>
    </div>
  );

  const infoSection = {
    calculatorDescription: "날짜차이 계산기는 두 날짜 사이의 기간을 계산해주는 도구입니다. 양도세 계산 및 각종 일상 생활속의 계산에 필요한 두 날짜간 차이를 쉽게 계산할 수 있습니다.",
    calculationFormula: "날짜 차이 = 종료일 - 시작일 (초일산입 여부에 따라 조정)",
    usefulTips: "민법 제157조에 따르면 기간을 일, 주, 월 또는 연으로 정한 때에는 기간의 초일은 산입하지 아니함을 원칙으로 합니다. 그러나 그 기간이 오전 영시로부터 시작하는 때에는 초일을 산입합니다. 또한, 연령 계산에는 출생일을 산입합니다 (민법 제158조). 당사자 간의 약정으로 초일산입하기로 하면 그 약정은 유효합니다."
  };

  return (
    <CalculatorsLayout
      title="날짜차이 계산기"
      description="두 날짜 사이의 기간을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DateDifferenceCalculator;