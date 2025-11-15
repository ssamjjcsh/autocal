"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber, parseNumber } from "@/utils/formatNumber";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";

interface CalculationResult {
  year: number;
  principal: number;
  valuation: number;
  profit: number;
  rate: number;
}

export default function StockCompoundInterestCalculator() {
  const [initialInvestment, setInitialInvestment] = useState("10,000,000");
  const [monthlyInvestment, setMonthlyInvestment] = useState("500,000");
  const [annualReturn, setAnnualReturn] = useState("15");
  const [investmentPeriod, setInvestmentPeriod] = useState("20");
  const [results, setResults] = useState<CalculationResult[]>([]);

  const calculate = () => {
    const initial = parseNumber(initialInvestment);
    const monthly = parseNumber(monthlyInvestment);
    const annualRate = parseNumber(annualReturn) / 100;
    const period = parseNumber(investmentPeriod);

    if (isNaN(initial) || initial <= 0) {
      toast.error("초기 투자금을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(annualRate) || annualRate <= 0) {
      toast.error("연 수익률을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(period) || period <= 0) {
      toast.error("투자 기간을 올바르게 입력해주세요.");
      return;
    }

    let currentValuation = initial;
    let totalPrincipal = initial;
    const newResults: CalculationResult[] = [];

    for (let i = 1; i <= period; i++) {
      const annualInvestment = monthly * 12;
      totalPrincipal += annualInvestment;
      currentValuation = (currentValuation + annualInvestment) * (1 + annualRate);

      const profit = currentValuation - totalPrincipal;
      const rate = (profit / totalPrincipal) * 100;

      newResults.push({
        year: i,
        principal: Math.round(totalPrincipal),
        valuation: Math.round(currentValuation),
        profit: Math.round(profit),
        rate: parseFloat(rate.toFixed(2)),
      });
    }
    setResults(newResults);
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="initialInvestment">초기 투자금 (원)</Label>
        <Input
          id="initialInvestment"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(formatNumber(e.target.value))}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="monthlyInvestment">월 추가 투자금 (원)</Label>
        <Input
          id="monthlyInvestment"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(formatNumber(e.target.value))}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="annualReturn">연 수익률 (%)</Label>
        <Input
          id="annualReturn"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="investmentPeriod">투자 기간 (년)</Label>
        <Input
          id="investmentPeriod"
          value={investmentPeriod}
          onChange={(e) => setInvestmentPeriod(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <Button onClick={calculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="h-full w-full">
      {results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>기간</TableHead>
              <TableHead className="text-right">투자 원금</TableHead>
              <TableHead className="text-right">평가 금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.year}>
                <TableCell>{row.year}년</TableCell>
                <TableCell className="text-right">{formatNumber(row.principal)}원</TableCell>
                <TableCell className="text-right">{formatNumber(row.valuation)}원</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>계산 결과가 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        <p>주식 복리 계산기는 초기 투자금과 매월 적립하는 투자금을 바탕으로 미래의 자산 가치를 예측하는 데 도움을 줍니다. 연 수익률을 가정하여 복리 효과가 자산 증식에 얼마나 큰 영향을 미치는지 시뮬레이션할 수 있습니다.</p>
      </>
    ),
    calculationFormula: (
      <>
        <p>복리 계산 공식은 다음과 같습니다:</p>
        <p className="mt-2">최종 금액 = 초기 투자금 × (1 + 연 수익률)<sup>투자 기간</sup> + 월 투자금 × [((1 + 연 수익률)<sup>투자 기간</sup> - 1) / 연 수익률]</p>
      </>
    ),
    usefulTips: (
      <>
        <p><strong>사용 방법:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>초기 투자금:</strong> 투자를 시작하는 원금을 입력합니다.</li>
          <li><strong>월 추가 투자금:</strong> 매월 정기적으로 추가할 투자 금액을 입력합니다.</li>
          <li><strong>연 수익률:</strong> 기대하는 연간 투자 수익률을 % 단위로 입력합니다.</li>
          <li><strong>투자 기간:</strong> 투자를 지속할 기간을 년 단위로 입력합니다.</li>
        </ul>
        <p className="mt-2">'계산하기' 버튼을 클릭하면 기간별 투자 원금, 평가 금액, 수익금 및 수익률이 표로 제공됩니다.</p>
      </>
    )
  };

  return (
    <CalculatorsLayout
      title="주식 복리 계산기"
      description="장기 투자의 힘, 복리 효과를 직접 확인해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}