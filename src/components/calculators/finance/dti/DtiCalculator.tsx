'use client'

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip as RechartsTooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";

export function DtiCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number>(5000);
  const [loanPrincipal, setLoanPrincipal] = useState<number>(10000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [otherDebtInterest, setOtherDebtInterest] = useState<number>(0);
  const [dtiResult, setDtiResult] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const calculationResults = useMemo(() => {
    const income = annualIncome * 10000;
    const principal = loanPrincipal * 10000;
    const term = loanTerm;
    const rate = interestRate / 100;
    const otherInterest = otherDebtInterest * 10000;

    if (income <= 0 || principal <= 0 || term <= 0 || rate <= 0) {
      return null;
    }

    const monthlyRate = rate / 12;
    const numberOfPayments = term * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const annualPrincipalAndInterest = monthlyPayment * 12;
    const totalAnnualDebtRepayment = annualPrincipalAndInterest + otherInterest;
    const calculatedDti = (totalAnnualDebtRepayment / income) * 100;

    let dtiStatus = "";
    let dtiBadgeColor = "";
    if (calculatedDti <= 15) {
      dtiStatus = "매우 안정";
      dtiBadgeColor = "bg-green-500";
    } else if (calculatedDti <= 30) {
      dtiStatus = "안정";
      dtiBadgeColor = "bg-blue-500";
    } else if (calculatedDti <= 40) {
      dtiStatus = "주의";
      dtiBadgeColor = "bg-yellow-500 text-black";
    } else if (calculatedDti <= 50) {
      dtiStatus = "위험";
      dtiBadgeColor = "bg-orange-500";
    } else {
      dtiStatus = "고위험";
      dtiBadgeColor = "bg-red-500";
    }

    const maxAnnualRepayment = income * 0.4; // DTI 40% 기준
    const availableForLoanRepayment = maxAnnualRepayment - otherInterest;
    
    let estimatedAmount = 0;
    if (availableForLoanRepayment > 0) {
        const monthlyPaymentForEstimation = availableForLoanRepayment / 12;
        estimatedAmount = (monthlyPaymentForEstimation * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }

    const chartData = [
      { name: '총부채', value: totalAnnualDebtRepayment, fill: '#4f46e5' },
      { name: '가용 소득', value: income - totalAnnualDebtRepayment > 0 ? income - totalAnnualDebtRepayment : 0, fill: '#10b981' },
    ];

    return {
      dti: calculatedDti,
      dtiStatus,
      dtiBadgeColor,
      estimatedLoanAmount: estimatedAmount > 0 ? estimatedAmount / 10000 : 0,
      annualIncome: income,
      totalAnnualDebtRepayment,
      annualPrincipalAndInterest,
      otherInterest,
      chartData,
    };
  }, [annualIncome, loanPrincipal, loanTerm, interestRate, otherDebtInterest]);

  const calculateDti = () => {
    if (calculationResults) {
      setDtiResult(calculationResults.dti);
      toast.success("DTI 계산이 완료되었습니다.", {
        description: `당신의 DTI는 ${Math.round(calculationResults.dti)}% 입니다.`,
      });
    } else {
      setDtiResult(null);
      toast.error("정확한 값을 입력해주세요.", {
        description: "연소득, 대출 원금, 대출 기간, 금리는 0보다 커야 합니다.",
      });
    }
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="annual-income">연간 소득 (만원)</Label>
          <Input id="annual-income" value={annualIncome} onChange={(e) => setAnnualIncome(parseFloat(e.target.value))} placeholder="예: 5000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loan-principal">주택담보대출 원금 (만원)</Label>
          <Input id="loan-principal" value={loanPrincipal} onChange={(e) => setLoanPrincipal(parseFloat(e.target.value))} placeholder="예: 10000" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loan-term">대출 기간 (년)</Label>
          <Input id="loan-term" value={loanTerm} onChange={(e) => setLoanTerm(parseFloat(e.target.value))} placeholder="예: 30" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest-rate">연간 이자율 (%)</Label>
          <Input id="interest-rate" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value))} placeholder="예: 5" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="other-debt-interest">기타부채 연간 이자 (만원)</Label>
          <Input id="other-debt-interest" value={otherDebtInterest} onChange={(e) => setOtherDebtInterest(parseFloat(e.target.value))} placeholder="예: 0" />
      </div>
      <Button onClick={calculateDti} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {dtiResult && calculationResults ? (
        <>
          <div className="flex justify-between items-center">
            <span className="text-lg">DTI 결과:</span>
            <Badge className={`${calculationResults.dtiBadgeColor} text-lg`}>{Math.round(calculationResults.dti)}% ({calculationResults.dtiStatus})</Badge>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>총부채 연간 원리금 상환액:</span>
              <span>{(calculationResults.totalAnnualDebtRepayment / 10000).toLocaleString()} 만원</span>
            </div>
            <div className="flex justify-between">
              <span>연간 소득:</span>
              <span>{(calculationResults.annualIncome / 10000).toLocaleString()} 만원</span>
            </div>
            <div className="flex justify-between">
              <span>주택담보대출 연간 원리금:</span>
              <span>{(calculationResults.annualPrincipalAndInterest / 10000).toLocaleString()} 만원</span>
            </div>
            <div className="flex justify-between">
              <span>기타부채 연간 이자:</span>
              <span>{(calculationResults.otherInterest / 10000).toLocaleString()} 만원</span>
            </div>
          </div>
          <Separator />
          <div className="text-center">
            <p className="text-lg font-semibold">DTI 40% 기준, 최대 대출 가능 금액</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(calculationResults.estimatedLoanAmount).toLocaleString()} 만원</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{calculationResults.estimatedLoanAmount.toLocaleString()} 만원</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">소득 대비 부채 구성</h3>
              {dtiResult && (
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="chart">
                  <ToggleGroupItem value="chart">차트</ToggleGroupItem>
                  <ToggleGroupItem value="table">테이블</ToggleGroupItem>
                </ToggleGroup>
              )}
            </div>
            {dtiResult && calculationResults ? (
              viewMode === 'chart' ? (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background p-2 border rounded shadow-lg text-sm">
                                <p className="font-bold">{data.name}</p>
                                <p>{(data.value / 10000).toLocaleString()} 만원</p>
                                <p>{((data.value / calculationResults.annualIncome) * 100).toFixed(2)}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={calculationResults.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }: PieLabelRenderProps) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {calculationResults.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>항목</TableHead>
                        <TableHead>금액 (만원)</TableHead>
                        <TableHead>비율 (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculationResults.chartData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{(item.value / 10000).toLocaleString()}</TableCell>
                          <TableCell>{((item.value / calculationResults.annualIncome) * 100).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-lg">차트/테이블을 보려면 먼저 계산을 실행하세요.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">계산하기 버튼을 클릭하여 결과를 확인하세요.</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription:
      "DTI(총부채상환비율)는 연간 소득에서 모든 부채의 연간 원리금 상환액이 차지하는 비율을 나타내는 지표입니다. 금융기관은 DTI를 통해 대출 신청자의 상환 능력을 평가하며, 이는 대출 한도를 결정하는 중요한 요소로 작용합니다. 일반적으로 DTI가 낮을수록 상환 능력이 양호하다고 판단합니다.",
    calculationFormula: (
      <>
        <p className="mb-2">
          DTI는 다음과 같은 공식으로 계산됩니다.
        </p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          DTI = (주택담보대출 연간 원리금 상환액 + 기타부채 연간 이자 상환액) / 연간 소득 × 100
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
          <li>
            <strong>주택담보대출 연간 원리금 상환액:</strong> 1년 동안 갚아야 할 주택담보대출의 원금과 이자의 합계입니다.
          </li>
          <li>
            <strong>기타부채 연간 이자 상환액:</strong> 신용대출, 자동차 할부 등 다른 대출의 1년치 이자 비용입니다.
          </li>
          <li>
            <strong>연간 소득:</strong> 세전 소득을 기준으로 합니다.
          </li>
        </ul>
      </>
    ),
    usefulTips: (
      <ul className="list-disc list-inside text-sm space-y-2">
        <li>
          <strong>DTI 관리:</strong> 신용대출 등 불필요한 부채를 줄이면 DTI 비율을 낮출 수 있어 주택담보대출 한도를 높이는 데 도움이 됩니다.
        </li>
        <li>
          <strong>소득 증빙:</strong> 인정되는 소득의 종류를 최대한 확인하고 증빙서류를 꼼꼼히 준비하여 연간 소득을 높게 인정받는 것이 중요합니다.
        </li>
        <li>
          <strong>대출 기간:</strong> 대출 기간을 길게 설정하면 연간 원리금 상환액이 줄어들어 DTI 비율이 낮아지는 효과가 있습니다.
        </li>
        <li>
          <strong>정부 정책 확인:</strong> 정부의 부동산 및 대출 규제 정책에 따라 DTI 한도가 달라질 수 있으므로, 대출 신청 시점의 최신 정책을 반드시 확인해야 합니다.
        </li>
      </ul>
    ),
  };

  return (
    <CalculatorsLayout
      title="DTI 계산기 (총부채상환비율)"
      description="연간 소득과 부채 정보를 바탕으로 DTI를 계산하고 대출 가능성을 확인해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}