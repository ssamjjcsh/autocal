"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber, parseNumber } from "@/utils/formatNumber";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function CagrCalculator() {
  const [startValue, setStartValue] = useState<number>(10000000);
  const [endValue, setEndValue] = useState<number>(20000000);
  const [period, setPeriod] = useState<number>(5);
  const [cagr, setCagr] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [view, setView] = useState('chart');

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value.replace(/,/g, ''));
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const calculate = () => {
    if (isNaN(startValue) || startValue <= 0) {
      toast.error("초기 자산을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(endValue)) {
      toast.error("최종 자산을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(period) || period <= 0) {
      toast.error("투자 기간을 올바르게 입력해주세요.");
      return;
    }

    const cagrValue = (Math.pow(endValue / startValue, 1 / period) - 1) * 100;

    if (isNaN(cagrValue) || !isFinite(cagrValue)) {
      setCagr(null);
      setChartData([]);
      toast.error("계산 결과가 유효하지 않습니다. 입력값을 확인해주세요.");
      return;
    }

    setCagr(cagrValue);

    const data = Array.from({ length: period + 1 }, (_, i) => {
      const year = i;
      const value = startValue * Math.pow(1 + cagrValue / 100, year);
      return {
        year: `${year}년차`,
        '자산가치': parseFloat(value.toFixed(0)),
      };
    });
    setChartData(data);
    toast.success("CAGR 계산이 완료되었습니다.");
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="startValue">초기 자산 (원)</Label>
        <Input
          id="startValue"
          value={startValue.toLocaleString()}
          onChange={handleInputChange(setStartValue)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="endValue">최종 자산 (원)</Label>
        <Input
          id="endValue"
          value={endValue.toLocaleString()}
          onChange={handleInputChange(setEndValue)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="period">투자 기간 (년)</Label>
        <Input
          id="period"
          value={period.toLocaleString()}
          onChange={handleInputChange(setPeriod)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <Button onClick={calculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="h-full w-full flex flex-col">
      {cagr !== null ? (
        <div className="text-center mb-4">
          <p className="text-lg text-muted-foreground">연평균 성장률 (CAGR)</p>
          <p className="text-4xl sm:text-5xl font-bold text-primary">
            {cagr.toFixed(2)}%
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>계산 결과가 여기에 표시됩니다.</p>
        </div>
      )}
      {cagr !== null && chartData.length > 0 && (
        <div className="flex-grow">
          <div className="flex justify-end mb-2">
            <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)} size="sm">
              <ToggleGroupItem value="chart">차트</ToggleGroupItem>
              <ToggleGroupItem value="table">표</ToggleGroupItem>
            </ToggleGroup>
          </div>
          {view === 'chart' ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis tickFormatter={(value) => value.toLocaleString()} fontSize={12} />
                <RechartsTooltip formatter={(value: number) => `${value.toLocaleString()} 원`} />
                <Legend />
                <Line type="monotone" dataKey="자산가치" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>연도</TableHead>
                    <TableHead className="text-right">자산가치 (원)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((data) => (
                    <TableRow key={data.year}>
                      <TableCell>{data.year}</TableCell>
                      <TableCell className="text-right">{data.자산가치.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const infoSectionContent = {
    calculatorDescription: (
      <>
        CAGR(Compound Annual Growth Rate)은 연평균 성장률을 의미하며, 특정 기간 동안의 투자 성과를 측정하는 데 사용되는 지표입니다. CAGR은 투자가 매년 동일한 비율로 성장했다고 가정하여 계산되므로, 변동성이 큰 시장에서도 투자의 평균적인 성장 추세를 파악하는 데 유용합니다.
      </>
    ),
    calculationFormula: (
      <>
        <p>CAGR은 다음 공식에 따라 계산됩니다:</p>
        <p className="mt-2 p-2 bg-muted rounded-md text-sm">CAGR = ((최종 자산 / 초기 자산) ^ (1 / 투자 기간)) - 1</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>초기 자산:</strong> 투자 시작 시점의 자산 가치</li>
          <li><strong>최종 자산:</strong> 투자 종료 시점의 자산 가치</li>
          <li><strong>투자 기간:</strong> 투자를 진행한 햇수</li>
        </ul>
      </>
    ),
    usefulTips: (
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>장기적인 관점:</strong> CAGR은 단기적인 시장 변동성을 완화해주므로 장기적인 투자 성과를 평가하는 데 더 적합합니다.</li>
        <li><strong>다양한 투자 비교:</strong> 여러 다른 투자의 CAGR을 비교하여 어떤 투자가 더 나은 성과를 보였는지 객관적으로 평가할 수 있습니다.</li>
        <li><strong>미래 예측의 한계:</strong> CAGR은 과거 데이터를 기반으로 한 평균 성장률이므로 미래의 성과를 보장하지는 않습니다. 투자 결정을 내릴 때 참고 자료로만 활용하세요.</li>
      </ul>
    ),
  };

  return (
    <CalculatorsLayout
      title="CAGR (연평균 성장률) 계산기"
      description="투자의 연평균 성장률을 계산하여 성과를 측정합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSectionContent}
    />
  );
}