'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

const CompoundInterestCalculator: NextPage = () => {
  const [principal, setPrincipal] = useState<number>(10000000)
  const [rate, setRate] = useState<number>(5)
  const [years, setYears] = useState<number>(10)
  const [contribution, setContribution] = useState<number>(0)
  const [compounding, setCompounding] = useState<number>(12) // Monthly
  const [view, setView] = useState('table')

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value.replace(/,/g, ''));
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const { futureValue, totalInterest, totalPrincipal, totalInvestment, interestRateOnPrincipal, interestRateOnFutureValue, chartData, error } = useMemo(() => {
    const p = principal;
    const r = rate / 100;
    const t = years;
    const c = contribution;
    const n = compounding;

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n) || isNaN(c)) {
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "모든 필드를 올바르게 입력해주세요." };
    }
    if (p <= 0) {
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "원금은 0보다 커야 합니다." };
    }
    if (t <= 0) {
        return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "기간은 0보다 커야 합니다." };
    }

    let fv = p * Math.pow(1 + r / n, n * t);
    if (c > 0) {
        fv += c * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    }

    const finalTotalPrincipal = p + (c * n * t); // 월납입액 기준이 아닌, 총 납입 횟수 기준
    const finalTotalInterest = fv - finalTotalPrincipal;

    const totalInvestment = p + (c * n * t);
    const interestRateOnPrincipal = (finalTotalInterest / p) * 100;
    const interestRateOnFutureValue = (finalTotalInterest / fv) * 100;

    const data = Array.from({ length: t + 1 }, (_, i) => {
      const year = i;
      let yearEndValue = p * Math.pow(1 + r / n, n * year);
      if (c > 0) {
        yearEndValue += c * ((Math.pow(1 + r / n, n * year) - 1) / (r / n));
      }
      return {
        year: `${year}년차`,
        자산가치: Math.round(yearEndValue),
      };
    });

    return {
      futureValue: Math.round(fv),
      totalInterest: Math.round(finalTotalInterest),
      totalPrincipal: Math.round(finalTotalPrincipal),
      totalInvestment: Math.round(totalInvestment),
      interestRateOnPrincipal: interestRateOnPrincipal,
      interestRateOnFutureValue: interestRateOnFutureValue,
      chartData: data,
      error: null
    };
  }, [principal, rate, years, contribution, compounding]);

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error)
    } else if (futureValue !== null && totalInvestment !== null && interestRateOnPrincipal !== null && interestRateOnFutureValue !== null) {
      toast.success('복리 계산이 완료되었습니다.')
    }
  }, [futureValue, error]);

  const inputSection = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="principal">초기 원금 (원)</Label>
        <Input
          id="principal"
          value={principal.toLocaleString()}
          onChange={handleInputChange(setPrincipal)}
          placeholder="예: 10,000,000"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contribution">월 추가납입액 (원)</Label>
        <Input
          id="contribution"
          value={contribution.toLocaleString()}
          onChange={handleInputChange(setContribution)}
          placeholder="없으면 0 입력"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rate">연이율 (%)</Label>
        <Input
          id="rate"
          value={rate.toLocaleString()}
          onChange={handleInputChange(setRate)}
          placeholder="예: 5"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="years">투자 기간 (년)</Label>
        <Input
          id="years"
          value={years.toLocaleString()}
          onChange={handleInputChange(setYears)}
          placeholder="예: 10"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="compounding">복리 계산 주기</Label>
        <Select
          value={String(compounding)}
          onValueChange={(value) => setCompounding(parseFloat(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">매년</SelectItem>
            <SelectItem value="2">6개월</SelectItem>
            <SelectItem value="4">분기</SelectItem>
            <SelectItem value="12">매월</SelectItem>
            <SelectItem value="365">매일</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleCalculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  const resultSection = (
    <div className="flex flex-col justify-center h-full space-y-4">
      {futureValue !== null && totalInterest !== null && totalPrincipal !== null && totalInvestment !== null && interestRateOnPrincipal !== null && interestRateOnFutureValue !== null ? (
        <>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">미래 총 자산</p>
            <p className="text-3xl font-bold">{futureValue.toLocaleString()}원</p>
          </div>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-sm text-muted-foreground">총 원금</p>
              <p className="font-semibold">{totalPrincipal.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 투자 원금</p>
              <p className="font-semibold">{totalInvestment.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 이자</p>
              <p className="font-semibold">{totalInterest.toLocaleString()}원</p>
            </div>
          </div>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-sm text-muted-foreground">원금 대비 총 이자율</p>
              <p className="font-semibold">{interestRateOnPrincipal.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">미래 총 자산 대비 이자 비율</p>
              <p className="font-semibold">{interestRateOnFutureValue.toFixed(2)}%</p>
            </div>
          </div>
          <ToggleGroup type="single" value={view} onValueChange={setView} className="justify-center pt-4">
            <ToggleGroupItem value="table">표</ToggleGroupItem>
          <ToggleGroupItem value="chart">차트</ToggleGroupItem>
          </ToggleGroup>
          <div className={`w-full h-80 ${view === 'table' ? 'overflow-y-auto' : ''}`}>
            {view === 'chart' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => value.toLocaleString()} />
                  <RechartsTooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
                  <Legend wrapperStyle={{ position: 'relative' }} />
                  <Line type="monotone" dataKey="자산가치" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>년차</TableHead>
                    <TableHead className="text-right">자산가치</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((data) => (
                    <TableRow key={data.year}>
                      <TableCell>{data.year}</TableCell>
                      <TableCell className="text-right">{data.자산가치.toLocaleString()}원</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground h-full flex items-center justify-center">
          계산 정보를 입력하고 계산하기 버튼을 눌러주세요.
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <p>
        복리는 원금뿐만 아니라 발생한 이자에도 이자가 붙는 방식입니다. 시간이 지남에 따라 자산이 기하급수적으로 증가하는 효과, 즉 &apos;돈이 돈을 버는&apos; 구조를 만듭니다. &apos;투자의 마법&apos;이라고도 불리는 이유입니다.
      </p>
    ),
    calculationFormula: (
      <>
        <p>복리 계산은 다음 공식을 사용하여 계산됩니다:</p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          FV = P * (1 + r/n)^(n*t) + C * [ ((1 + r/n)^(n*t) - 1) / (r/n) ]
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><b>FV</b>: 미래 가치 (Future Value)</li>
          <li><b>P</b>: 초기 원금 (Principal)</li>
          <li><b>C</b>: 정기적인 추가 납입액 (Contribution)</li>
          <li><b>r</b>: 연이율 (Annual interest rate)</li>
          <li><b>n</b>: 연간 복리 계산 횟수 (Number of times interest is compounded per year)</li>
          <li><b>t</b>: 투자 기간 (년) (Number of years)</li>
        </ul>
      </>
    ),
    usefulTips: (
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><strong>장기 투자의 중요성:</strong> 복리 효과는 시간이 지날수록 극대화됩니다. 장기적인 관점에서 꾸준히 투자하는 것이 중요합니다.</li>
        <li><strong>높은 수익률의 힘:</strong> 수익률이 높을수록 복리 효과는 더욱 강력해집니다. 하지만 높은 수익률은 높은 위험을 동반한다는 점을 기억해야 합니다.</li>
        <li><strong>꾸준한 추가 납입:</strong> 매월 꾸준히 추가 납입을 하면 목표 금액에 더 빨리 도달할 수 있습니다.</li>
        <li><strong>세금 고려:</strong> 이자 소득에 대한 세금(일반적으로 15.4%)을 고려해야 합니다. ISA(개인종합자산관리계좌) 등 절세 상품을 활용하면 수익률을 높일 수 있습니다.</li>
      </ul>
    ),
  };

  return (
    <CalculatorsLayout
      title="복리 계산기"
      description="시간의 마법, 복리의 힘을 직접 확인해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default CompoundInterestCalculator