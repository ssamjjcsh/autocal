'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateRequiredContainers, CONTAINER_SPECS } from '@/utils/calculations';

const CBMCalculator: NextPage = () => {
  const [length, setLength] = useState<number>(100);
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [weight, setWeight] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('cm');
  const [displayedResult, setDisplayedResult] = useState<any>(null);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setter(isNaN(value) ? 0 : value);
    };

  // 단위 변환: 모든 길이를 미터(m)로 변환
  const convertToMeter = (value: number, currentUnit: string): number => {
    switch (currentUnit) {
      case 'cm':
        return value / 100;
      case 'inch':
        return value * 0.0254;
      case 'm':
        return value;
      case 'ft':
        return value * 0.3048;
      default:
        return value;
    }
  };

  const { calculationResult, error } = useMemo(() => {
    const lM = convertToMeter(length, unit);
    const wM = convertToMeter(width, unit);
    const hM = convertToMeter(height, unit);

    if (
      isNaN(lM) ||
      isNaN(wM) ||
      isNaN(hM) ||
      isNaN(weight) ||
      isNaN(quantity) ||
      lM <= 0 ||
      wM <= 0 ||
      hM <= 0 ||
      quantity <= 0
    ) {
      return {
        calculationResult: null,
        error: '모든 필드를 올바르게 입력해주세요.',
      };
    }

    // m³ 기준 계산
    const volumeM3 = lM * wM * hM;
    const totalVolumeM3 = volumeM3 * quantity;
    const totalWeight = weight * quantity;

    // cm³ 변환용 (표시용)
    const volumeCm3 = volumeM3 * 1_000_000;

    return {
      calculationResult: {
        volumeCm3,
        volumeM3,
        totalVolumeM3,
        totalWeight,
      },
      error: null,
    };
  }, [length, width, height, weight, quantity, unit]);

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error);
      setDisplayedResult(null);
    } else if (calculationResult) {
      const { totalVolumeM3, totalWeight, volumeM3 } = calculationResult;
      const hM = convertToMeter(height, unit); // 개별 박스 높이 (미터)

      const requiredContainers = calculateRequiredContainers({
        totalVolumeM3,
        totalWeightKg: totalWeight,
        singleBoxVolumeM3: volumeM3,
        singleBoxHeightM: hM,
      });

      setDisplayedResult({
        ...calculationResult,
        requiredContainers,
      });
      toast.success('CBM 계산이 완료되었습니다.');
    }
  }, [calculationResult, error, height, unit]);

  // 입력 영역
  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">가로</Label>
          <Input
            id="length"
            value={length}
            onChange={handleInputChange(setLength)}
            placeholder="가로 길이"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">세로</Label>
          <Input
            id="width"
            value={width}
            onChange={handleInputChange(setWidth)}
            placeholder="세로 길이"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">높이</Label>
          <Input
            id="height"
            value={height}
            onChange={handleInputChange(setHeight)}
            placeholder="높이"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">단위</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="단위 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="inch">inch</SelectItem>
              <SelectItem value="m">m</SelectItem>
              <SelectItem value="ft">ft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">단위 중량 (kg)</Label>
          <Input
            id="weight"
            value={weight}
            onChange={handleInputChange(setWeight)}
            placeholder="단위 중량"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">수량</Label>
          <Input
            id="quantity"
            value={quantity}
            onChange={handleInputChange(setQuantity)}
            placeholder="수량"
            className="text-right"
            type="number"
          />
        </div>
      </div>

      <Button onClick={handleCalculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  // 결과 영역
  const resultSection = (
    <>
      {displayedResult ? (
        <div className="w-full space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">BOX 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">개당 부피 (CBM):</span>
                  <span className="font-mono">{displayedResult.volumeM3.toFixed(3)} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">개당 부피 (cm³):</span>
                  <span className="font-mono">{displayedResult.volumeCm3.toFixed(0)} cm³</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">계산 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 부피 (CBM):</span>
                  <span className="font-mono font-bold">{displayedResult.totalVolumeM3.toFixed(3)} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 중량:</span>
                  <span className="font-mono font-bold">{displayedResult.totalWeight.toFixed(1)} kg</span>
                </div>
                {displayedResult.requiredContainers && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (1단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].singleStack} 개</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (2단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].doubleStack} 개</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">컨테이너 적재 예상량</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">※ 각 컨테이너에 적재 가능한 박스(개별 화물)의 예상 개수입니다.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                <p className="text-muted-foreground">20ft</p>
                <p>{Math.floor(33.2 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(33.2 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">40ft</p>
                <p>{Math.floor(67.6 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(67.6 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">40HC</p>
                <p>{Math.floor(76.3 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(76.3 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">20ft(2단)</p>
                <p>{Math.floor(66.4 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(66.4 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              </div>
            </CardContent>
          </Card>

          {/* 결과 총합 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">결과 총합</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 CBM:</span>
                  <span className="font-mono font-bold">{displayedResult.totalVolumeM3.toFixed(3)} CBM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 중량:</span>
                  <span className="font-mono font-bold">{displayedResult.totalWeight.toFixed(1)} kg</span>
                </div>
                {displayedResult.requiredContainers && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (1단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].singleStack} 개</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (2단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].doubleStack} 개</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          계산하기 버튼을 눌러주세요
        </div>
      )}
    </>
  );

  const containerSpecifications = (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">길이 (m)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">너비 (m)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">높이 (m)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내부 부피 (m³)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최대 중량 (kg)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(CONTAINER_SPECS).map(([type, spec]) => (
            <tr key={type}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.interiorLength}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.interiorWidth}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.interiorHeight}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.maxVolumeM3}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.maxWeightKg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const infoSection = {
    calculatorDescription:
      'CBM(Cubic Meter)은 화물의 부피를 나타내는 단위로, 가로, 세로, 높이를 곱하여 계산됩니다. 이 계산기는 입력된 화물의 길이, 단위, 중량, 수량을 바탕으로 총 부피(CBM)와 총 중량을 계산하여 물류 계획에 도움을 줍니다.',
    calculationFormula: (
      <>
        <p className="mb-2">CBM 계산 공식:</p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          개당 부피 (m³) = (가로 × 세로 × 높이) (모두 m 단위로 변환)
        </p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          총 부피 (CBM) = 개당 부피 (m³) × 수량
        </p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          총 중량 (kg) = 단위 중량 (kg) × 수량
        </p>
      </>
    ),
    containerLoadingExplanation: (
      <>
        <h3 className="text-lg font-semibold mb-3">컨테이너 적재 예상량 계산</h3>
        <p className="mb-2">
          컨테이너 적재 예상량은 다음 공식에 따라 계산됩니다.
        </p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          이론적 적재량 = 컨테이너 내부 용적 (m³) / 개당 부피 (m³)
        </p>
        <p className="font-mono p-2 bg-muted rounded-md my-2 text-sm">
          현실적 적재량 = 이론적 적재량 × 0.85 (85% 적재 효율 적용)
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
          <li>
            <strong>컨테이너 내부 용적:</strong> 각 컨테이너 타입별 내부 최대 적재 가능 부피
          </li>
          <li>
            <strong>개당 부피 (m³):</strong> 계산된 화물 한 개당 부피
          </li>
          <li>
            <strong>85% 적재 효율:</strong> 컨테이너 내부의 문턱, 천장 곡선, 공기층, 적재 여유 공간 등으로 인해 실제 적재 효율이 이론적 최대치보다 낮아지는 점을 반영한 값입니다.
          </li>
        </ul>
      </>
    ),
    containerSpecifications: containerSpecifications,
    usefulTips: (
      <>
        <p className="mb-2">💡 유용한 팁:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>화물의 크기는 가능한 정확히 측정하세요. 작은 오차도 대량의 화물에서는 큰 차이를 만들 수 있습니다.</li>
          <li>CBM은 해상 운송료 산정의 기준이 되므로 정확한 측정이 중요합니다.</li>
          <li>컨테이너 적재 예상량은 이론적인 값이며, 실제로는 포장 형태와 적재 방식에 따라 달라질 수 있습니다.</li>
        </ul>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title="CBM 계산기"
      description="화물의 부피(CBM)와 총 중량을 계산하여 물류 계획에 도움을 받으세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CBMCalculator;
