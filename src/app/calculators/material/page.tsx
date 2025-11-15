"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const MaterialPage = () => {
  const materialCategory = calculatorCategories.find(cat => cat.id === 'material');

  if (!materialCategory) {
    return <div>재료 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...materialCategory,
    description: '다양한 재료의 속성을 확인하고, 재료 간 비교를 통해 최적의 선택을 할 수 있도록 돕는 계산기입니다. 부식 관련 계산도 제공하여 재료의 수명을 예측하고 관리하는 데 도움을 줍니다.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default MaterialPage;