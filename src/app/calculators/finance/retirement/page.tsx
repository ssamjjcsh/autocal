'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
// import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import { subDays, differenceInDays } from 'date-fns';

const RetirementCalculator: NextPage = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [severancePay, setSeverancePay] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [dailyAverageWage, setDailyAverageWage] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState(false);

  const [last3MonthsWages, setLast3MonthsWages] = useState({
    month1: 3000000,
    month2: 3000000,
    month3: 3000000,
  });
  const [annualBonus, setAnnualBonus] = useState<number>(1000000);
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState<number>(500000);

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<Date | undefined>>) => (date: Date | undefined) => {
    setter(date);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
    setter(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleNestedInputChange = (
    setter: React.Dispatch<React.SetStateAction<{ month1: number; month2: number; month3: number; }>>,
    field: keyof typeof last3MonthsWages
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
    setter(prev => ({ ...prev, [field]: isNaN(numericValue) ? 0 : numericValue }));
  };


  const handleCalculate = () => {
    if (!startDate || !endDate) {
      toast.error('입사일과 퇴사일을 모두 선택해주세요.');
      return;
    }

    if (endDate < startDate) {
      toast.error('퇴사일은 입사일보다 빠를 수 없습니다.');
      return;
    }

    const daysOfEmployment = differenceInDays(endDate, startDate) + 1;
    setTotalDays(daysOfEmployment);

    if (daysOfEmployment < 365) {
      toast.info('근무 기간이 1년 미만인 경우 퇴직금 지급 대상이 아닙니다.');
      setSeverancePay(0);
      setDailyAverageWage(0);
      setIsCalculated(true);
      return;
    }

    const totalWagesLast3Months = last3MonthsWages.month1 + last3MonthsWages.month2 + last3MonthsWages.month3;
    const daysInLast3Months = differenceInDays(endDate, subDays(endDate, 90)) +1;
    
    const calculatedDailyAverageWage = (totalWagesLast3Months + (annualBonus * 3 / 12) + (annualLeaveAllowance * 3 / 12)) / daysInLast3Months;
    setDailyAverageWage(Math.floor(calculatedDailyAverageWage));

    const calculatedSeverancePay = calculatedDailyAverageWage * 30 * (daysOfEmployment / 365);
    setSeverancePay(Math.floor(calculatedSeverancePay));

    setIsCalculated(true);
    toast.success('퇴직금이 계산되었습니다.');
  };

  const inputSection = (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>입사일</Label>
          <CustomDatePickerWithPopover date={startDate} setDate={handleDateChange(setStartDate)} />
        </div>
        <div className="space-y-2">
          <Label>퇴사일</Label>
          <CustomDatePickerWithPopover date={endDate} setDate={handleDateChange(setEndDate)} />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">퇴직 전 3개월 급여</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="month1">1개월차 급여</Label>
            <Input id="month1" value={last3MonthsWages.month1.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month1')} className="text-right" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month2">2개월차 급여</Label>
            <Input id="month2" value={last3MonthsWages.month2.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month2')} className="text-right" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month3">3개월차 급여</Label>
            <Input id="month3" value={last3MonthsWages.month3.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month3')} className="text-right" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="annualBonus">연간 상여금 총액</Label>
          <Input id="annualBonus" value={annualBonus.toLocaleString()} onChange={handleInputChange(setAnnualBonus)} className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annualLeaveAllowance">연차수당</Label>
          <Input id="annualLeaveAllowance" value={annualLeaveAllowance.toLocaleString()} onChange={handleInputChange(setAnnualLeaveAllowance)} className="text-right" />
        </div>
      </div>
      
      <Button onClick={handleCalculate} className="w-full">퇴직금 계산하기</Button>
    </div>
  );

  const resultSection = isCalculated ? (
    <Card>
      <CardHeader>
        <CardTitle>퇴직금 계산 결과</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">총 재직일수</span>
          <span className="font-bold">{totalDays}일</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">1일 평균임금</span>
          <span className="font-bold">{dailyAverageWage.toLocaleString()}원</span>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">예상 퇴직금</p>
          <p className="text-3xl font-bold text-blue-600">{severancePay.toLocaleString()}원</p>
        </div>
      </CardContent>
    </Card>
  ) : (
     <div className="flex items-center justify-center text-muted-foreground h-40">
        계산하기 버튼을 눌러주세요
      </div>
  );

  const infoSection = {
    calculatorDescription: "퇴직금은 근로자가 일정 기간 근속하고 퇴직할 경우 지급받는 급여입니다. 이 계산기는 입력된 정보를 바탕으로 예상 퇴직금을 계산하여 보여줍니다.",
    calculationFormula: (
        <div>
            <p>1. 1일 평균임금 = (퇴직 전 3개월 임금 총액) / (퇴직 전 3개월 총 일수)</p>
            <p>2. 퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 / 365)</p>
        </div>
    ),
    usefulTips: "정확한 퇴직금은 개인의 임금 구조, 상여금, 연차수당 등에 따라 달라질 수 있습니다. 본 계산 결과는 참고용으로만 활용해주시기 바랍니다."
  };

  return (
    <CalculatorsLayout
      title="퇴직금 계산기"
      description="근로기간과 급여 정보를 바탕으로 예상 퇴직금을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default RetirementCalculator;