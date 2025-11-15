'use client';

import { useParams } from 'next/navigation';
import { calculators } from '@/data/calculators';

export default function CalculatorPage() {
  const params = useParams();

  if (!params) {
    return <div>Loading...</div>;
  }

  const categorySlug = params.category as string;
  const calculatorId = params.id as string;

  const categoryCalculators = calculators[categorySlug as keyof typeof calculators] || [];
  const calculator = categoryCalculators.find(calc => calc.id === calculatorId);

  if (!calculator) {
    return <div>계산기를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{calculator.name}</h1>
      <p className="text-lg text-gray-600 mb-8">{calculator.description}</p>
      {/* 여기에 각 계산기의 실제 구현이 들어갑니다. */}
      <div className="bg-gray-100 p-8 rounded-lg">
        <p>계산기 구현 영역</p>
      </div>
    </div>
  );
}