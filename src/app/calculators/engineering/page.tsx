"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const EngineeringPage = () => {
  const engineeringCategory = calculatorCategories.find(cat => cat.id === 'engineering');

  if (!engineeringCategory) {
    return <div>공학 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...engineeringCategory,
    description: '유체 역학 등 다양한 공학 분야의 계산기를 제공합니다. 복잡한 공학 문제를 해결하고 설계 및 분석 작업을 효율적으로 수행해 보세요.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default EngineeringPage;