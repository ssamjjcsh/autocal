'use client'

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from '@/utils/formatNumber';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

interface RepaymentDetail {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface ChartData {
    month: number;
    '월 상환금': number;
    '상환 원금': number;
    '상환 이자': number;
}

export default function PrincipalEqualAmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('100000000');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [calculationResults, setCalculationResults] = useState<any>(null); // 초기값을 null로 설정

  const calculateAmortization = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanTerm, 10);
    const annualRate = parseFloat(interestRate) / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyPrincipalPayment = principal / months;
    const monthlyRate = annualRate / 12;

    let remainingBalance = principal;
    const repaymentSchedule: RepaymentDetail[] = [];
    const chartData: ChartData[] = [];
    let totalInterest = 0;

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const totalPayment = monthlyPrincipalPayment + interestPayment;
      remainingBalance -= monthlyPrincipalPayment;
      totalInterest += interestPayment;

      repaymentSchedule.push({
        month: i,
        principalPayment: monthlyPrincipalPayment,
        interestPayment: interestPayment,
        totalPayment: totalPayment,
        remainingBalance: remainingBalance < 0 ? 0 : remainingBalance,
      });
      
      if (i % 12 === 0 || i === 1 || i === months) {
        chartData.push({
            month: i,
            '월 상환금': parseFloat(totalPayment.toFixed(0)),
            '상환 원금': parseFloat(monthlyPrincipalPayment.toFixed(0)),
            '상환 이자': parseFloat(interestPayment.toFixed(0)),
        });
      }
    }

    return {
      repaymentSchedule,
      totalPrincipal: principal,
      totalInterest: totalInterest,
      totalRepayment: principal + totalInterest,
      chartData,
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    const results = calculateAmortization; // useMemo로 계산된 값을 가져옴
    if (results) {
        setCalculationResults(results); // 계산 결과를 상태에 저장
        toast.success("계산이 완료되었습니다.");
    } else {
        setCalculationResults(null); // 유효하지 않은 경우 결과 초기화
        toast.error("올바른 대출 정보를 입력해주세요.");
    }
  };

  const LeftColumn = (
    <>
      <CardHeader>
        <CardTitle>대출 정보 입력</CardTitle>
        <CardDescription>대출 원금, 기간, 이자율을 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loanAmount">대출 원금 (원)</Label>
          <Input id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="예: 100,000,000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loanTerm">대출 기간 (년)</Label>
          <Input id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="예: 30" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interestRate">연 이자율 (%)</Label>
          <Input id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="예: 4.5" />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCalculate} className="w-full">계산하기</Button>
      </CardFooter>
    </>
  );

  const RightColumn = (
    <>
      {calculationResults ? (
        <>
            <CardHeader>
                <CardTitle>계산 결과 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">총 대출 원금</span>
                    <span className="font-bold text-lg">{formatNumber(calculationResults.totalPrincipal)} 원</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">총 상환 이자</span>
                    <Badge variant="destructive" className="text-lg">{formatNumber(calculationResults.totalInterest)} 원</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-xl font-semibold">
                    <span>총 상환 금액</span>
                    <span className="text-blue-600">{formatNumber(calculationResults.totalRepayment)} 원</span>
                </div>
            </CardContent>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-full">
          계산하기 버튼을 눌러주세요
        </div>
      )}
    </>
  );

  const InfoSection = {
    calculatorDescription: (
      <>
        <p>원금 균등분할상환은 대출 원금을 대출 기간 동안 매달 동일한 금액으로 나누어 상환하고, 이자는 매달 남은 대출 잔액에 대해 계산하여 함께 상환하는 방식입니다. 이 방식의 가장 큰 특징은 매달 상환하는 원금이 일정하다는 점입니다. 따라서 대출 초기에는 이자 부담이 크지만, 시간이 지남에 따라 대출 잔액이 줄어들면서 이자도 함께 줄어들어 월 상환금액이 점차 감소합니다.</p>
      </>
    ),
    calculationFormula: (
      <>
        <p>월 상환 원금 = 대출 원금 ÷ 대출 기간(월)</p>
        <p>월 이자 = 대출 잔액 × (연 이자율 ÷ 12)</p>
        <p>월 상환금 = 월 상환 원금 + 월 이자</p>
      </>
    ),
    usefulTips: (
      <>
        <p>• 원금 균등분할상환 방식은 총 상환 이자 금액이 원리금 균등분할상환 방식보다 적습니다.</p>
        <p>• 대출 초기에는 이자 부담이 크므로 여유 자금이 충분한 경우에 적합합니다.</p>
        <p>• 시간이 지날수록 월 상환금이 감소하므로 장기적으로 재정 부담이 줄어듭니다.</p>
      </>
    )
  };

  return (
    <CalculatorsLayout
      title="원금 균등 분할 상환 계산기"
      description="매월 동일한 원금을 상환하는 원금 균등 분할 상환 방식의 월 상환금, 총 이자, 상환 스케줄을 계산합니다."
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={InfoSection}
    />
  );
}