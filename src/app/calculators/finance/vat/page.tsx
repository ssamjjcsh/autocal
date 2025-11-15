'use client'

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// import { formatNumber, parseNumber } from '@/utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'

const VatCalculator = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [supplyAmount, setSupplyAmount] = useState<number>(0)
  const [calculationType, setCalculationType] = useState<'totalAmount' | 'supplyAmount'>('totalAmount')

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
    setter(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleReset = () => {
    setTotalAmount(0);
    setSupplyAmount(0);
    setCalculationType('totalAmount');
  };

  const { calculatedSupplyAmount, calculatedVatAmount, calculatedTotalAmount } = useMemo(() => {
    let supply = 0;
    let vat = 0;
    let total = 0;

    if (calculationType === 'totalAmount') {
      // const parsedTotal = parseNumber(totalAmount);
      if (!isNaN(totalAmount) && totalAmount > 0) {
        total = totalAmount;
        supply = Math.round(total / 1.1);
        vat = total - supply;
      }
    } else {
      // const parsedSupply = parseNumber(supplyAmount);
      if (!isNaN(supplyAmount) && supplyAmount > 0) {
        supply = supplyAmount;
        vat = Math.round(supply * 0.1);
        total = supply + vat;
      }
    }

    return {
      calculatedSupplyAmount: supply.toLocaleString(),
      calculatedVatAmount: vat.toLocaleString(),
      calculatedTotalAmount: total.toLocaleString(),
    };
  }, [totalAmount, supplyAmount, calculationType]);

  const inputSection = (
    <div className="space-y-4">
      <RadioGroup
        defaultValue="totalAmount"
        value={calculationType}
        onValueChange={(value: 'totalAmount' | 'supplyAmount') => {
          setCalculationType(value);
          handleReset(); // 계산 방식 변경 시 초기화
        }}
        className="grid grid-cols-2 gap-4"
      >
        <Label
          htmlFor="totalAmountRadio"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
        >
          <RadioGroupItem id="totalAmountRadio" value="totalAmount" className="sr-only" />
          <span>합계금액으로 계산</span>
        </Label>
        <Label
          htmlFor="supplyAmountRadio"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
        >
          <RadioGroupItem id="supplyAmountRadio" value="supplyAmount" className="sr-only" />
          <span>공급가액으로 계산</span>
        </Label>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="totalAmountInput">합계금액 (원)</Label>
        <Input
          id="totalAmountInput"
          value={totalAmount.toLocaleString()}
          onChange={handleInputChange(setTotalAmount)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="합계금액 입력"
          disabled={calculationType !== 'totalAmount'}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supplyAmountInput">공급가액 (원)</Label>
        <Input
          id="supplyAmountInput"
          value={supplyAmount.toLocaleString()}
          onChange={handleInputChange(setSupplyAmount)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="공급가액 입력"
          disabled={calculationType !== 'supplyAmount'}
        />
      </div>
      <Button onClick={handleReset} className="w-full" variant="outline">
        초기화
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>공급가액:</span>
        <span>{calculatedSupplyAmount} 원</span>
      </div>
      <div className="flex justify-between text-lg font-semibold">
        <span>부가세:</span>
        <span>{calculatedVatAmount} 원</span>
      </div>
      <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
        <span>합계금액:</span>
        <span>{calculatedTotalAmount} 원</span>
      </div>
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        부가가치세(VAT, Value Added Tax)는 상품이나 용역이 생산되거나
        유통되는 각 단계에서 창출되는 부가가치에 대해 부과되는
        세금입니다. 일반적으로 최종 소비자가 부담하며, 사업자는 이를
        징수하여 정부에 납부합니다.
      </>
    ),
    calculationFormula: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>공급가액:</strong> 부가세가 포함되지 않은 금액
        </li>
        <li>
          <strong>부가세:</strong> 공급가액의 10%
        </li>
        <li>
          <strong>합계금액 (공급대가):</strong> 공급가액 + 부가세
        </li>
        <li>
          합계금액에서 공급가액과 부가세를 계산하는 경우, 합계금액 ÷
          1.1을 하여 공급가액을 구하고, 합계금액에서 공급가액을 빼서
          부가세를 계산합니다.
        </li>
      </ul>
    ),
    usefulTips: (
      <>
        • 부가가치세는 매출 발생 시점에 신고하고 납부해야 합니다.
        • 사업자 등록을 한 경우에만 부가가치세를 신고할 수 있습니다.
        • 부가가치세 신고는 분기별로 이루어집니다.
      </>
    )
  };

  return (
    <CalculatorsLayout
      title="부가가치세 계산기"
      description="합계금액 또는 공급가액을 입력하여 부가가치세를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default VatCalculator