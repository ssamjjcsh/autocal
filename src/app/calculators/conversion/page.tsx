"use client";

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNIT_DEFINITIONS, convert } from '@/utils/unitConversion';

const group1 = ['length', 'area', 'volume', 'temperature'];
const group2 = ['flow', 'pressure', 'energy', 'mass', 'enthalpy'];

const unitCategories = {
  group1: group1.map(id => ({ id, name: UNIT_DEFINITIONS[id]?.name || id })),
  group2: group2.map(id => ({ id, name: UNIT_DEFINITIONS[id]?.name || id })),
};

const NewUnitConverter = ({ category }: { category: string }) => {
  const categoryData = UNIT_DEFINITIONS[category];
  
  const units = useMemo(() => {
    if (!categoryData) return [];
    return Object.keys(categoryData.units);
  }, [categoryData]);

  const [fromUnit, setFromUnit] = useState('');
  const [fromValue, setFromValue] = useState('1');
  const [convertedValues, setConvertedValues] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (categoryData && units.length > 0) {
      setFromUnit(units[0]);
    } else {
      setFromUnit(''); // units가 비어있으면 fromUnit을 빈 문자열로 초기화
    }
  }, [units, categoryData]);

  useEffect(() => {
    if (!categoryData || !fromUnit || !units.includes(fromUnit)) {
      setConvertedValues({});
      return;
    }
    const value = parseFloat(fromValue);
    if (!isNaN(value)) {
      const newValues: {[key: string]: number} = {};
      units.forEach(unit => {
        newValues[unit] = convert(value, fromUnit, unit, category);
      });
      setConvertedValues(newValues);
    } else {
      setConvertedValues({});
    }
  }, [fromValue, fromUnit, category, units, categoryData]);

  if (!categoryData) return <p>정의되지 않은 단위 카테고리입니다.</p>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Select value={fromUnit} onValueChange={setFromUnit}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {units.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input 
          type="number" 
          value={fromValue} 
          onChange={(e) => setFromValue(e.target.value)}
          className="text-right"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {units.map(unit => (
          <div key={unit} className="flex items-center gap-2">
            <span className="w-[80px] text-sm text-gray-500">{unit}</span>
            <Input 
              type="number" 
              value={convertedValues[unit]?.toFixed(2) || ''} 
              readOnly 
              className="text-right bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ConversionPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">단위 변환 계산기</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>기본 단위</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={unitCategories.group1[0].id} className="w-full">
            <TabsList>
              {unitCategories.group1.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
              ))}
            </TabsList>
            {unitCategories.group1.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <NewUnitConverter category={category.id} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>공학 단위</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={unitCategories.group2[0].id} className="w-full">
            <TabsList>
              {unitCategories.group2.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
              ))}
            </TabsList>
            {unitCategories.group2.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <NewUnitConverter category={category.id} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionPage;