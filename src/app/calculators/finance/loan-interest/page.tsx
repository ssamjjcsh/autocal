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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

interface RepaymentDetail {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface ResultData {
  repaymentSchedule: RepaymentDetail[];
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  firstMonthPayment?: number;
  lastMonthPayment?: number;
  monthlyPayment?: number;
}

const LoanInterestCalculator: NextPage = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [results, setResults] = useState<{
    equalPrincipal: ResultData | null;
    equalTotal: ResultData | null;
    bullet: ResultData | null;
  } | null>(null);

  const calculationResults = useMemo(() => {
    const principal = loanAmount;
    const years = loanTerm;
    const annualRate = interestRate / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12;

    // 1. 원금 균등분할상환
    const principalPaymentPerMonth = principal / months;
    let remainingBalanceEP = principal;
    const scheduleEP: RepaymentDetail[] = [];
    let totalInterestEP = 0;
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalanceEP * monthlyRate;
      const totalPayment = principalPaymentPerMonth + interestPayment;
      remainingBalanceEP -= principalPaymentPerMonth;
      totalInterestEP += interestPayment;
      scheduleEP.push({
        month: i,
        principalPayment: principalPaymentPerMonth,
        interestPayment: interestPayment,
        totalPayment: totalPayment,
        remainingBalance: remainingBalanceEP < 0 ? 0 : remainingBalanceEP,
      });
    }

    // 2. 원리금 균등분할상환
    const monthlyPaymentET =
      principal *
      ((monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1));
    let remainingBalanceET = principal;
    const scheduleET: RepaymentDetail[] = [];
    let totalInterestET = 0;
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalanceET * monthlyRate;
      const principalPayment = monthlyPaymentET - interestPayment;
      remainingBalanceET -= principalPayment;
      totalInterestET += interestPayment;
      scheduleET.push({
        month: i,
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        totalPayment: monthlyPaymentET,
        remainingBalance: remainingBalanceET < 0 ? 0 : remainingBalanceET,
      });
    }

    // 3. 만기일시상환
    const interestPaymentB = principal * monthlyRate;
    const scheduleB: RepaymentDetail[] = [];
    for (let i = 1; i <= months; i++) {
      scheduleB.push({
        month: i,
        principalPayment: i === months ? principal : 0,
        interestPayment: interestPaymentB,
        totalPayment: i === months ? principal + interestPaymentB : interestPaymentB,
        remainingBalance: i === months ? 0 : principal,
      });
    }
    const totalInterestB = interestPaymentB * months;

