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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

const MonthlyCompoundSavingsCalculator: NextPage = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(0)
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100000)
  const [months, setMonths] = useState<number>(12)
  const [annualRate, setAnnualRate] = useState<number>(5)
  const [depositTiming, setDepositTiming] = useState<'start' | 'end'>('end') // 월초 또는 월말

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value.replace(/,/g, ''));
    setter(isNaN(parsedValue) ? 0 : parsedValue);

  };

  const [hasCalculated, setHasCalculated] = useState<boolean>(false)

  const { futureValue, totalInterest, totalPrincipal, chartData, error } = useMemo(() => {
    const p = initialInvestment;
    const m = monthlyDeposit;
    const t = months;
    const r = annualRate / 100;
    const isStartOfMonth = depositTiming === 'start';

    if (isNaN(p) || isNaN(m) || isNaN(t) || isNaN(r)) {
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "모든 필드를 올바르게 입력해주세요." };
    }
    if (t <= 0) {
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "투자기간은 0보다 커야 합니다." };
    }

    const monthlyRate = r / 12;

    let calculatedFV = p * Math.pow(1 + monthlyRate, t);
    if (m > 0) {
      if (isStartOfMonth) {
        calculatedFV += m * ((Math.pow(1 + monthlyRate, t) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        calculatedFV += m * ((Math.pow(1 + monthlyRate, t) - 1) / monthlyRate);
      }
    }

    const finalTotalPrincipal = p + (m * t);
    const finalTotalInterest = calculatedFV - finalTotalPrincipal;

    const data = Array.from({ length: t + 1 }, (_, i) => {
      const currentMonth = i;
      let principalAtMonth = p + (m * currentMonth);
      let monthEndValue = p * Math.pow(1 + monthlyRate, currentMonth);
      if (m > 0 && currentMonth > 0) {
        if (isStartOfMonth) {
          monthEndValue += m * ((Math.pow(1 + monthlyRate, currentMonth) - 1) / monthlyRate) * (1 + monthlyRate);
        } else {
          monthEndValue += m * ((Math.pow(1 + monthlyRate, currentMonth) - 1) / monthlyRate);
        }
      }
      const monthlyInterest = monthEndValue - principalAtMonth;

      return {
        month: `${currentMonth}개월차`,
        원금: Math.round(principalAtMonth),
        월별이자: Math.round(monthlyInterest),
        이자포함원금: Math.round(monthEndValue),
      };
    });

    return {
      futureValue: Math.round(calculatedFV),
      totalInterest: Math.round(finalTotalInterest),
      totalPrincipal: Math.round(finalTotalPrincipal),
      chartData: data,
      error: null
    };
  }, [initialInvestment, monthlyDeposit, months, annualRate, depositTiming]);

  React.useEffect(() => {
    if (hasCalculated) {
      if (error) {
        toast.error(error);
      } else if (!error) {
        toast.success('월 복리 적금 계산이 완료되었습니다.');
      }
    }
  }, [hasCalculated, futureValue, error]);

  const handleCalculate = useCallback(() => {
    setHasCalculated(true)
  }, [])

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="initialInvestment">초기 투자금 (원)</Label>
        <Input
          id="initialInvestment"
          value={initialInvestment.toLocaleString()}
          onChange={handleInputChange(setInitialInvestment)}
          placeholder="예: 0"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyDeposit">월 적립금 (원)</Label>
        <Input
          id="monthlyDeposit"
          value={monthlyDeposit.toLocaleString()}
          onChange={handleInputChange(setMonthlyDeposit)}
          placeholder="예: 100,000"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="months">투자기간 (개월)</Label>
        <Input
          id="months"
          value={months.toLocaleString()}
          onChange={handleInputChange(setMonths)}
          placeholder="예: 12"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRate">연 이자율 (%)</Label>
        <Input
          id="annualRate"
          value={annualRate.toLocaleString()}
          onChange={handleInputChange(setAnnualRate)}
          placeholder="예: 5"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="depositTiming">적립 시점</Label>
        <ToggleGroup type="single" value={depositTiming} onValueChange={(value: 'start' | 'end') => setDepositTiming(value)} className="w-full">
          <ToggleGroupItem value="start" className="flex-1">월초</ToggleGroupItem>
          <ToggleGroupItem value="end" className="flex-1">월말</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  const resultSection = (
    <div className="flex flex-col justify-center h-full space-y-2">
      {hasCalculated && !error ? (
        <>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">총 원금</span>
              <span className="text-lg font-bold">{totalPrincipal?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">총 이자 (세전)</span>
              <span className="text-lg font-bold text-green-600">{totalInterest?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">만기지급금액</span>
              <span className="text-2xl font-extrabold text-primary">{futureValue?.toLocaleString()}원</span>
            </div>
          </div>
          <Tabs defaultValue="chart" className="w-full mt-2 border-b">
            <TabsList>
              <TabsTrigger value="chart">차트</TabsTrigger>
              <TabsTrigger value="details">월별 상세 내역</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => value.toLocaleString()} />
                    <RechartsTooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
                    <Legend wrapperStyle={{ position: 'relative' }} />
                    <Line type="monotone" dataKey="원금" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="이자포함원금" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>개월차</TableHead>
                      <TableHead className="text-right">원금</TableHead>
                      <TableHead className="text-right">이자 (세전)</TableHead>
                      <TableHead className="text-right">이자포함원금</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chartData.map((data) => (
                      <TableRow key={data.month}>
                        <TableCell>{data.month}</TableCell>
                        <TableCell className="text-right">{data.원금.toLocaleString()}원</TableCell>
              <TableCell className="text-right">{data.월별이자.toLocaleString()}원</TableCell>
              <TableCell className="text-right">{data.이자포함원금.toLocaleString()}원</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
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
        월 복리 적금은 매월 꾸준히 일정 금액을 저축하고, 원금과 이자에 다시 이자가 붙는 복리 방식으로 자산을 불려나가는 금융 상품입니다. 이 계산기는 매월 적립하는 금액과 초기 투자금, 투자 기간, 연 이자율을 바탕으로 만기 시 예상되는 총 금액을 계산하여 효과적인 재정 계획 수립을 돕습니다.
      </p>
    ),
    calculationFormula: (
      <>
        <p>월 복리 적금의 만기지급금액은 다음 공식을 사용하여 계산됩니다:</p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          FV = P * (1 + r/12)^t + M * [ ((1 + r/12)^t - 1) / (r/12) ] * (1 + (r/12 * k))
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><b>FV</b>: 미래 가치 (만기지급금액)</li>
          <li><b>P</b>: 초기 투자금</li>
          <li><b>M</b>: 월 적립금</li>
          <li><b>r</b>: 연 이자율 (소수점 형태, 예: 5%는 0.05)</li>
          <li><b>t</b>: 투자 기간 (개월)</li>
          <li><b>k</b>: 적립 시점 (월초 = 1, 월말 = 0)</li>
        </ul>
        <p className="mt-2">총 원금 = 초기 투자금 + (월 적립금 × 투자 기간)</p>
        <p>총 이자 = 만기지급금액 - 총 원금</p>
      </>
    ),
    usefulTips: (
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><strong>꾸준함의 힘:</strong> 월 복리 적금은 꾸준히 납입할수록 복리 효과가 극대화됩니다. 소액이라도 꾸준히 저축하는 습관이 중요합니다.</li>
        <li><strong>장기 투자의 중요성:</strong> 복리는 시간이 길어질수록 그 효과가 더욱 커집니다. 단기적인 수익보다는 장기적인 관점에서 접근하는 것이 유리합니다.</li>
        <li><strong>적립 시점의 중요성:</strong> 월초에 적립하는 것이 월말에 적립하는 것보다 한 달치 이자를 더 받을 수 있어 유리합니다. 작은 차이지만 장기적으로는 무시할 수 없는 차이를 만듭니다.</li>
        <li><strong>세금 우대 상품 활용:</strong> 이자 소득에 대한 세금을 절감할 수 있는 비과세 또는 세금 우대 상품(예: ISA, 연금저축)을 활용하면 실질 수익률을 높일 수 있습니다.</li>
        <li><strong>금리 비교:</strong> 같은 월 복리 적금이라도 금융기관별로 금리가 다를 수 있습니다. 여러 금융기관의 상품을 비교하여 가장 높은 금리를 제공하는 곳을 선택하는 것이 좋습니다.</li>
      </ul>
    ),
  };

  return (
    <CalculatorsLayout
      title="월 복리 적금 계산기"
      description="매월 꾸준히 모아 목돈을 만드는 월 복리 적금, 만기 예상 금액을 확인해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default MonthlyCompoundSavingsCalculator