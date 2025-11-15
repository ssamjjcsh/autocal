'use client';

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

const OrdinaryWageCalculator: NextPage = () => {
  const [baseSalary, setBaseSalary] = useState<number>(3000000);
  const [monthlyAllowances, setMonthlyAllowances] = useState<number>(200000);
  const [annualBonuses, setAnnualBonuses] = useState<number>(5000000);
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState<number>(40);

  // 숫자 입력 처리 핸들러 정의
  const handleInputChange = (setter: (value: number) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
      const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
      setter(isNaN(numericValue) ? 0 : numericValue);
    };
  };

  const [results, setResults] = useState<{
    hourlyWage: number;
    dailyWage: number;
    monthlyWage: number;
    annualWage: number;
  } | null>(null);

  const calculationResults = useMemo(() => {
    const base = baseSalary;
    const allowances = monthlyAllowances;
    const bonuses = annualBonuses;
    const hours = workHoursPerWeek;

    if (isNaN(base) || isNaN(allowances) || isNaN(bonuses) || isNaN(hours) || hours <= 0) {
      return null;
    }

    const totalMonthlyWage = base + allowances + bonuses / 12;
    const calculatedHourlyWage = totalMonthlyWage / 209; // 주 40시간 기준 월 소정근로시간
    const calculatedDailyWage = calculatedHourlyWage * (hours / 5);

    return {
      hourlyWage: calculatedHourlyWage,
      dailyWage: calculatedDailyWage,
      monthlyWage: totalMonthlyWage,
      annualWage: totalMonthlyWage * 12,
    };
  }, [baseSalary, monthlyAllowances, annualBonuses, workHoursPerWeek]);

  const handleCalculate = () => {
    if (calculationResults) {
      setResults(calculationResults);
      toast.success('계산이 완료되었습니다.');
    } else {
      toast.error('입력값을 확인해주세요.');
    }
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="baseSalary">월 기본급 (원)</Label>
        <Input
          id="baseSalary"
          value={baseSalary.toLocaleString()}
          onChange={(e) => handleInputChange(setBaseSalary)(e)}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyAllowances">월 기타수당 (원)</Label>
        <Input
          id="monthlyAllowances"
          value={monthlyAllowances.toLocaleString()}
          onChange={(e) => handleInputChange(setMonthlyAllowances)(e)}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualBonuses">연간 상여금 (원)</Label>
        <Input
          id="annualBonuses"
          value={annualBonuses.toLocaleString()}
          onChange={(e) => handleInputChange(setAnnualBonuses)(e)}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workHoursPerWeek">주당 근로시간</Label>
        <Input
          id="workHoursPerWeek"
          value={workHoursPerWeek.toLocaleString()}
          onChange={(e) => handleInputChange(setWorkHoursPerWeek)(e)}
          className="text-right"
          type="number"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <>
      {results ? (
        <Card>
          <CardHeader>
            <CardTitle>계산 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <div className="flex justify-between items-center">
              <span>시간급 통상임금</span>
              <span className="font-bold">{results.hourlyWage.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
              <span>일급 통상임금</span>
              <span className="font-bold">{results.dailyWage.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
              <span>월급 통상임금</span>
              <span className="font-bold">{results.monthlyWage.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
              <span>연봉 환산액</span>
              <span className="font-bold">{results.annualWage.toLocaleString()} 원</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          입력 후 계산하기 버튼을 눌러주세요.
        </div>
      )}
    </>
  );

  const infoSection = {
    calculatorDescription: "월 기본급, 수당, 상여금 등을 입력하여 통상임금을 계산합니다. 통상임금은 연장, 야간, 휴일근로수당 등의 산정 기준이 됩니다.",
    calculationFormula: (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>통상임금 계산 공식</AccordionTrigger>
                <AccordionContent>
                    <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">시간급 = (월 통상임금) / (월 소정근로시간)</p>
                    <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">일급 = 시간급 * 1일 소정근로시간</p>
                    <p className="text-xs mt-2">* 월 통상임금 = 월 기본급 + 월 기타수당 + (연간 상여금 / 12)</p>
                    <p className="text-xs">* 주 40시간 근무 시 월 소정근로시간은 209시간으로 산정됩니다.</p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    usefulTips: "통상임금에 포함되는 임금의 범위는 법적으로 정해져 있으므로, 모든 수당이 포함되는 것은 아닙니다. 일반적으로 정기적, 일률적, 고정적으로 지급되는 임금이 통상임금에 해당합니다."
  };

  return (
    <CalculatorsLayout
      title="통상임금 계산기"
      description="월 기본급, 수당, 상여금 등을 입력하여 통상임금을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default OrdinaryWageCalculator;