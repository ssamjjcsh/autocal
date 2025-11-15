'use client';

import React, { useState } from 'react';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { differenceInYears } from 'date-fns';

const ManNaiCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [baseDate, setBaseDate] = useState<Date | undefined>(undefined);
  const [manNaiResult, setManNaiResult] = useState<number | null>(null);

  const calculateManNai = () => {
    if (!birthDate || !baseDate) {
      alert('생년월일과 기준일을 모두 입력해주세요.');
      return;
    }

    const age = differenceInYears(baseDate, birthDate);

    setManNaiResult(age);
  };

  const inputSection = (
    <div className="grid w-full items-center gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="birthDate">생년월일</Label>
        <CustomDatePickerWithPopover
          date={birthDate ? new Date(birthDate) : undefined}
          setDate={(date) => setBirthDate(date || undefined)}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="baseDate">기준일</Label>
        <CustomDatePickerWithPopover
          date={baseDate ? new Date(baseDate) : undefined}
          setDate={(date) => setBaseDate(date || undefined)}
        />
      </div>
      <Button onClick={calculateManNai}>계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="text-center">
      {manNaiResult !== null ? (
        <p className="text-2xl font-bold">만 나이는 {manNaiResult}세입니다.</p>
      ) : (
        <p className="text-muted-foreground">계산 결과가 여기에 표시됩니다.</p>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: "만 나이 계산기는 생년월일과 기준일을 입력하여 만 나이를 계산해주는 도구입니다. 만 나이는 법적, 행정적으로 사용되는 공식적인 나이 계산법으로 대한민국의 다양한 법률 및 규정에서 기준으로 사용됩니다.",
    calculationFormula: "만 나이 = 기준일의 연도 - 출생 연도 - (생일이 지나지 않았으면 1, 그렇지 않으면 0)",
    usefulTips: "만 나이는 법적, 행정적으로 사용되는 공식적인 나이 계산법입니다. 대한민국의 다양한 법률 및 규정에서 만 나이를 기준으로 합니다. 2023년 6월부터는 법적으로 만 나이 사용이 의무화되었습니다."
  };

  return (
    <CalculatorsLayout
      title="만 나이 계산기"
      description="생년월일과 기준일을 입력하여 만 나이를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default ManNaiCalculator;