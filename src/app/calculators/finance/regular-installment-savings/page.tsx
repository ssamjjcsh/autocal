"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatNumber, parseNumber } from "@/utils/formatNumber";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";

export default function RegularInstallmentSavings() {
  const [monthlyDeposit, setMonthlyDeposit] = useState("100,000");
  const [interestRate, setInterestRate] = useState("3");
  const [period, setPeriod] = useState("12");
  const [interestType, setInterestType] = useState<"simple" | "compound">("simple");
  const [taxation, setTaxation] = useState<"general" | "preferential" | "non-taxable">("general");
  const [result, setResult] = useState({
    principal: 0,
    interest: 0,
    total: 0,
  });

  const handleCalculate = () => {
    const principalAmount = parseNumber(monthlyDeposit);
    const rate = parseNumber(interestRate) / 100;
    const months = parseNumber(period);

    if (isNaN(principalAmount) || principalAmount <= 0) {
      toast.error("월 적립액을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(rate) || rate <= 0) {
      toast.error("연 이자율을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(months) || months <= 0) {
      toast.error("적립 기간을 올바르게 입력해주세요.");
      return;
    }

    let totalInterest = 0;
    const principal = principalAmount * months;

    if (interestType === "simple") {
      totalInterest = (principalAmount * (months * (months + 1)) / 2) * (rate / 12);
    } else { // compound
      let futureValue = 0;
      for (let i = 0; i < months; i++) {
        futureValue = (futureValue + principalAmount) * (1 + rate / 12);
      }
      totalInterest = futureValue - principal;
    }
    
    let taxRate = 0;
    if (taxation === "general") {
      taxRate = 0.154;
    } else if (taxation === "preferential") {
      taxRate = 0.095;
    }

    const tax = totalInterest * taxRate;
    const interestAfterTax = totalInterest - tax;
    const total = principal + interestAfterTax;

    setResult({
      principal: principal,
      interest: interestAfterTax,
      total: total,
    });
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="monthlyDeposit">월 적립액 (원)</Label>
        <Input
          id="monthlyDeposit"
          value={monthlyDeposit}
          onChange={(e) => setMonthlyDeposit(formatNumber(e.target.value))}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="interestRate">연 이자율 (%)</Label>
        <Input
          id="interestRate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="period">적립 기간 (개월)</Label>
        <Input
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label>이자 계산 방식</Label>
        <Select onValueChange={(value: "simple" | "compound") => setInterestType(value)} defaultValue={interestType}>
          <SelectTrigger>
            <SelectValue placeholder="이자 계산 방식 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">단리</SelectItem>
            <SelectItem value="compound">월복리</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>과세 옵션</Label>
        <RadioGroup defaultValue={taxation} onValueChange={(value: "general" | "preferential" | "non-taxable") => setTaxation(value)} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" />
            <Label htmlFor="general">일반과세 (15.4%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="preferential" id="preferential" />
            <Label htmlFor="preferential">세금우대 (9.5%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non-taxable" id="non-taxable" />
            <Label htmlFor="non-taxable">비과세</Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="text-center">
      {result.total > 0 ? (
        <div className="space-y-4">
          <div>
            <p className="text-lg">만기 시 총 수령액</p>
            <p className="text-3xl font-bold">{formatNumber(Math.round(result.total))}원</p>
          </div>
          <div className="flex justify-around text-left w-full">
            <div>
              <p>원금 합계</p>
              <p>{formatNumber(Math.round(result.principal))}원</p>
            </div>
            <div>
              <p>세후 이자</p>
              <p>{formatNumber(Math.round(result.interest))}원</p>
            </div>
          </div>
        </div>
      ) : (
        <p>계산 결과가 여기에 표시됩니다.</p>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: "정기적금 계산기는 매월 일정한 금액을 정해진 기간 동안 저축하여 목돈을 만드는 금융 상품의 수익을 계산해주는 도구입니다. 계약된 이율에 따라 이자가 발생하며, 만기 시 원금과 이자를 함께 수령할 수 있습니다.",
    calculationFormula: "단리: 이자 = (월 적립액 × (개월수 × (개월수 + 1)) / 2) × (연 이자율 / 12)\n복리: 미래가치 = (이전 잔액 + 월 적립액) × (1 + 연 이자율 / 12)",
    usefulTips: "정기적금은 매월 꾸준히 저축하는 습관을 들이는 데 도움이 됩니다. 단리는 원금에 대해서만 이자를 계산하는 방식이고, 복리는 원금과 발생한 이자를 합한 금액에 대해 다시 이자를 계산하는 방식으로 시간이 지날수록 이자가 더 많이 붙게 됩니다. 과세 옵션에 따라 실제 수령액이 달라질 수 있으니 주의가 필요합니다."
  };

  return (
    <CalculatorsLayout
      title="정기적금 계산기"
      description="매월 꾸준히 모아 목돈을 만들어보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}