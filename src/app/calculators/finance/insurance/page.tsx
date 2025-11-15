'use client';

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomDatePicker, CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker'
import { HelpCircle, FileText, PiggyBank } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';

const InsuranceCalculator: NextPage = () => {
  const [monthlySalary, setMonthlySalary] = useState<number>(4500000);
  const [employeeCount, setEmployeeCount] = useState<string>('150 미만 기업');
  const [industrialAccidentRate, setIndustrialAccidentRate] = useState<number>(1.26);
  const [isCalculated, setIsCalculated] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setter(parseFloat(value || '0'));
  };

  const handleCalculate = useCallback(() => {
    const salary = monthlySalary;
    if (isNaN(salary) || salary <= 0) {
      toast.error('올바른 월 급여를 입력해주세요.');
      return;
    }

    const industrialRate = industrialAccidentRate;
    if (isNaN(industrialRate)) {
      toast.error('올바른 산재보험료율을 입력해주세요.');
      return;
    }

    // 국민연금 (상한액 5,900,000원, 하한액 370,000원 적용)
    const nationalPensionBase = Math.max(370000, Math.min(salary, 5900000));
    const nationalPensionTotal = nationalPensionBase * 0.09;
    const nationalPensionEmployee = nationalPensionTotal / 2;
    const nationalPensionEmployer = nationalPensionTotal / 2;

    // 건강보험
    const healthInsuranceTotal = salary * 0.0709;
    const healthInsuranceEmployee = healthInsuranceTotal / 2;
    const healthInsuranceEmployer = healthInsuranceTotal / 2;

    // 장기요양보험
    const longTermCareInsuranceTotal = healthInsuranceTotal * 0.1295;
    const longTermCareInsuranceEmployee = longTermCareInsuranceTotal / 2;
    const longTermCareInsuranceEmployer = longTermCareInsuranceTotal / 2;

    // 고용보험
    let unemploymentInsuranceRate = 0.009;
    if (employeeCount === '150인 이상 기업(우선 지원대상 기업)') {
      unemploymentInsuranceRate = 0.011;
    } else if (employeeCount === '150인 이상 1,000인 미만 기업') {
      unemploymentInsuranceRate = 0.013;
    } else if (employeeCount === '1,000인 이상기업/국가지방자치단체') {
      unemploymentInsuranceRate = 0.015;
    }
    const unemploymentInsuranceTotal = salary * (unemploymentInsuranceRate + 0.009);
    const unemploymentInsuranceEmployee = salary * 0.009;
    const unemploymentInsuranceEmployer = salary * unemploymentInsuranceRate;


    // 산재보험 (전액 사업주 부담)
    const industrialAccidentInsuranceTotal = salary * (industrialRate / 100);
    const industrialAccidentInsuranceEmployee = 0;
    const industrialAccidentInsuranceEmployer = industrialAccidentInsuranceTotal;

    const totalEmployeeDeduction = nationalPensionEmployee + healthInsuranceEmployee + longTermCareInsuranceEmployee + unemploymentInsuranceEmployee;
    const totalEmployerBurden = nationalPensionEmployer + healthInsuranceEmployer + longTermCareInsuranceEmployer + unemploymentInsuranceEmployer + industrialAccidentInsuranceEmployer;
    const totalInsurance = totalEmployeeDeduction + totalEmployerBurden;
    const actualSalary = salary - totalEmployeeDeduction;

    setResult({
      nationalPension: { total: nationalPensionTotal, employee: nationalPensionEmployee, employer: nationalPensionEmployer },
      healthInsurance: { total: healthInsuranceTotal, employee: healthInsuranceEmployee, employer: healthInsuranceEmployer },
      longTermCareInsurance: { total: longTermCareInsuranceTotal, employee: longTermCareInsuranceEmployee, employer: longTermCareInsuranceEmployer },
      unemploymentInsurance: { total: unemploymentInsuranceTotal, employee: unemploymentInsuranceEmployee, employer: unemploymentInsuranceEmployer },
      industrialAccidentInsurance: { total: industrialAccidentInsuranceTotal, employee: industrialAccidentInsuranceEmployee, employer: industrialAccidentInsuranceEmployer },
      totalEmployeeDeduction,
      totalEmployerBurden,
      totalInsurance,
      actualSalary,
    });
    setIsCalculated(true);
    toast.success('4대보험료가 계산되었습니다.');
  }, [monthlySalary, employeeCount, industrialAccidentRate]);

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlySalary">월 급여 (원)</Label>
          <Input id="monthlySalary" value={monthlySalary.toLocaleString()} onChange={handleInputChange(setMonthlySalary)} placeholder="예: 4,500,000" className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeeCount">근로자수</Label>
          <Select value={employeeCount} onValueChange={setEmployeeCount}>
            <SelectTrigger>
              <SelectValue placeholder="근로자수 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="150 미만 기업">150인 미만 기업</SelectItem>
              <SelectItem value="150인 이상 기업(우선 지원대상 기업)">150인 이상 기업(우선 지원대상 기업)</SelectItem>
              <SelectItem value="150인 이상 1,000인 미만 기업">150인 이상 1,000인 미만 기업</SelectItem>
              <SelectItem value="1,000인 이상기업/국가지방자치단체">1,000인 이상기업/국가지방자치단체</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industrialAccidentRate">산재보험료율 (%)</Label>
          <div className="flex items-center gap-2">
            <Input id="industrialAccidentRate" value={industrialAccidentRate.toLocaleString()} onChange={handleInputChange(setIndustrialAccidentRate)} placeholder="예: 1.26" className="text-right" />
            <a href="https://www.comwel.or.kr/comwel/paym/insu/chek1.jsp" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                알아보기 <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </div>
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = isCalculated && result ? (
    <Card>
      <CardHeader>
        <CardTitle>계산 결과</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">예상 실수령액</p>
            <p className="text-2xl font-bold">{formatNumber(Math.floor(result.actualSalary))}원</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">총 공제액 (근로자 부담)</p>
            <p className="text-2xl font-bold text-red-500">{formatNumber(Math.floor(result.totalEmployeeDeduction))}원</p>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-2">구분</th>
                <th className="p-2 text-right">총 보험료</th>
                <th className="p-2 text-right">근로자 부담</th>
                <th className="p-2 text-right">사업주 부담</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-medium">국민연금</td>
                <td className="p-2 text-right">{Math.floor(result.nationalPension.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.nationalPension.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.nationalPension.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">건강보험</td>
                <td className="p-2 text-right">{Math.floor(result.healthInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.healthInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.healthInsurance.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">장기요양보험</td>
                <td className="p-2 text-right">{Math.floor(result.longTermCareInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.longTermCareInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.longTermCareInsurance.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">고용보험</td>
                <td className="p-2 text-right">{Math.floor(result.unemploymentInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.unemploymentInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.unemploymentInsurance.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">산재보험</td>
                <td className="p-2 text-right">{Math.floor(result.industrialAccidentInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.industrialAccidentInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.industrialAccidentInsurance.employer).toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot className="font-bold bg-muted">
              <tr>
                <td className="p-2">합계</td>
                <td className="p-2 text-right">{Math.floor(result.totalInsurance).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.totalEmployeeDeduction).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.totalEmployerBurden).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-40">
      계산하기 버튼을 눌러주세요
    </div>
  );

  const infoSection = {
    calculatorDescription:
      '4대 사회보험(국민연금, 건강보험, 고용보험, 산재보험)은 국가가 국민의 기본적인 생활을 보장하기 위해 만든 사회보장제도입니다. 근로자는 의무적으로 가입해야 하며, 보험료는 근로자와 사업주가 함께 부담합니다. 이 계산기는 월 급여를 기준으로 각 보험료가 얼마인지 모의로 계산해볼 수 있도록 돕습니다.',
    calculationFormula: (
      <div className="space-y-2">
        <p><strong>국민연금:</strong> 기준소득월액 × 9% (근로자 4.5%, 사업주 4.5%)</p>
        <p><strong>건강보험:</strong> 보수월액 × 7.09% (근로자 3.545%, 사업주 3.545%)</p>
        <p><strong>장기요양보험:</strong> 건강보험료 × 12.95% (근로자/사업주 50%씩 부담)</p>
        <p><strong>고용보험(실업급여):</strong> 월 급여 × 0.9% (근로자/사업주 각각 부담)</p>
        <p><strong>산재보험:</strong> 보수총액 × 보험료율 ÷ 1,000 (전액 사업주 부담)</p>
      </div>
    ),
    usefulTips:
      '비과세 소득(예: 식대, 차량유지비 등)은 4대 보험료 계산 시 제외될 수 있으므로, 정확한 계산을 위해서는 본인의 급여명세서를 확인하는 것이 좋습니다. 또한, 국민연금은 기준소득월액에 상한액과 하한액이 정해져 있어 실제 소득과 차이가 있을 수 있습니다. 이 계산 결과는 모의 계산이므로 법적 효력이 없으며 참고용으로만 활용하시기 바랍니다.',
  };

  return (
    <CalculatorsLayout
      title="4대보험 계산기"
      description="월 급여에 따른 4대보험료를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default InsuranceCalculator;