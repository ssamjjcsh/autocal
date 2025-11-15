'use client';

import { useState, useMemo } from 'react';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';

export default function AnnualLeaveCalculator() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<number>(5);
  const [annualLeaveDays, setAnnualLeaveDays] = useState<number>(0);

  const calculateAnnualLeave = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 1년 미만 근속 시 1개월 개근 시 1일 발생
    if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return diffMonths;
    }

    // 1년 이상 근속 시
    const years = Math.floor(diffDays / 365);
    let leave = 15; // 1년 이상 2년 미만 15일

    if (years >= 3) {
      leave += Math.floor((years - 2) / 2) * 1; // 3년차부터 2년마다 1일 가산
    }
    return leave;
  }, [startDate, endDate, workDaysPerWeek]);

  const handleCalculate = () => {
    setAnnualLeaveDays(calculateAnnualLeave);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setWorkDaysPerWeek(5);
    setAnnualLeaveDays(0);
  };

  const inputSectionContent = (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">연차 정보 입력</h2>
      <div className="space-y-2">
        <Label htmlFor="startDate">입사일</Label>
        <CustomDatePickerWithPopover date={startDate} setDate={setStartDate} placeholder="입사일 선택" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">퇴사일 (또는 현재일)</Label>
        <CustomDatePickerWithPopover date={endDate} setDate={setEndDate} placeholder="퇴사일 선택" />
      </div>
      <div>
        <Label>주당 근무일수</Label>
        <RadioGroup
          value={String(workDaysPerWeek)}
          onValueChange={(value: string) => setWorkDaysPerWeek(parseFloat(value))}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="work5" />
            <Label htmlFor="work5">5일</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6" id="work6" />
            <Label htmlFor="work6">6일</Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
      <Button onClick={handleReset} className="w-full" variant="outline">초기화</Button>
    </div>
  );

  const resultSectionContent = (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">계산 결과</h2>
      <div className="bg-gray-100 p-4 rounded-md space-y-2">
        <p><strong>총 발생 연차:</strong> {annualLeaveDays} 일</p>
      </div>
    </div>
  );

  return (
    <CalculatorsLayout
      title="연차 계산기"
      inputSection={inputSectionContent}
      resultSection={resultSectionContent}
      infoSection={{
        calculatorDescription:
          '연차 계산기는 근로기준법에 따라 근로자가 받을 수 있는 연차 유급휴가 일수를 계산하는 도구입니다. 입사일 기준 또는 회계연도 기준으로 연차를 계산할 수 있으며, 2017년 및 2020년 연차 개정안이 반영됩니다.',
        calculationFormula: (
          <>
            <p className="mb-2">연차 계산 공식은 입사일 기준과 회계연도 기준으로 나뉩니다.</p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>
                <strong>1년 미만 근로자:</strong> 1개월 개근 시 1일의 유급휴가 발생 (최대 11일) <a href="https://work.calculate.co.kr/annual-leave-calculator" target="_blank" rel="noopener noreferrer">참조</a>
              </li>
              <li>
                <strong>1년 이상 근로자:</strong> 1년간 80% 이상 출근 시 15일의 유급휴가 발생 <a href="https://www.saramin.co.kr/zf_user/tools/holi-calculator" target="_blank" rel="noopener noreferrer">참조</a>
              </li>
              <li>
                <strong>3년 이상 근로자:</strong> 최초 1년을 초과하는 매 2년에 대하여 1일 가산 (최대 25일) <a href="https://www.saramin.co.kr/zf_user/tools/holi-calculator" target="_blank" rel="noopener noreferrer">참조</a>
              </li>
              <li>
                <strong>회계연도 기준 계산 시 (입사 다음 연도):</strong> (입사 연도 재직일수 ÷ 365일) x 15 <a href="https://work.calculate.co.kr/annual-leave-calculator" target="_blank" rel="noopener noreferrer">참조</a>
              </li>
            </ul>
          </>
        ),
        usefulTips: (
          <>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>
                연차는 발생일로부터 1년 이내에 사용하지 않으면 소멸됩니다. <a href="https://zuzu.network/resource/guide/annual-leave-calculation-method/" target="_blank" rel="noopener noreferrer">참조</a>
              </li>
              <li>
                퇴사 시 미사용 연차에 대한 연차수당을 받을 수 있습니다. <a href="https://zuzu.network/resource/guide/annual-leave-calculation-method/" target="_blank" rel="noopener noreferrer">참조</a>
              </li>
              <li>
                본 계산기는 모의 계산 결과로 법적 효력이 없으며, 사내 규정에 따라 실제 연차와 차이가 있을 수 있으니 참고용으로 활용하시기 바랍니다. <a href="https://work.calculate.co.kr/annual-leave-calculator" target="_blank" rel="noopener noreferrer">참조1</a> <a href="https://www.saramin.co.kr/zf_user/tools/holi-calculator" target="_blank" rel="noopener noreferrer">참조4</a>
              </li>
            </ul>
          </>
        ),
      }}
    />
  );
};

// export default AnnualLeaveCalculator; // 이 줄을 제거합니다.