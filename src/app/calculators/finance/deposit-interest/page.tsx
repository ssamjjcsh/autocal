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
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

const DepositInterestCalculator: NextPage = () => {
  const [principal, setPrincipal] = useState<number>(10000000)
  const [rate, setRate] = useState<number>(3.5)
  const [period, setPeriod] = useState<number>(12)
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('simple')
  const [taxType, setTaxType] = useState<'general' | 'preferential' | 'non-taxable'>('general')

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
    setter(isNaN(value) ? 0 : value)
  }

  const { calculationResult, error } = useMemo(() => {
    const p = principal
    const r = rate
    const t = period

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      return { calculationResult: null, error: '모든 필드를 올바르게 입력해주세요.' }
    }
    if (p <= 0) {
      return { calculationResult: null, error: '예치금액은 0보다 커야 합니다.' }
    }
    if (r <= 0) {
      return { calculationResult: null, error: '연 이자율은 0보다 커야 합니다.' }
    }
    if (t <= 0) {
      return { calculationResult: null, error: '예치기간은 0보다 커야 합니다.' }
    }

    const taxRate = taxType === 'general' ? 0.154 : taxType === 'preferential' ? 0.095 : 0
    const monthlyRate = r / 100 / 12
    let totalInterest = 0

    if (interestType === 'simple') {
      totalInterest = p * (r / 100) * (t / 12)
    } else { // 월복리
      totalInterest = p * Math.pow(1 + monthlyRate, t) - p
    }

    const tax = totalInterest * taxRate
    const afterTaxInterest = totalInterest - tax
    const finalAmount = p + afterTaxInterest

    return {
      calculationResult: {
        principal: p,
        totalInterest: Math.floor(totalInterest),
        tax: Math.floor(tax),
        afterTaxInterest: Math.floor(afterTaxInterest),
        finalAmount: Math.floor(finalAmount),
        taxRate: taxRate * 100,
      },
      error: null,
    }
  }, [principal, rate, period, interestType, taxType])

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error)
    } else if (calculationResult) {
      toast.success('예금 이자 계산이 완료되었습니다.')
    }
  }, [calculationResult, error])

  const inputSection = (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-grow">
        <div className="space-y-2">
          <Label htmlFor="principal">예치금액 (원)</Label>
          <Input
            id="principal"
            value={principal.toLocaleString()}
            onChange={handleInputChange(setPrincipal)}
            placeholder="예: 10,000,000"
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rate">연 이자율 (%)</Label>
          <Input
            id="rate"
            value={rate.toLocaleString()}
            onChange={handleInputChange(setRate)}
            placeholder="예: 3.5"
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">예치기간 (개월)</Label>
          <Input
            id="period"
            value={period.toLocaleString()}
            onChange={handleInputChange(setPeriod)}
            placeholder="예: 12"
            className="text-right"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="interestType">이자 계산 방식</Label>
            <Select value={interestType} onValueChange={(v: 'simple' | 'compound') => setInterestType(v)}>
              <SelectTrigger id="interestType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">단리</SelectItem>
                <SelectItem value="compound">월복리</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxType">과세 옵션</Label>
            <Select value={taxType} onValueChange={(v: 'general' | 'preferential' | 'non-taxable') => setTaxType(v)}>
              <SelectTrigger id="taxType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">일반과세 (15.4%)</SelectItem>
                <SelectItem value="preferential">세금우대 (9.5%)</SelectItem>
                <SelectItem value="non-taxable">비과세 (0%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">계산하기</Button>
      </div>
    </div>
  )

  const resultSection = (
    <div className="flex flex-col justify-center h-full">
      {calculationResult ? (
        <div className="space-y-4">
            <div className="text-center pb-4 border-b">
                <p className="text-lg text-muted-foreground">만기 지급액</p>
                <p className="text-4xl sm:text-5xl font-bold text-primary">{calculationResult.finalAmount.toLocaleString()} 원</p>
            </div>
            <Table className="mt-4">
                <TableBody>
                    <TableRow>
                        <TableCell>원금</TableCell>
                        <TableCell className="text-right">{calculationResult.principal.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>세전 이자</TableCell>
                        <TableCell className="text-right">{calculationResult.totalInterest.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>세금 ({calculationResult.taxRate.toFixed(1)}%)</TableCell>
                        <TableCell className="text-right text-destructive">- {calculationResult.tax.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                        <TableCell>세후 이자</TableCell>
                        <TableCell className="text-right">{calculationResult.afterTaxInterest.toLocaleString()} 원</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
      ) : (
        <div className="text-center text-muted-foreground min-h-[200px] flex items-center justify-center">
            <p>{error || '정보를 입력하고 계산하기 버튼을 누르세요.'}</p>
        </div>
      )}
    </div>
  )

  const infoSection = {
    calculatorDescription:
      "정기예금 이자 계산기는 예치금액, 연 이자율, 예치기간, 이자 계산 방식(단리/복리), 과세 옵션을 바탕으로 만기 시 수령하게 될 실수령액을 정확하게 계산해주는 도구입니다. 복잡한 이자 및 세금 계산을 간편하게 처리하여 재테크 계획 수립을 돕습니다.",
    calculationFormula: (
      <>
        <p className="mb-2">
          예금 이자는 단리와 복리 방식에 따라 다르게 계산됩니다.
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">단리 계산법</h4>
            <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
              세전 이자 = 원금 × (연이율 / 100) × (예치 개월 수 / 12)
            </p>
          </div>
          <div>
            <h4 className="font-semibold">월복리 계산법</h4>
            <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
              세전 이자 = 원금 × (1 + 월이율) ^ 예치 개월 수 - 원금
            </p>
            <p className="text-xs text-muted-foreground">* 월이율 = 연이율 / 12</p>
          </div>
          <div>
            <h4 className="font-semibold">세후 수령액</h4>
            <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
              세후 수령액 = 원금 + 세전 이자 - (세전 이자 × 세율)
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>
                <strong>일반과세:</strong> 15.4% (이자소득세 14% + 지방소득세 1.4%)
              </li>
              <li>
                <strong>세금우대:</strong> 9.5% (농특세 포함, 조건 충족 시)
              </li>
              <li>
                <strong>비과세:</strong> 0% (관련 법률에 따른 특정 상품)
              </li>
            </ul>
          </div>
        </div>
      </>
    ),
    usefulTips: (
      <ul className="list-disc list-inside text-sm space-y-2">
        <li>
          <strong>만기 연장 vs. 재예치:</strong> 만기 시 자동 연장 옵션보다, 금리가 더 높은 새로운 상품으로 재예치하는 것이 유리할 수 있습니다.
        </li>
        <li>
          <strong>단리 vs. 복리:</strong> 예치 기간이 길다면 복리 상품이 단리 상품보다 더 많은 이자를 제공합니다.
        </li>
        <li>
          <strong>세금 우대 및 비과세 활용:</strong> ISA(개인종합자산관리계좌)나 비과세 종합저축 등 절세 혜택 상품을 적극적으로 활용하여 실수령액을 높일 수 있습니다.
        </li>
        <li>
          <strong>주거래 은행 혜택:</strong> 주거래 은행의 예금 상품은 우대 금리를 제공하는 경우가 많으니 확인해보세요.
        </li>
      </ul>
    ),
  }

  return (
    <CalculatorsLayout
      title="정기예금 이자 계산기"
      description="단리/복리, 과세 옵션을 선택하여 만기 수령액을 계산해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default DepositInterestCalculator