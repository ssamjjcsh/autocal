'use client';

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomDatePicker, CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker'
import { HelpCircle, FileText, PiggyBank } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

const EarlyRepaymentFeeCalculator: NextPage = () => {
  const [totalLoanAmount, setTotalLoanAmount] = useState<number>(100000000)
  const [repaymentAmount, setRepaymentAmount] = useState<number>(50000000)
  const [loanStartDate, setLoanStartDate] = useState<Date | undefined>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  )
  const [repaymentDate, setRepaymentDate] = useState<Date | undefined>(new Date())
  const [loanTerm, setLoanTerm] = useState<number>(36)
  const [feeRate, setFeeRate] = useState<number>(1.2)
  const [displayedResult, setDisplayedResult] = useState<any>(null)

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setter(parseFloat(value.replace(/,/g, '')));
  };

  const { calculationResult, error } = useMemo(() => {
    const totalLoan = totalLoanAmount;
    const repayment = repaymentAmount;
    const term = loanTerm;
    const rate = feeRate;

    if (!loanStartDate || !repaymentDate) {
      return { calculationResult: null, error: "대출 시작일과 중도상환일을 모두 입력해주세요." };
    }

    if (isNaN(totalLoan) || isNaN(repayment) || isNaN(term) || isNaN(rate)) {
      return { calculationResult: null, error: "모든 숫자 필드를 올바르게 입력해주세요." };
    }

    const totalDays = term * 30; // 근사치
    const elapsed = Math.floor(
      (repaymentDate.getTime() - loanStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const remaining = Math.max(0, totalDays - elapsed);

    if (remaining <= 0) {
      return {
        calculationResult: {
          fee: 0,
          remainingDays: 0,
          totalLoanDays: totalDays,
          elapsedDays: elapsed,
          feeDetails: {
            baseAmount: repayment,
            rate: rate,
            remainingRatio: 0,
            remainingMonths: 0,
            isExempt: true,
            exemptionReason: '대출 만기일이 경과했습니다.',
          },
        },
        error: null
      };
    }

    if (elapsed >= 1095) { // 3년(1095일) 이상 경과 시 면제
      return {
        calculationResult: {
          fee: 0,
          remainingDays: remaining,
          totalLoanDays: totalDays,
          elapsedDays: elapsed,
          feeDetails: {
            baseAmount: repayment,
            rate: rate,
            remainingRatio: (remaining / totalDays) * 100,
            remainingMonths: Math.ceil(remaining / 30),
            isExempt: true,
            exemptionReason: '대출 실행일로부터 3년이 경과하여 수수료가 면제됩니다.',
          },
        },
        error: null
      };
    }

    const calculatedFee = repayment * (rate / 100) * (remaining / totalDays);

    return {
      calculationResult: {
        fee: Math.round(calculatedFee),
        remainingDays: remaining,
        totalLoanDays: totalDays,
        elapsedDays: elapsed,
        feeDetails: {
          baseAmount: repayment,
          rate: rate,
          remainingRatio: (remaining / totalDays) * 100,
          remainingMonths: Math.ceil(remaining / 30),
          isExempt: false,
          exemptionReason: null,
        },
      },
      error: null
    };
  }, [totalLoanAmount, repaymentAmount, loanStartDate, repaymentDate, loanTerm, feeRate]);

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error)
      setDisplayedResult(null);
    } else if (calculationResult) {
      setDisplayedResult(calculationResult);
      if (calculationResult.feeDetails.isExempt) {
        toast.success(calculationResult.feeDetails.exemptionReason)
      } else {
        toast.success('중도상환수수료 계산이 완료되었습니다.')
      }
    }
  }, [calculationResult, error]);

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalLoanAmount">총 대출금액 (원)</Label>
          <Input id="totalLoanAmount" value={totalLoanAmount.toLocaleString()} onChange={handleInputChange(setTotalLoanAmount)} placeholder="예: 100,000,000" className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repaymentAmount">중도상환금액 (원)</Label>
          <Input id="repaymentAmount" value={repaymentAmount.toLocaleString()} onChange={handleInputChange(setRepaymentAmount)} placeholder="예: 50,000,000" className="text-right" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanStartDate">대출 시작일</Label>
          <CustomDatePickerWithPopover date={loanStartDate} setDate={setLoanStartDate} placeholder="대출 시작일 선택" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repaymentDate">중도상환일</Label>
          <CustomDatePickerWithPopover date={repaymentDate} setDate={setRepaymentDate} placeholder="중도상환일 선택" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanTerm">총 대출기간 (개월)</Label>
          <Input id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(parseFloat(e.target.value))} placeholder="예: 36" className="text-right" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feeRate">중도상환수수료율 (%)</Label>
          <Input id="feeRate" value={feeRate} onChange={(e) => setFeeRate(parseFloat(e.target.value))} placeholder="예: 1.2" className="text-right" type="number" />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <>
      {displayedResult ? (
        <div className="w-full space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">예상 중도상환수수료</p>
            <p className="text-4xl font-bold text-primary">
              {displayedResult.fee.toLocaleString()}원
            </p>
            {displayedResult.feeDetails.isExempt && (
               <Badge variant="secondary" className="mt-2">{displayedResult.feeDetails.exemptionReason}</Badge>
            )}
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 text-center">대출 진행 상황</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>경과일: {displayedResult.elapsedDays.toLocaleString()}일</span>
                  <span>잔여일: {displayedResult.remainingDays.toLocaleString()}일</span>
                </div>
                <Progress value={(displayedResult.elapsedDays / displayedResult.totalLoanDays) * 100} className="w-full" />
                 <div className="flex justify-between text-xs text-muted-foreground">
                  <span>대출 시작</span>
                  <span>만기</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 text-center">상세 계산 내역</h3>
              <ul className="text-left space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between">
                  <span>중도상환원금:</span>
                  <span className="font-mono">{displayedResult.feeDetails.baseAmount.toLocaleString()}원</span>
                </li>
                <li className="flex justify-between">
                  <span>적용 수수료율:</span>
                  <span className="font-mono">{displayedResult.feeDetails.rate}%</span>
                </li>
                <li className="flex justify-between">
                  <span>잔존기간 비율:</span>
                  <span className="font-mono">{displayedResult.feeDetails.remainingRatio.toFixed(2)}%</span>
                </li>
                 <li className="flex justify-between">
                  <span>남은 개월 수:</span>
                  <span className="font-mono">{displayedResult.feeDetails.remainingMonths}개월</span>
                </li>
              </ul>
            </div>

          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            계산하기 버튼을 눌러주세요
          </div>
        )}
      </>
  );

  const infoSection = {
    calculatorDescription:
      '중도상환수수료(또는 조기상환수수료)는 대출 계약 기간이 만료되기 전에 대출 원금의 일부 또는 전부를 상환할 때, 금융기관이 고객에게 부과하는 일종의 위약금입니다. 금융기관은 고객의 대출 기간 동안 발생할 이자 수익을 예상하고 자금 운용 계획을 세웁니다. 하지만 고객이 예상보다 일찍 대출금을 갚으면, 금융기관은 계획했던 이자 수익을 얻지 못하게 되고 자금 운용에 차질이 생길 수 있습니다. 중도상환수수료는 이러한 금융기관의 손실을 일부 보전해주는 역할을 합니다.',
    calculationFormula: (
      <>
        <p className="mb-2">
          중도상환수수료는 일반적으로 다음과 같은 공식에 따라 계산됩니다.
        </p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          중도상환수수료 = 중도상환원금 × 수수료율(%) × (대출 잔여일수 ÷ 총 대출기간)
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
          <li>
            <strong>중도상환원금:</strong> 만기 전에 미리 갚으려는 대출 원금
          </li>
          <li>
            <strong>수수료율:</strong> 대출 약정 시 정해진 중도상환수수료 비율
          </li>
          <li>
            <strong>대출 잔여일수:</strong> 총 대출기간에서 대출 시작일로부터 상환일까지 경과한 날짜를 뺀 남은 기간. 단, 대부분의 금융기관에서는 대출 기간이 3년을 초과하더라도 수수료 계산 시 대출 기간을 최대 3년(1,095일)으로 간주합니다.
          </li>
          <li>
            <strong>총 대출기간:</strong> 대출 약정서상의 전체 대출 기간
          </li>
        </ul>
      </>
    ),
    usefulTips:
      '이 수수료는 일반적으로 대출 실행일로부터 3년 이내에 상환할 경우에만 부과되며, 3년이 지나면 면제되는 경우가 대부분입니다. 수수료율은 금융상품, 대출 종류(주택담보대출, 신용대출 등), 금리 방식(변동금리, 고정금리)에 따라 다르며, 보통 0.5%에서 1.5% 사이에서 책정됩니다. 또한, 일부 금융기관에서는 연간 대출 원금의 10% 이내에서 상환하는 경우 중도상환수수료를 면제해주는 제도를 운영하기도 하므로, 대출 약정 시 관련 조항을 꼼꼼히 확인하는 것이 중요합니다. 따라서 더 낮은 금리의 대출로 갈아타거나(대환대출), 여유 자금이 생겨 대출금을 미리 갚으려는 경우, 앞으로 남은 기간 동안 내야 할 총 이자 금액과 당장 부담해야 할 중도상환수수료를 비교하여 어떤 것이 더 유리한지 신중하게 판단해야 합니다. 본 계산기는 이러한 의사결정 과정에 도움을 주기 위해 만들어졌습니다.',
  };

  return (
    <CalculatorsLayout
      title="중도상환수수료 계산기"
      description="대출금 중도상환 시 발생할 수 있는 수수료를 미리 계산해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default EarlyRepaymentFeeCalculator;