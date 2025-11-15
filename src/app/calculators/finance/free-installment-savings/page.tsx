'use client'

import React, { useState, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { differenceInDays } from 'date-fns'
import { Trash2, PlusCircle, HelpCircle, FileText, PiggyBank } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

const depositSchema = z.object({
  date: z.date({ required_error: '날짜를 입력해주세요.' }),
  amount: z.number({ required_error: '유효한 숫자를 입력해주세요.' })
    .refine(val => val > 0, { message: '납입금액은 0보다 커야 합니다.' }),
});

const formSchema = z.object({
  deposits: z.array(depositSchema).min(1, '하나 이상의 납입금이 필요합니다.'),
  maturityDate: z.date({ required_error: '만기일을 입력해주세요.' }),
  interestRate: z.number({ required_error: '유효한 숫자를 입력해주세요.' })
    .refine(val => {
        return val >= 0 && val <= 100;
    }, { message: '이자율은 0에서 100 사이여야 합니다.' }),
  interestType: z.enum(['simple', 'compound']),
  taxType: z.enum(['general', 'preferential', 'non-taxable']),
}).refine(data => {
    for (const deposit of data.deposits) {
        if (differenceInDays(data.maturityDate, deposit.date) < 0) {
            return false;
        }
    }
    return true;
}, { message: '만기일은 모든 납입일보다 이후여야 합니다.', path: ['maturityDate'] });

type FormValues = z.infer<typeof formSchema>;

const FreeInstallmentSavingsPage: React.FC = () => {
  const [result, setResult] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deposits: [{ date: new Date(), amount: 0 }],
      maturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      interestRate: 2.5,
      interestType: 'simple',
      taxType: 'general',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'deposits',
  });

  const handleNumericInputChange = useCallback(
    (onChange: (value: number) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const numericValue = value ? parseFloat(value.replace(/,/g, '')) : 0;
        onChange(isNaN(numericValue) ? 0 : numericValue);
    },
    []
  );

  const onSubmit = (values: FormValues) => {
    const { deposits, maturityDate, interestRate, interestType, taxType } = values;
    const rate = interestRate / 100;

    let totalInterest = 0;
    const principal = deposits.reduce((sum, p) => sum + p.amount, 0);

    if (interestType === 'simple') {
      totalInterest = deposits.reduce((sum, deposit) => {
        const days = differenceInDays(maturityDate, deposit.date);
        if (days < 0) return sum;
        const interest = deposit.amount * rate * (days / 365);
        return sum + interest;
      }, 0);
    } else { // 월 복리 근사치
      totalInterest = deposits.reduce((sum, deposit) => {
        const months = (maturityDate.getFullYear() - deposit.date.getFullYear()) * 12 + (maturityDate.getMonth() - deposit.date.getMonth());
        if (months <= 0) return sum;
        const monthlyRate = rate / 12;
        const finalValue = deposit.amount * Math.pow(1 + monthlyRate, months);
        return sum + (finalValue - deposit.amount);
      }, 0);
    }

    const preTaxInterest = Math.floor(totalInterest);
    const taxRateValue = taxType === 'general' ? 0.154 : taxType === 'preferential' ? 0.095 : 0;
    const tax = Math.floor(preTaxInterest * taxRateValue);
    const postTaxInterest = preTaxInterest - tax;
    const finalAmount = principal + postTaxInterest;

    setResult({
      principal,
      preTaxInterest,
      tax,
      postTaxInterest,
      finalAmount,
      taxRate: taxRateValue * 100,
    });
    toast.success('자유적금 계산이 완료되었습니다.');
  };

  const LeftColumn = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="space-y-6 flex-grow">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">납입금 정보</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-2 p-2 border rounded-md">
                <div className="flex-grow space-y-2">
                  <FormField
                    control={form.control}
                    name={`deposits.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>납입일</FormLabel>
                        <FormControl><CustomDatePickerWithPopover date={field.value} setDate={field.onChange} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`deposits.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>납입금액 (원)</FormLabel>
                        <FormControl><Input placeholder="납입금액" {...field} onChange={handleNumericInputChange(field.onChange)} className="text-right" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-7">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ date: new Date(), amount: 0 })} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> 납입금 추가
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">적금 정보</h3>
            <FormField
              control={form.control}
              name="maturityDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>만기일</FormLabel>
                  <FormControl><CustomDatePickerWithPopover date={field.value} setDate={field.onChange} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>연 이자율 (%)</FormLabel>
                  <FormControl><Input placeholder="연 이자율" {...field} onChange={handleNumericInputChange(field.onChange)} className="text-right" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이자 계산 방식</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="이자 계산 방식을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="simple">단리</SelectItem>
                      <SelectItem value="compound">월복리</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>과세 옵션</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="과세 옵션을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">일반과세 (15.4%)</SelectItem>
                      <SelectItem value="preferential">세금우대 (9.5%)</SelectItem>
                      <SelectItem value="non-taxable">비과세 (0%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <Button type="submit" className="w-full">계산하기</Button>
        </div>
      </form>
    </Form>
  );

  const RightColumn = (
    <div className="h-full flex flex-col">
      <CardContent className="flex-grow">
        {result ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-muted-foreground">만기 시 예상 수령액</p>
              <p className="text-4xl font-bold text-primary">{formatNumber(result.finalAmount)}원</p>
            </div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>총 납입 원금</TableCell>
                  <TableCell className="text-right">{formatNumber(result.principal)}원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>세전 이자</TableCell>
                  <TableCell className="text-right">{formatNumber(result.preTaxInterest)}원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>이자과세 ({result.taxRate}%)</TableCell>
                  <TableCell className="text-right text-red-500">-{formatNumber(result.tax)}원</TableCell>
                </TableRow>
                <TableRow className="font-semibold">
                  <TableCell>세후 수령 이자</TableCell>
                  <TableCell className="text-right">{formatNumber(result.postTaxInterest)}원</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            계산하기 버튼을 눌러주세요
          </div>
        )}
      </CardContent>
    </div>
  );



  const infoSection = {
    calculatorDescription: '자유적금은 정해진 날짜나 금액 없이, 원하는 때에 원하는 금액만큼 자유롭게 납입할 수 있는 적금 상품입니다. 매달 고정된 금액을 납입하기 어려운 분들에게 유연한 저축 방법을 제공합니다.',
    calculationFormula: (
      <> 
        <p>각 납입금에 대해 만기일까지의 기간을 계산하여 이자를 산출한 후, 모든 이자를 합산합니다.</p>
        <p><strong>단리:</strong> 이자 = 납입금액 × 연이율 × (납입일로부터 만기일까지의 일수 / 365)</p>
        <p><strong>월복리:</strong> 각 납입금에 대해 월 단위로 복리 계산을 적용하여 합산합니다. (본 계산기에서는 근사치를 사용합니다)</p>
      </>
    ),
    usefulTips: (
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>초기에 많이 납입:</strong> 이자는 예치 기간에 비례하므로, 적금 초기에 더 많은 금액을 납입하면 만기 시 더 많은 이자를 받을 수 있습니다.</li>
        <li><strong>비과세/세금우대 활용:</strong> 가입 요건이 된다면 비과세 종합저축이나 세금우대 상품을 활용하여 절세 효과를 누리세요.</li>
        <li><strong>자동이체 활용:</strong> 자유적금이라도 목표 금액 달성을 위해 매월 특정일에 일정 금액을 자동이체 해두면 꾸준한 저축 습관을 기르는 데 도움이 됩니다.</li>
      </ul>
    )
  };

  return (
    <CalculatorsLayout
      title="자유적금 계산기"
      description="자유로운 납입 계획에 따른 만기 수령액을 계산해보세요."
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={infoSection}
    />
  )
}

export default FreeInstallmentSavingsPage