'use client'

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function LevelPaymentPage() {
  const [loanAmount, setLoanAmount] = useState<string>('100000000');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const calculateAmortization = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanTerm, 10);
    const annualRate = parseFloat(interestRate) / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalRepayment = monthlyPayment * months;
    const totalInterest = totalRepayment - principal;

    let remainingBalance = principal;
    const repaymentSchedule: RepaymentDetail[] = [];
    const chartData: ChartData[] = [];

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      repaymentSchedule.push({
        month: i,
        principalPayment: Math.round(principalPayment),
        interestPayment: Math.round(interestPayment),
        totalPayment: Math.round(monthlyPayment),
        remainingBalance: Math.round(remainingBalance < 0 ? 0 : remainingBalance),
      });
      
      if (i % 12 === 0 || i === 1 || i === months) {
        chartData.push({
            month: i,
            '월 상환금': parseFloat(monthlyPayment.toFixed(0)),
            '상환 원금': parseFloat(principalPayment.toFixed(0)),
            '상환 이자': parseFloat(interestPayment.toFixed(0)),
        });
      }
    }

    return {
      repaymentSchedule,
      totalPrincipal: principal,
      totalInterest: totalInterest,
      totalRepayment: totalRepayment,
      monthlyPayment: monthlyPayment,
      chartData,
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    const results = calculateAmortization;
    if (results) {
        setCalculationResults(results);
        toast.success("계산이 완료되었습니다.");
    } else {
        setCalculationResults(null);
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
                    <span className="text-muted-foreground">월 상환금</span>
                    <span className="font-bold text-lg">{formatNumber(calculationResults.monthlyPayment)} 원</span>
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
            <Tabs defaultValue="chart" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart">차트</TabsTrigger>
                    <TabsTrigger value="details">월별 상세 내역</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={calculationResults.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
                                <Legend />
                                <Line type="monotone" dataKey="월 상환금" stroke="#8884d8" />
                                <Line type="monotone" dataKey="상환 원금" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="상환 이자" stroke="#ffc658" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </TabsContent>
                <TabsContent value="details">
                    <div className="overflow-x-auto max-h-[400px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center w-[60px]">개월</TableHead>
                                    <TableHead className="text-center">상환<br />원금</TableHead>
                                    <TableHead className="text-center">상환<br />이자</TableHead>
                                    <TableHead className="text-center">총<br />상환금</TableHead>
                                    <TableHead className="text-center">대출 잔액</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {calculationResults.repaymentSchedule.map((data: RepaymentDetail) => (
                                    <TableRow key={data.month}>
                                        <TableCell className="text-center whitespace-nowrap w-[60px]">{data.month}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.principalPayment)}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.interestPayment)}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.totalPayment)}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.remainingBalance)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
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
        <p>원리금 균등분할상환은 대출 기간 동안 매월 동일한 금액을 상환하는 방식입니다. 매월 상환하는 금액(원리금)은 대출 원금과 이자의 합으로 구성됩니다.</p>
        <p className="mt-2">상환 초기에는 이자가 차지하는 비중이 높고 원금 상환 비중은 낮지만, 시간이 지남에 따라 이자 비중은 점차 줄어들고 원금 상환 비중은 늘어나는 특징이 있습니다. 매월 상환액이 일정하여 자금 계획을 세우기 용이하다는 장점이 있습니다.</p>
      </>
    ),
    calculationFormula: (
      <>
        <p>월 상환금 = [대출 원금 × (월 이자율 × (1 + 월 이자율)^대출 기간(월))] ÷ [(1 + 월 이자율)^대출 기간(월) - 1]</p>
        <p>월 이자 = 대출 잔액 × 월 이자율</p>
        <p>월 상환 원금 = 월 상환금 - 월 이자</p>
      </>
    ),
    usefulTips: (
      <>
        <p>• 원리금 균등분할상환 방식은 매월 상환액이 일정하여 재정 계획을 세우기 편리합니다.</p>
        <p>• 총 상환 이자 금액은 원금 균등분할상환 방식보다 많습니다.</p>
        <p>• 초기 상환 부담이 원금 균등분할상환 방식보다 적어 대출 초기에 자금 여유가 부족한 경우에 적합합니다.</p>
      </>
    )
  };

  return (
    <CalculatorsLayout
      title="원리금 균등 분할 상환 계산기"
      description="매월 동일한 금액을 상환하는 원리금 균등 분할 상환 방식의 월 상환금, 총 이자, 상환 스케줄을 계산합니다."
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={InfoSection}
    />
  );
}

