'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

// 원리금 균등 분할 상환 계산 로직
const calculateLevelPayment = (principal: number, term: number, interestRate: number) => {
  if (principal <= 0 || term <= 0 || interestRate <= 0) {
    return { monthlyPayment: 0, totalRepayment: 0, totalInterest: 0, chartData: [], schedule: [] };
  }

  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = term * 12;
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalRepayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalRepayment - principal;

  let remainingPrincipal = principal;
  const schedule = [];
  const chartData = [];

  for (let i = 1; i <= numberOfPayments; i++) {
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingPrincipal -= principalPayment;

    const monthData = {
      month: i,
      monthlyPayment: Math.round(monthlyPayment),
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      remainingPrincipal: Math.round(remainingPrincipal > 0 ? remainingPrincipal : 0),
    };
    schedule.push(monthData);

    if (i % 12 === 0 || i === 1 || i === numberOfPayments) { // 매년, 첫달, 마지막달 데이터만 차트에 추가
        chartData.push({
            month: `${i}회차`,
            '월 상환금': Math.round(monthlyPayment),
            '상환 원금': Math.round(principalPayment),
            '상환 이자': Math.round(interestPayment),
        });
    }
  }

  return { 
    monthlyPayment: Math.round(monthlyPayment),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
    chartData,
    schedule 
  };
};

export default function LevelPaymentPage() {
  const [principal, setPrincipal] = useState<number>(100000000);
  const [term, setTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [calculationResults, setCalculationResults] = useState(null);
  const [view, setView] = useState('chart');

  // 숫자 입력 처리 핸들러 정의
  const handleInputChange = (setter: (value: number) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
      const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
      setter(isNaN(numericValue) ? 0 : numericValue);
    };
  };

  const handleCalculate = () => {
    const p = principal;
    const t = term;
    const r = interestRate;
    if (isNaN(p) || isNaN(t) || isNaN(r)) {
      alert('유효한 숫자를 입력해주세요.');
      return;
    }
    const results = calculateLevelPayment(p, t, r);
    setCalculationResults(results as any);
  };

  const LeftColumn = (
    <div className="space-y-4">
      <div>
        <label htmlFor="principal" className="block text-sm font-medium text-gray-700 mb-1">대출 원금 (원)</label>
        <Input id="principal" type="number" value={principal.toLocaleString()} onChange={handleInputChange(setPrincipal)} placeholder="예: 100000000" />
      </div>
      <div>
        <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">대출 기간 (년)</label>
        <Input id="term" type="number" value={term.toLocaleString()} onChange={handleInputChange(setTerm)} placeholder="예: 30" />
      </div>
      <div>
        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">연 이자율 (%)</label>
        <Input id="interestRate" type="number" value={interestRate.toLocaleString()} onChange={handleInputChange(setInterestRate)} placeholder="예: 4.5" />
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const RightColumn = (
    <>
      {calculationResults ? (
        <div className="space-y-4 text-lg">
            <div className="flex justify-between items-center">
                <span className="font-medium">월 상환금</span>
                <span className="text-blue-600">{(calculationResults as any).monthlyPayment.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">총 상환 이자</span>
                <span className="text-red-500">{(calculationResults as any).totalInterest.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">총 상환 금액</span>
                <span className="text-blue-600">{(calculationResults as any).totalRepayment.toLocaleString()} 원</span>
            </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          계산하기 버튼을 눌러주세요
        </div>
      )}
    </>
  );

  const InfoSection = (
    <>
      {calculationResults && (
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>월별 상환 스케줄</CardTitle>
            <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)} size="sm">
              <ToggleGroupItem value="chart">차트</ToggleGroupItem>
              <ToggleGroupItem value="table">테이블</ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent>
            {view === 'chart' ? (
              <div className="w-full h-[400px]">
                <ResponsiveContainer>
                    <LineChart data={(calculationResults as any).chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} formatter={(value) => `${value.toLocaleString()} 원`} />
                        <Legend />
                        <Line type="monotone" dataKey="월 상환금" stroke="#8884d8" />
                        <Line type="monotone" dataKey="상환 원금" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="상환 이자" stroke="#ffc658" />
                    </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>회차</TableHead>
                        <TableHead className="text-right">월 상환금</TableHead>
                        <TableHead className="text-right">상환 원금</TableHead>
                        <TableHead className="text-right">상환 이자</TableHead>
                        <TableHead className="text-right">대출 잔액</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {(calculationResults as any).schedule.map((item: any) => (
                        <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="text-right">{item.monthlyPayment.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.principalPayment.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.interestPayment.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.remainingPrincipal.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );

  const infoSection = {
    calculatorDescription: (
      <> 
        <p>원리금 균등분할상환은 대출 기간 동안 매월 동일한 금액을 상환하는 방식입니다. 매월 상환하는 금액(원리금)은 대출 원금과 이자의 합으로 구성됩니다.</p>
        <p className="mt-2">상환 초기에는 이자가 차지하는 비중이 높고 원금 상환 비중은 낮지만, 시간이 지남에 따라 이자 비중은 점차 줄어들고 원금 상환 비중은 늘어나는 특징이 있습니다. 매월 상환액이 일정하여 자금 계획을 세우기 용이하다는 장점이 있습니다.</p>
      </>
    ),
    calculationFormula: (
      <> 
        <p><strong>원금 균등분할상환</strong>은 매월 상환하는 원금이 동일한 방식입니다. 따라서 대출 잔액이 줄어듦에 따라 매월 납부하는 이자도 함께 줄어들어 월 상환액이 점차 감소합니다. 총 이자 상환액은 원리금 균등분할상환 방식보다 적지만, 초기 상환 부담이 크다는 단점이 있습니다.</p>
        <p className="mt-2">반면, <strong>원리금 균등분할상환</strong>은 매월 상환하는 금액이 동일하므로 초기 상환 부담이 상대적으로 적습니다. 하지만 총 이자 상환액은 원금 균등분할상환 방식보다 많습니다.</p>
      </>
    ),
    usefulTips: (
      <>
        <p>이 수수료는 일반적으로 대출 실행일로부터 3년 이내에 상환할 경우에만 부과되며, 3년이 지나면 면제되는 경우가 대부분입니다. 수수료율은 금융상품, 대출 종류(주택담보대출, 신용대출 등), 금리 방식(변동금리, 고정금리)에 따라 다르며, 보통 0.5%에서 1.5% 사이에서 책정됩니다. 또한, 일부 금융기관에서는 연간 대출 원금의 10% 이내에서 상환하는 경우 중도상환수수료를 면제해주는 제도를 운영하기도 하므로, 대출 약정 시 관련 조항을 꼼꼼히 확인하는 것이 중요합니다. 따라서 더 낮은 금리의 대출로 갈아타거나(대환대출), 여유 자금이 생겨 대출금을 미리 갚으려는 경우, 앞으로 남은 기간 동안 내야 할 총 이자 금액과 당장 부담해야 할 중도상환수수료를 비교하여 어떤 것이 더 유리한지 신중하게 판단해야 합니다. 본 계산기는 이러한 의사결정 과정에 도움을 주기 위해 만들어졌습니다.</p>
      </>
    )
  };

  return (
    <CalculatorsLayout 
      title="원리금 균등 분할 상환 계산기"
      description="매월 동일한 금액을 상환하는 원리금 균등 분할 상환 방식의 월 상환금, 총 이자, 상환 스케줄을 계산합니다."
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={infoSection}
    >
    </CalculatorsLayout>
  );
}

