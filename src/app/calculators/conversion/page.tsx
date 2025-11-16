"use client";

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      <div className="flex items-center gap-2 mb-4 relative">
        <select 
          aria-label="Select unit to convert from"
          value={fromUnit} 
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-[100px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400/50"
        >
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
        <Input 
          type="number" 
          value={fromValue} 
          onChange={(e) => setFromValue(e.target.value)}
          className="text-right text-xs w-[200px]"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {units.map(unit => (
          <div key={unit} className="flex items-center justify-start gap-2">
            <span className="text-right w-[120px] text-xs py-2 px-3 bg-gray-100 rounded-md shadow-inner">{convertedValues[unit]?.toFixed(2) || ''}</span>
            <span className="text-xs text-black whitespace-nowrap text-left font-bold">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ConversionPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">단위 변환 계산기</h1>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col">
        <Tabs defaultValue="basic" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="basic" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-gray-800 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm">기본 단위</TabsTrigger>
            <TabsTrigger value="engineering" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-gray-800 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm">공학 단위</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="flex-grow">
            <Tabs defaultValue={unitCategories.group1[0].id} className="w-full h-full flex flex-col">
              <TabsList className="inline-flex h-10 items-center justify-start bg-white p-1 text-muted-foreground">
                {unitCategories.group1.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">{category.name}</TabsTrigger>
                ))}
              </TabsList>
              {unitCategories.group1.map((category) => (
                <TabsContent key={category.id} value={category.id} className="border-x border-b border-gray-200 rounded-b-md border-t border-gray-200 p-6 flex-grow">
                  <NewUnitConverter category={category.id} />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="engineering" className="flex-grow">
            <Tabs defaultValue={unitCategories.group2[0].id} className="w-full h-full flex flex-col">
              <TabsList className="inline-flex h-10 items-center justify-start bg-white p-1 text-muted-foreground">
                {unitCategories.group2.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">{category.name}</TabsTrigger>
                ))}
              </TabsList>
              {unitCategories.group2.map((category) => (
                <TabsContent key={category.id} value={category.id} className="border-x border-b border-gray-200 rounded-b-md border-t border-gray-200 p-6 flex-grow">
                  <NewUnitConverter category={category.id} />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}