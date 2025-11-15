'use client';

import { useState, useMemo } from 'react';
// import { formatNumber, parseNumber } from '../../../../utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SalaryCalculator() {
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [taxType, setTaxType] = useState<'before' | 'after'>('before');

  // const parsedMonthlySalary = useMemo(() => parseNumber(monthlySalary), [monthlySalary]);

  const nationalPensionRate = 0.045; // 국민연금 (사업주 4.5%, 근로자 4.5%)
  const healthInsuranceRate = 0.03545; // 건강보험 (사업주 3.545%, 근로자 3.545%)
  const longTermCareInsuranceRate = 0.1295; // 장기요양보험 (건강보험료의 12.95%)
  const employmentInsuranceRate = 0.009; // 고용보험 (근로자 0.9%)
  const incomeTaxRate = 0.03; // 소득세 (예시)
  const localIncomeTaxRate = 0.1; // 지방소득세 (소득세의 10%)

  const nationalPension = useMemo(() => monthlySalary * nationalPensionRate, [monthlySalary]);
  const healthInsurance = useMemo(() => monthlySalary * healthInsuranceRate, [monthlySalary]);
  const longTermCareInsurance = useMemo(() => healthInsurance * longTermCareInsuranceRate, [healthInsurance]);
  const employmentInsurance = useMemo(() => monthlySalary * employmentInsuranceRate, [monthlySalary]);

  const totalSocialInsurance = useMemo(
    () => nationalPension + healthInsurance + longTermCareInsurance + employmentInsurance,
    [nationalPension, healthInsurance, longTermCareInsurance, employmentInsurance]
  );

  const incomeTax = useMemo(() => {
    if (taxType === 'before') {
      return (monthlySalary - totalSocialInsurance) * incomeTaxRate;
    } else {
      return monthlySalary * incomeTaxRate;
    }
  }, [monthlySalary, totalSocialInsurance, taxType]);

  const localIncomeTax = useMemo(() => incomeTax * localIncomeTaxRate, [incomeTax]);

  const totalDeductions = useMemo(
    () => totalSocialInsurance + incomeTax + localIncomeTax,
    [totalSocialInsurance, incomeTax, localIncomeTax]
  );

  const actualMonthlySalary = useMemo(() => {
    if (taxType === 'before') {
      return monthlySalary - totalDeductions;
    } else {
      return monthlySalary;
    }
  }, [monthlySalary, totalDeductions, taxType]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
    setter(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleReset = () => {
    setMonthlySalary(0);
    setTaxType('before');
  };

  return (
    <CalculatorsLayout
      title="급여 계산기"
      inputSection={
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">급여 정보 입력</h2>
          <div>
            <Label htmlFor="monthlySalary">월 급여 (세전)</Label>
            <Input
              id="monthlySalary"
              type="text"
              value={monthlySalary.toLocaleString()}
              onChange={handleInputChange(setMonthlySalary)}
              placeholder="월 급여를 입력하세요"
            />
          </div>

          <div>
            <Label>세금 계산 기준</Label>
            <RadioGroup
              value={taxType}
              onValueChange={(value: 'before' | 'after') => setTaxType(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="before" id="taxBefore" />
                <Label htmlFor="taxBefore">세전 금액 기준</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="after" id="taxAfter" />
                <Label htmlFor="taxAfter">세후 금액 기준</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleReset} className="w-full">초기화</Button>
        </div>
      }
      resultSection={
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">계산 결과</h2>
          <div className="bg-gray-100 p-4 rounded-md space-y-2">
            <p><strong>월 급여 (세전):</strong> {monthlySalary.toLocaleString()} 원</p>
            <p><strong>국민연금:</strong> {nationalPension.toLocaleString()} 원</p>
            <p><strong>건강보험:</strong> {healthInsurance.toLocaleString()} 원</p>
            <p><strong>장기요양보험:</strong> {longTermCareInsurance.toLocaleString()} 원</p>
            <p><strong>고용보험:</strong> {employmentInsurance.toLocaleString()} 원</p>
            <p><strong>소득세:</strong> {incomeTax.toLocaleString()} 원</p>
            <p><strong>지방소득세:</strong> {localIncomeTax.toLocaleString()} 원</p>
            <p><strong>총 공제액:</strong> {totalDeductions.toLocaleString()} 원</p>
            <p className="text-xl font-bold">실수령액: {actualMonthlySalary.toLocaleString()} 원</p>
          </div>
        </div>
      }
      infoSection={{
        calculatorDescription: (
          <div>
            <p>급여 계산기는 월 급여를 기준으로 4대 보험 및 소득세, 지방소득세를 계산하여 실수령액을 알려줍니다.</p>
            <p>세금 계산 기준을 세전 또는 세후 금액으로 선택할 수 있습니다.</p>
          </div>
        ),
        calculationFormula: (
          <div>
            <p><strong>국민연금:</strong> 월 급여 × 4.5%</p>
            <p><strong>건강보험:</strong> 월 급여 × 3.545%</p>
            <p><strong>장기요양보험:</strong> 건강보험료 × 12.95%</p>
            <p><strong>고용보험:</strong> 월 급여 × 0.9%</p>
            <p><strong>소득세:</strong> (월 급여 - 총 사회보험료) × 소득세율 (세전 기준)</p>
            <p><strong>지방소득세:</strong> 소득세 × 10%</p>
            <p><strong>총 공제액:</strong> 국민연금 + 건강보험 + 장기요양보험 + 고용보험 + 소득세 + 지방소득세</p>
            <p><strong>실수령액:</strong> 월 급여 - 총 공제액</p>
          </div>
        ),
        usefulTips: (
          <div>
            <p>연말정산을 통해 세금을 환급받을 수 있습니다.</p>
            <p>개인연금, 퇴직연금 등을 활용하여 노후를 대비하세요.</p>
          </div>
        ),
      }}
    />
  );
}