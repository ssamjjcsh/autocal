"use client"

import React, { useState, useMemo, createContext } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { round } from 'mathjs'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  PieChart,
  Pie,
  PieLabelRenderProps,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

const COLORS = ['#0088FE', '#FF8042']

const InstallmentInterestCalculator: NextPage = () => {
  const [principal, setPrincipal] = useState<number>(1000000)
  const [months, setMonths] = useState<number>(12)
  const [annualRate, setAnnualRate] = useState<number>(5)
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');

  const [result, setResult] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    principal: 0, // 원금 추가
    principalToTotalInterestRatio: 0, // 원금 대비 총 이자율 추가
    totalInterestToTotalPaymentRatio: 0, // 총 상환액 대비 이자 비율 추가
  })

  const handleCalculate = () => {
    const principalValue = principal
    if (principalValue <= 0 || months <= 0 || annualRate < 0) {
      toast.error('올바른 값을 입력해주세요.')
      return
    }

    let monthlyPayment = 0
    let totalPayment = 0
    let totalInterest = 0

    if (annualRate === 0) {
      monthlyPayment = principalValue / months
      totalPayment = principalValue
      totalInterest = 0
    } else {
      const monthlyRate = annualRate / 100 / 12
      monthlyPayment =
        principalValue *
        (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)

      totalPayment = monthlyPayment * months
      totalInterest = totalPayment - principalValue
    }

    // 추가 계산
    const principalToTotalInterestRatio = totalInterest > 0 ? (totalInterest / principalValue) * 100 : 0;
    const totalInterestToTotalPaymentRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    setResult({
      monthlyPayment: round(monthlyPayment),
      totalPayment: round(totalPayment),
      totalInterest: round(totalInterest),
      principal: principalValue, // 원금 저장
      principalToTotalInterestRatio: round(principalToTotalInterestRatio, 2), // 소수점 둘째 자리까지 반올림
      totalInterestToTotalPaymentRatio: round(totalInterestToTotalPaymentRatio, 2), // 소수점 둘째 자리까지 반올림
    })

    toast.success("할부이자 계산이 완료되었습니다.", {
      description: `월 상환금은 ${round(monthlyPayment).toLocaleString()} 원 입니다.`,
    })
  }

  const pieData = useMemo(() => {
    const principalValue = principal
    if (result.totalPayment <= 0) return []
    return [
      { name: '원금', value: principalValue },
      { name: '총이자', value: result.totalInterest },
    ]
  }, [principal, result.totalInterest, result.totalPayment])

    const inputSection = (
      <>
        <div className="flex-grow space-y-6">
          <div>
            <Label htmlFor="principal" className="mb-2">할부 원금 (원)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={e => setPrincipal(Number(e.target.value))}
              placeholder="예: 1,000,000"
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="months" className="mb-2">할부 개월 수</Label>
            <Input
              id="months"
              type="number"
              value={months}
              onChange={e => setMonths(Number(e.target.value))}
              placeholder="예: 12"
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="annualRate" className="mb-2">연 이자율 (%)</Label>
            <Input
              id="annualRate"
              type="number"
              step="0.1"
              value={annualRate}
              onChange={e => setAnnualRate(Number(e.target.value))}
              placeholder="예: 5"
              className="text-right"
            />
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full mt-4">
          계산하기
        </Button>
      </>
    );

    const resultSection = (
      <div className="space-y-6">
        {result.totalPayment > 0 ? (
          <>
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-base font-semibold">할부 상환 분석</h3>
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="table">
                <ToggleGroupItem value="table">테이블</ToggleGroupItem>
                <ToggleGroupItem value="chart">차트</ToggleGroupItem>
              </ToggleGroup>
            </div>
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>구분</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>월 상환금</TableCell>
                      <TableCell className="text-right">{result.monthlyPayment.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>총 상환액</TableCell>
                      <TableCell className="text-right">{result.totalPayment.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>총 이자</TableCell>
                      <TableCell className="text-right text-red-500">{result.totalInterest.toLocaleString()} 원</TableCell>
                    </TableRow>
                    {result.principal > 0 && ( // 원금이 0보다 클 때만 표시
                      <>
                        <TableRow>
                          <TableCell>원금</TableCell>
                          <TableCell className="text-right">{result.principal.toLocaleString()} 원</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>원금 대비 총 이자율</TableCell>
                          <TableCell className="text-right">{result.principalToTotalInterestRatio}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>총 상환액 대비 이자 비율</TableCell>
                          <TableCell className="text-right">{result.totalInterestToTotalPaymentRatio}%</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }: PieLabelRenderProps) =>
                        `${name} ${((typeof percent === 'number' ? percent : 0) * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `${value.toLocaleString()} 원`
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-10">
            계산 버튼을 눌러 결과를 확인하세요.
          </div>
        )}
      </div>
    );

    const calculatorDescription = (
      <>
        <p className="mb-4">
          할부 구매는 상품이나 서비스의 대금을 한 번에 지불하는 대신,
          정해진 기간 동안 여러 번에 걸쳐 나누어 내는 편리한 결제
          방식입니다. 이때 원금 외에 추가로 부담하게 되는 금액이 바로
          ‘할부 이자’ 또는 ‘할부 수수료’입니다. 이는 카드사나 금융사가
          소비자에게 대금을 먼저 지불해주고, 그 대금을 분할하여 돌려받는
          동안 발생하는 일종의 금융 비용이라고 할 수 있습니다.
        </p>
        <p className="mb-4">
          할부 이자율은 소비자의 신용도, 할부 개월 수, 카드사의 정책,
          가맹점의 무이자 할부 이벤트 진행 여부 등 다양한 요인에 따라
          달라집니다. 일반적으로 할부 개월 수가 길어질수록 이자율도 함께
          높아지는 경향이 있습니다. 예를 들어, 3개월 할부보다는 12개월
          할부의 이자율이 더 높게 책정됩니다. ‘무이자 할부’는 이러한 할부
          이자를 소비자가 아닌, 상품을 판매하는 가맹점이 부담하는
          경우입니다. 가맹점은 판매 증진을 위해 마케팅 비용의 일환으로
          이자 비용을 대신 지불하는 것입니다.
        </p>
        <p>
          이 계산기는 가장 보편적인 상환 방식인 **‘원리금 균등 분할
          상환’**을 기준으로 할부 이자를 계산합니다. 이 방식은 매달 갚아야
          하는 원금과 이자의 합계(월 상환금)가 할부 기간 내내 동일하게
          유지되는 것이 특징입니다. 따라서 매달 동일한 금액을 상환하므로
          재정 계획을 세우기 용이하다는 장점이 있습니다.
        </p>
      </>
    );

    const calculationFormula = (
      <>
        <p className="mb-2">
          원리금 균등 분할 상환 방식은 매달 동일한 금액을 갚아나가는
          방식입니다. 초기에는 상환금에서 이자가 차지하는 비중이 높고
          원금 상환 비중은 낮지만, 시간이 지날수록 이자 비중은 줄고 원금
          상환 비중이 점차 높아지는 구조입니다.
        </p>
        <div className="font-mono p-4 bg-gray-100 dark:bg-gray-800 rounded-md my-4 text-sm">
          <p className="mb-2">
            <strong className="font-sans text-base">월 상환금</strong> =
            [원금 × 월이율 × (1 + 월이율)^개월수] / [(1 +
            월이율)^개월수 - 1]
          </p>
          <p>
            <strong className="font-sans text-base">총 이자</strong> = (월
            상환금 × 개월수) - 원금
          </p>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>월이율:</strong> 연이율(%) / 100 / 12
          </li>
          <li>
            <strong>총 상환액:</strong> 월 상환금 × 개월수
          </li>
        </ul>
      </>
    );

    const usefulTips = (
      <div className="text-base leading-relaxed space-y-4">
        <div>
          <h4 className="font-bold mb-1">1. 무이자 할부를 적극 활용하세요.</h4>
          <p>
            가장 좋은 방법은 무이자 할부 이벤트를 활용하는 것입니다.
            카드사나 쇼핑몰에서 진행하는 무이자 할부 행사를 이용하면 이자
            부담 없이 편리하게 할부 구매를 이용할 수 있습니다.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-1">2. 할부 개월 수는 신중하게 선택하세요.</h4>
          <p>
            할부 개월 수가 길어질수록 월 상환 부담은 줄어들지만, 총 이자
            부담은 늘어납니다. 자신의 상환 능력을 고려하여 가능한 한 짧은
            개월 수를 선택하는 것이 이자를 절약하는 길입니다.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-1">3. 선결제를 활용하여 이자를 줄이세요.</h4>
          <p>
            대부분의 카드사는 할부 잔액의 일부나 전부를 미리 갚는 선결제
            서비스를 제공합니다. 여유 자금이 생겼을 때 선결제를 하면
            남아있는 원금이 줄어들어 결과적으로 총 이자 부담을 줄일 수
            있습니다.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-1">4. 할부와 현금서비스/카드론을 구분하세요.</h4>
          <p>
            할부 이자율(수수료율)은 보통 현금서비스나 카드론의 이자율보다
            낮습니다. 급하게 자금이 필요하더라도, 할부 결제가 가능한
            상황이라면 현금서비스나 카드론 대신 할부를 이용하는 것이 더
            유리합니다.
          </p>
        </div>
      </div>
    );

    const InfoSection = {
      calculatorDescription: calculatorDescription,
      calculationFormula: calculationFormula,
      usefulTips: usefulTips,
    };

  return (
    <>
      <Head>
        <title>할부이자 계산기 - 원리금 균등 상환</title>
        <meta
          name="description"
          content="원리금 균등 상환 방식의 할부 이자를 간편하게 계산하고, 원금과 이자 비율을 파이 차트로 확인하세요."
        />
      </Head>
      <CalculatorsLayout
        title="할부이자 계산기 (원리금 균등 상환)"
        description="원리금 균등 상환 방식의 할부 이자를 간편하게 계산하고, 원금과 이자 비율을 파이 차트로 확인하세요."
        inputSection={inputSection}
        resultSection={resultSection}
        infoSection={InfoSection}
      />
    </>
  )
}
export default InstallmentInterestCalculator
