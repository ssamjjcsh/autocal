'use client'

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WeeklyHolidayAllowanceCalculator = () => {
  const [hourlyWage, setHourlyWage] = useState<number>(0);
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(0);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<number>(0);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value.replace(/,/g, ''));
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (value: string) => {
    const parsedValue = parseFloat(value);
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleReset = () => {
    setHourlyWage(0);
    setWorkHoursPerDay(0);
    setWorkDaysPerWeek(0);
  };

  const { calculatedWeeklyHolidayAllowance, calculatedWeeklyWorkHours } = useMemo(() => {
    if (isNaN(hourlyWage) || isNaN(workHoursPerDay) || isNaN(workDaysPerWeek) || hourlyWage <= 0 || workHoursPerDay <= 0 || workDaysPerWeek <= 0) {
      return {
        calculatedWeeklyHolidayAllowance: 0,
        calculatedWeeklyWorkHours: 0,
      };
    }

    const weeklyWorkHours = workHoursPerDay * workDaysPerWeek;
    let weeklyHolidayAllowance = 0;

    if (weeklyWorkHours >= 15) {
      weeklyHolidayAllowance = (weeklyWorkHours / 40) * 8 * hourlyWage; // 40시간 기준 8시간 유급휴일
    }

    return {
      calculatedWeeklyHolidayAllowance: Math.round(weeklyHolidayAllowance),
      calculatedWeeklyWorkHours: weeklyWorkHours,
    };
  }, [hourlyWage, workHoursPerDay, workDaysPerWeek]);

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hourlyWage">시급 (원)</Label>
        <Input
          id="hourlyWage"
          value={hourlyWage.toLocaleString()}
          onChange={handleInputChange(setHourlyWage)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="시급 입력"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workHoursPerDay">1일 소정근로시간 (시간)</Label>
        <Input
          id="workHoursPerDay"
          value={workHoursPerDay.toLocaleString()}
          onChange={handleInputChange(setWorkHoursPerDay)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="1일 소정근로시간 입력"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workDaysPerWeek">1주 소정근로일수 (일)</Label>
        <Select onValueChange={handleSelectChange(setWorkDaysPerWeek)} value={String(workDaysPerWeek)}>
          <SelectTrigger id="workDaysPerWeek">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(7)].map((_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}일</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleReset} className="w-full" variant="outline">
        초기화
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>주간 소정근로시간:</span>
        <span>{calculatedWeeklyWorkHours.toLocaleString()} 시간</span>
      </div>
      <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
        <span>예상 주휴수당:</span>
        <span>{calculatedWeeklyHolidayAllowance.toLocaleString()} 원</span>
      </div>
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        주휴수당은 주 15시간 이상 근무하는 근로자에게 유급 주휴일을 부여하고,
        이 주휴일에 대해 지급하는 수당입니다. 주휴수당은 근로기준법에 따라
        지급되어야 하는 의무적인 수당입니다.
      </>
    ),
    calculationFormula: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>주간 소정근로시간:</strong> 1일 소정근로시간 × 1주 소정근로일수
        </li>
        <li>
          <strong>주휴수당:</strong> (주간 소정근로시간 / 40시간) × 8시간 × 시급
          <br />
          (단, 주간 소정근로시간이 15시간 미만인 경우 주휴수당은 발생하지 않습니다.)
        </li>
      </ul>
    ),
    usefulTips: (
      <>
        • 주휴수당은 1주 소정근로시간이 15시간 이상인 근로자에게만 지급됩니다.
        • 결근 없이 1주간 개근해야 주휴수당이 발생합니다.
        • 4주 평균 1주 소정근로시간이 15시간 이상인 단시간 근로자에게도 지급됩니다.
      </>
    )
  };

  return (
    <CalculatorsLayout
      title="주휴수당 계산기"
      description="시급, 1일 소정근로시간, 1주 소정근로일수를 입력하여 주휴수당을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default WeeklyHolidayAllowanceCalculator;