    return {
      equalPrincipal: {
        repaymentSchedule: scheduleEP,
        totalPrincipal: principal,
        totalInterest: totalInterestEP,
        totalRepayment: principal + totalInterestEP,
        firstMonthPayment: scheduleEP[0]?.totalPayment,
        lastMonthPayment: scheduleEP[scheduleEP.length - 1]?.totalPayment,
      },
      equalTotal: {
        repaymentSchedule: scheduleET,
        totalPrincipal: principal,
        totalInterest: totalInterestET,
        totalRepayment: principal + totalInterestET,
        monthlyPayment: monthlyPaymentET,
      },
      bullet: {
        repaymentSchedule: scheduleB,
        totalPrincipal: principal,
        totalInterest: totalInterestB,
        totalRepayment: principal + totalInterestB,
        monthlyPayment: interestPaymentB,
      },
    };
  }, [loanAmount, loanTerm, interestRate]);

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
        <Label htmlFor="loanAmount">대출 원금 (원)</Label>
        <Input
          id="loanAmount"
          value={loanAmount.toLocaleString()}
          onChange={(e) => setLoanAmount(parseFloat(e.target.value.replace(/,/g, '')))}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="loanTerm">대출 기간 (년)</Label>
        <Input
          id="loanTerm"
          value={loanTerm}
          onChange={(e) => setLoanTerm(parseFloat(e.target.value))}
          className="text-right"
          type="number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interestRate">연 이자율 (%)</Label>
        <Input
          id="interestRate"
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          className="text-right"
          type="number"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const renderResultTab = (title: string, data: ResultData | null) => {
    if (!data) return null;
    return (
      <TabsContent value={title}>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium">총 대출 원금</div>
              <div className="text-right">{data.totalPrincipal.toLocaleString()}원</div>
              <div className="font-medium">총 이자</div>
              <div className="text-right text-red-600">{data.totalInterest.toLocaleString()}원</div>
              <div className="font-medium">총 상환금액</div>
              <div className="text-right font-bold">{data.totalRepayment.toLocaleString()}원</div>
              {data.monthlyPayment && (
                <>
                  <div className="font-medium">
                    {title === '만기일시상환' ? '월 이자상환액' : '월 상환금'}
                  </div>
                  <div className="text-right font-bold text-blue-600">
                    {data.monthlyPayment.toLocaleString()}원
                  </div>
                </>
              )}
              {data.firstMonthPayment && data.lastMonthPayment && (
                <>
                  <div className="font-medium">초회차 상환금</div>
                  <div className="text-right">{data.firstMonthPayment.toLocaleString()}원</div>
                  <div className="font-medium">최종회차 상환금</div>
                  <div className="text-right">{data.lastMonthPayment.toLocaleString()}원</div>
                </>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>회차</TableHead>
                    <TableHead>월 상환금</TableHead>
                    <TableHead>상환 원금</TableHead>
                    <TableHead>상환 이자</TableHead>
                    <TableHead>대출 잔액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.repaymentSchedule.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell>{item.month}</TableCell>
                      <TableCell>{item.totalPayment.toLocaleString()}</TableCell>
                      <TableCell>{item.principalPayment.toLocaleString()}</TableCell>
                      <TableCell>{item.interestPayment.toLocaleString()}</TableCell>
                      <TableCell>{item.remainingBalance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  };

  const resultSection = (
    <>
      {results ? (
        <Tabs defaultValue="원리금 균등상환">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="원리금 균등상환">원리금 균등</TabsTrigger>
            <TabsTrigger value="원금 균등상환">원금 균등</TabsTrigger>
            <TabsTrigger value="만기일시상환">만기일시</TabsTrigger>
          </TabsList>
          {renderResultTab('원리금 균등상환', results.equalTotal)}
          {renderResultTab('원금 균등상환', results.equalPrincipal)}
          {renderResultTab('만기일시상환', results.bullet)}
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          입력 후 계산하기 버튼을 눌러주세요.
        </div>
      )}
    </>
  );

  const infoSection = {
    calculatorDescription: "대출 원금, 기간, 이자율을 입력하여 상환 방식에 따른 월 상환금과 총 이자를 비교해보세요. 원리금 균등, 원금 균등, 만기일시상환 방식을 지원합니다.",
    calculationFormula: (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>원리금 균등분할상환</AccordionTrigger>
                <AccordionContent>
                    <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">월 상환금 = P * [r(1+r)^n] / [(1+r)^n - 1]</p>
                    <p className="text-xs">P: 대출원금, r: 월이율, n: 총 상환 개월 수</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>원금 균등분할상환</AccordionTrigger>
                <AccordionContent>
                    <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">월 원금 상환액 = P / n</p>
                    <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">월 이자 = (P - (k-1) * (P/n)) * r</p>
                    <p className="text-xs">k: 현재 상환 회차</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>만기일시상환</AccordionTrigger>
                <AccordionContent>
                    <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">월 이자 = P * r</p>
                    <p className="text-xs">만기일에 원금 전액 상환</p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    usefulTips: "원금 균등상환 방식이 총 이자 부담이 가장 적지만 초기 상환 부담이 큽니다. 원리금 균등상환은 매월 동일한 금액을 상환하여 계획적인 자금 관리에 유리합니다. 만기일시상환은 월 부담이 가장 적지만 총 이자 비용은 가장 높습니다. 자신의 자금 상황에 맞는 상환 방식을 선택하는 것이 중요합니다."
  };

  return (
    <CalculatorsLayout
      title="대출 이자 계산기"
      description="대출 상환 방식에 따른 월 상환금과 총 이자를 비교 분석합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default LoanInterestCalculator;