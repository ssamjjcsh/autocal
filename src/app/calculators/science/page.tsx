"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const SciencePage = () => {
  const scienceCategory = calculatorCategories.find(cat => cat.id === 'science');

  if (!scienceCategory) {
    return <div>과학 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...scienceCategory,
    description: '물리학, 화학 등 다양한 과학 분야의 계산기를 제공합니다. 복잡한 과학적 계산을 빠르고 정확하게 해결하여 연구와 학습에 도움을 받으세요.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default SciencePage;